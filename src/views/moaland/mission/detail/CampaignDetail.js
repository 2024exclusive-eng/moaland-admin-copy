import {ApplicantHeaders, ApplicantCells} from './ApplicantCells'
import {applicantColumns, applicantExcel} from './applicantFields'
import {isSuperAdmin} from '../../../../utility/adminPermissions'
import CampaignNotifications from './CampaignNotifications'
import CampaignOwner from './CampaignOwner'
/* eslint-disable multiline-ternary */
/* eslint-disable implicit-arrow-linebreak */
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import moment from "moment";
import { Card, CardBody, Button, Table, Badge } from "reactstrap";
import axios from "axios";
import { getRegionLabel, getCategoryLabel } from "../constants";
import { getStatusBadgeConfig } from "../../../../utility/missionStatus";
import { utils, write } from "xlsx";
import { saveAs } from "file-saver";
import { Download } from "react-feather";
import "@components/editor/editor.css";
import "./CampaignDetail.scss";

const CampaignDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [channel, setChannel] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/admin/mission/${id}`);
        setData(response);
      } catch (error) {
        console.error("Error fetching campaign data:", error);
      }
    };
    if (id !== "new") {
      fetchData();
    }
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      try {
        await axios.delete(`/admin/mission/${id}`);
        alert("삭제되었습니다.");
        navigate("/moaland/manage/campaign");
      } catch (error) {
        console.error("Error deleting campaign:", error);
        alert("삭제 중 오류가 발생했습니다.");
      }
    }
  };

  const handleCorrection = () => {
    navigate(`/moaland/manage/campaign/modify/${id}`);
  };

  const handleSelectApplicant = async (enrollId, type = "selected") => {
    try {
      await axios.post(`/admin/mission/status/${enrollId}/${type}`);
      alert("검수가 완료되었습니다");
      window.location.reload();
    } catch (error) {
      console.error("Error selecting applicant:", error);
      alert("선정 중 오류가 발생했습니다.");
    }
  };

  const formatDate = (date) => {
    if (!date) return "-";
    return moment(date).format("YY.MM.DD");
  };

  const formatDateRange = (start, end) => {
    if (!start || !end) return "-";
    return `${moment(start).format("YY.MM.DD")} - ${moment(end).format(
      "YY.MM.DD"
    )}`;
  };

  const mission = data?.mission || {};
  const columns = applicantColumns([...(data?.enrollUsers || []), ...(data?.selectUsers || []), ...(data?.completeUsers || []), ...(data?.rejectUsers || [])]);
  const byChannel = row => !channel || row.channel === channel;
  const enrollUsers = (data?.enrollUsers || []).filter(byChannel);
  const selectUsers = (data?.selectUsers || []).filter(byChannel);
  const completedUsers = (data?.completeUsers || []).filter(byChannel);
  const rejectUsers = (data?.rejectUsers || []).filter(byChannel);

  // P31: 신청자 sorted by 신청일 (created), 선정자 by 방문 날짜 시간 (visit_datetime_start)
  const sortedApplicants = [...enrollUsers, ...selectUsers].sort(
    (a, b) => new Date(a.created) - new Date(b.created),
  );
  const sortedSelected = [...selectUsers, ...completedUsers].sort(
    (a, b) => new Date(a.visit_datetime_start) - new Date(b.visit_datetime_start),
  );
  const socialPlatforms = mission.social ? mission.social.split(",") : [];
  const linkTitles = {
    Xiaohongshu: "샤오홍슈",
    Douyin: "도우인",
    Instagram: "인스타",
    Dajongdienping: "따중띠앤핑",
    Youtube: "유튜브",
  };

  // Helper function to ensure URL has proper protocol
  const ensureHttpsUrl = (url) => {
    if (!url || typeof url !== "string") return null;
    const trimmedUrl = url.trim();
    if (!trimmedUrl) return null;
    // If URL already has a protocol, return as-is (but upgrade http to https)
    if (trimmedUrl.startsWith("http://")) {
      return trimmedUrl.replace("http://", "https://");
    }
    if (trimmedUrl.startsWith("https://")) {
      return trimmedUrl;
    }
    // Add https:// prefix for URLs without protocol
    return `https://${trimmedUrl}`;
  };

  // Helper function to parse link JSON and get URL by social platform
  const getContentUrl = (user) => {
    if (!user?.link) return null;
    try {
      const linkObj = typeof user.link === "string" ? JSON.parse(user.link) : user.link;
      // Use the mission's social field or user's social field to get the correct URL
      const social = mission.social || user.social;
      if (social && linkObj[social]) {
        return ensureHttpsUrl(linkObj[social]);
      }
      // Fallback: return the first URL in the object
      const keys = Object.keys(linkObj);
      return keys.length > 0 ? ensureHttpsUrl(linkObj[keys[0]]) : null;
    } catch (e) {
      // If parsing fails, assume it's already a direct URL
      return ensureHttpsUrl(user.link);
    }
  };


  // Check if current date is between content start and end dates
  const now = moment().utcOffset(540); // Korea timezone (UTC+9)
  const isContentPeriod =
    mission.contentStartDate &&
    mission.contentEndDate &&
    now.isBetween(
      moment(mission.contentStartDate).utcOffset(540),
      moment(mission.contentEndDate).utcOffset(540),
      null,
      "[]"
    );

  const downloadApplicantsExcel = () => {
    const applicants = sortedApplicants;

    if (applicants.length === 0) {
      alert("다운로드할 데이터가 없습니다.");
      return;
    }

    const excelData = applicantExcel(applicants, columns, user => ({상태:user.status === 'selected' ? '선정됨' : '대기중'}));

    const worksheet = utils.json_to_sheet(excelData);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "신청자");

    const excelBuffer = write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const dataBlob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const fileName = `${mission.title}_신청자.xlsx`;
    saveAs(dataBlob, fileName);
  };

  const downloadSelectedExcel = () => {
    const selected = sortedSelected;

    if (selected.length === 0) {
      alert("다운로드할 데이터가 없습니다.");
      return;
    }

    const excelData = applicantExcel(selected, columns, user => ({'등록한 콘텐츠':getContentUrl(user) || '-', 검수상태:user.status === 'completed' ? '검수완료' : '검수대기'}));

    const worksheet = utils.json_to_sheet(excelData);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "선정자");

    const excelBuffer = write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const dataBlob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const fileName = `${mission.title}_선정자.xlsx`;
    saveAs(dataBlob, fileName);
  };

  return (
    <div>
      <div
        style={{ display: "flex", flexDirection: "column", gap: "12px" }}
        className="campaign-detail"
      >
        {/* Header */}
        <div className="campaign-detail-header">
          <h1 className="campaign-detail-title">캠페인 상세</h1>
          <div className="campaign-detail-actions">
            <Button className="btn-delete" onClick={handleDelete}>
              삭제
            </Button>
            <Button className="btn-correction" onClick={handleCorrection}>
              수정
            </Button>
          </div>
        </div>

        <CampaignOwner missionId={id} ownerAdminId={mission.ownerAdminId} />
        <CampaignNotifications users={[...enrollUsers, ...selectUsers, ...completedUsers, ...rejectUsers]} />
        {/* Basic Information */}
        <Card className="detail-card">
          <CardBody>
            <h2 className="section-title">기본 정보</h2>
            <div className="info-table">
              <div className="info-table-row six-cols">
                <div className="info-table-cell label">캠페인 상태</div>
                <div className="info-table-cell value">
                  {getStatusBadgeConfig(mission.computed_status).text}
                </div>
                <div className="info-table-cell label">캠페인 링크</div>
                <div className="info-table-cell value">
                  {mission.title || "[강남] 캠페인 장소"}
                </div>
                <div className="info-table-cell label">캠페인 번호</div>
                <div className="info-table-cell value">
                  {mission.id || "123412"}
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Provided Information */}
        <Card className="detail-card">
          <CardBody>
            <h2 className="section-title">제공 정보</h2>
            <div className="info-table">
              <div className="info-table-row">
                <div className="info-table-cell label">
                  캠페인 이름 (한국어)
                </div>
                <div className="info-table-cell value">
                  {mission.title || "-"}
                </div>
                <div className="info-table-cell label">
                  캠페인 이름 (중국어)
                </div>
                <div className="info-table-cell value">
                  {mission.titleCn || "-"}
                </div>
              </div>
              <div className="info-table-row">
                <div className="info-table-cell label">지역/장소명</div>
                <div className="info-table-cell value">
                  {mission.region ? getRegionLabel(mission.region) : "-"}
                </div>
                <div className="info-table-cell label">카테고리</div>
                <div className="info-table-cell value">
                  {mission.category ? getCategoryLabel(mission.category) : "-"}
                </div>
              </div>

              <div className="info-table-row">
                <div className="info-table-cell label">썸네일이미지</div>
                <div className="info-table-cell value">
                  <div className="image-preview">
                    {mission.thumbnailImg ? (
                      <img src={mission.thumbnailImg} alt="Thumbnail" />
                    ) : (
                      <div className="no-image">이미지 없음</div>
                    )}
                  </div>
                </div>
                <div className="info-table-cell label">상세이미지</div>
                <div className="info-table-cell value">
                  <div className="image-preview">
                    {mission.detailImg ? (
                      <img src={mission.detailImg} alt="Detail" />
                    ) : (
                      <div className="no-image">이미지 없음</div>
                    )}
                  </div>
                </div>
              </div>

              <div className="info-table-row">
                <div className="info-table-cell label">제공내역 (한국어)</div>
                <div className="info-table-cell value">
                  {mission.goodsContents || "-"}
                </div>
                <div className="info-table-cell label">제공내역 (중국어)</div>
                <div className="info-table-cell value">
                  {mission.goodsContentsCn || "-"}
                </div>
              </div>

              <div className="info-table-row">
                <div className="info-table-cell label">매장 위치</div>
                <div className="info-table-cell value" colSpan={3}>
                  {mission.address || "-"}
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Campaign Information */}
        <Card className="detail-card">
          <CardBody>
            <h2 className="section-title">캠페인 정보</h2>
            <div className="info-table">
              <div className="info-table-row four-cols">
                <div className="info-table-cell label">샤오홍슈</div>
                <div className="info-table-cell value">
                  {socialPlatforms[0]}
                </div>
                <div className="info-table-cell label">선정수</div>
                <div className="info-table-cell value">
                  {mission?.selectedParticipantCount ?? 0}
                </div>
              </div>

              <div className="info-table-row">
                <div className="info-table-cell label">캠페인 신청기간</div>
                <div className="info-table-cell value">
                  {formatDateRange(
                    mission.enrollStartDate,
                    mission.enrollEndDate
                  )}
                </div>
              </div>

              <div className="info-table-row">
                <div className="info-table-cell label">방문기간</div>
                <div className="info-table-cell value">
                  {formatDateRange(
                    mission.missionStartDate,
                    mission.missionEndDate
                  )}
                </div>
                <div className="info-table-cell label">콘텐츠 등록기간</div>
                <div className="info-table-cell value">
                  {formatDateRange(
                    mission.contentStartDate,
                    mission.contentEndDate
                  )}
                </div>
              </div>
              <div className="info-table-row">
                <div className="info-table-cell label">가이드라인 (한국어)</div>
                <div
                  className="info-table-cell value ck-content"
                  dangerouslySetInnerHTML={{ __html: mission.guideline || "-" }}
                />
                <div className="info-table-cell label">가이드라인 (중국어)</div>
                <div
                  className="info-table-cell value ck-content"
                  dangerouslySetInnerHTML={{
                    __html: mission.guidelineCn || "-",
                  }}
                />
              </div>
              <div className="info-table-row">
                <div className="info-table-cell label">
                  촬영/편집 미션 (한국어)
                </div>
                <div
                  className="info-table-cell value ck-content"
                  dangerouslySetInnerHTML={{
                    __html: mission.missionContents || "-",
                  }}
                />
                <div className="info-table-cell label">
                  촬영/편집 미션 (중국어)
                </div>
                <div
                  className="info-table-cell value ck-content"
                  dangerouslySetInnerHTML={{
                    __html: mission.missionContentsCn || "-",
                  }}
                />
              </div>
              <div className="info-table-row">
                <div className="info-table-cell label">
                  주의 안내사항 (한국어)
                </div>
                <div
                  className="info-table-cell value ck-content"
                  dangerouslySetInnerHTML={{
                    __html: mission.additionalInfo || "-",
                  }}
                />
                <div className="info-table-cell label">
                  주의 안내사항 (중국어)
                </div>
                <div
                  className="info-table-cell value ck-content"
                  dangerouslySetInnerHTML={{
                    __html: mission.additionalInfoCn || "-",
                  }}
                />
              </div>
            </div>
          </CardBody>
        </Card>

        <div className="d-flex flex-wrap align-items-center gap-2 p-2">
          <label htmlFor="applicant-channel">신청 경로 <select id="applicant-channel" className="ms-1" value={channel} onChange={e => setChannel(e.target.value)}><option value="">전체</option><option value="web">국내 웹</option><option value="wechat_mp">위챗 미니프로그램</option></select></label>
          <span className="text-muted">접수한 서비스 기준으로 자동 구분됩니다. 아래 목록과 엑셀에 함께 적용됩니다.</span>
        </div>
        {/* Applicant Table */}
        <Card className="detail-card">
          <CardBody>
            <div className="table-header">
              <div
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
                <h2 className="section-title">
                  신청자{" "}
                  <span style={{ color: "#509594" }}>
                    {enrollUsers.length + selectUsers.length}
                  </span>
                </h2>
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "16px" }}
              >
                <span className="table-subtitle">
                  *인플루언서 선정은 취소불가능합니다.
                </span>
                <Button
                  color="primary"
                  size="sm"
                  onClick={downloadApplicantsExcel}
                  disabled={enrollUsers.length + selectUsers.length === 0}
                  style={{ display: "flex", alignItems: "center", gap: "4px" }}
                >
                  <Download size={14} />
                  엑셀 다운받기
                </Button>
              </div>
            </div>
            <div className="table-responsive">
              <Table className="detail-table">
                <thead>
                  <tr>
                    <ApplicantHeaders columns={columns} />
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {enrollUsers.length === 0 && selectUsers.length === 0 ? (
                    <tr>
                      <td colSpan={columns.length + 4} className="text-center">
                        신청자가 없습니다
                      </td>
                    </tr>
                  ) : (
                    sortedApplicants.map((user, index) => (
                      <tr key={user.missionEnrollId}>
                        <ApplicantCells user={user} index={index} columns={columns} />
                        <td>
                          {user.is_delete === "Y" ? null : (
                            <>
                              <Button
                                size="sm"
                                className="btn-select"
                                style={{
                                  backgroundColor:
                                    user.status === "selected"
                                      ? "#F3F4F6 !important"
                                      : "#fff",
                                }}
                                disabled={
                                  user.status === "selected" ||
                                  user.is_delete === "Y"
                                }
                                onClick={() => {
                                  const now = moment().utcOffset(540);
                                  const isBeforeMissionEnd = !mission.missionEndDate ||
                                    now.isBefore(moment(mission.missionEndDate).utcOffset(540));

                                  if (isBeforeMissionEnd) {
                                    handleSelectApplicant(user.missionEnrollId);
                                  } else {
                                    alert("방문 기간이 지났습니다.");
                                  }
                                }}
                              >
                                {user.status === "selected"
                                  ? "선정됨"
                                  : "선정하기"}
                              </Button>
                              <Button
                                size="sm"
                                color="danger"
                                outline
                                style={{ marginLeft: "8px" }}
                                disabled={user.is_delete === "Y"}
                                onClick={() => {
                                  if (window.confirm("이 신청자를 반려 처리할까요?")) {
                                    handleSelectApplicant(user.missionEnrollId, "rejected");
                                  }
                                }}
                              >
                                반려
                              </Button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </div>
          </CardBody>
        </Card>

        {/* Selected Table */}
        <Card className="detail-card">
          <CardBody>
            <div className="table-header">
              <div
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
                <h2 className="section-title">
                  선정자{" "}
                  <span style={{ color: "#509594" }}>
                    {selectUsers.length + completedUsers.length}/
                    {mission.maxEnroll || 20}
                  </span>
                </h2>
              </div>
              <Button
                color="primary"
                size="sm"
                onClick={downloadSelectedExcel}
                disabled={selectUsers.length + completedUsers.length === 0}
                style={{ display: "flex", alignItems: "center", gap: "4px" }}
              >
                <Download size={14} />
                엑셀 다운받기
              </Button>
            </div>
            <div className="table-responsive">
              <Table className="detail-table">
                <thead>
                  <tr>
                    <ApplicantHeaders columns={columns} />
                    {isContentPeriod && <th>등록한 콘텐츠</th>}
                    <th>검수</th>
                  </tr>
                </thead>
                <tbody>
                  {selectUsers.length === 0 && completedUsers.length === 0 ? (
                    <tr>
                      <td colSpan={columns.length + 4 + (isContentPeriod ? 1 : 0)} className="text-center">
                        선정자가 없습니다
                      </td>
                    </tr>
                  ) : (
                    sortedSelected.map((user, index) => (
                      <tr key={user.missionEnrollId}>
                        <ApplicantCells user={user} index={index} columns={columns} />

                        {isContentPeriod && (
                          <td>
                            {getContentUrl(user) ? (
                              <a
                                href={getContentUrl(user)}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  textDecoration: "underline",
                                  color: "#509594",
                                }}
                              >
                                콘텐츠 URL
                              </a>
                            ) : (
                              "-"
                            )}
                          </td>
                        )}
                        <td>
                          <Button
                            className="btn-select"
                            style={{
                              backgroundColor:
                                user.status === "completed"
                                  ? "#F3F4F6 !important"
                                  : "#fff",
                            }}
                            onClick={() =>
                              handleSelectApplicant(
                                user.missionEnrollId,
                                "completed"
                              )
                            }
                            disabled={
                              !isSuperAdmin() || !user.link ||
                              user.status === "completed" ||
                              !isContentPeriod
                            }
                          >
                            {user.status === "completed"
                              ? "검수완료"
                              : "검수 완료"}
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </div>
          </CardBody>
        </Card>

        {/* Rejected Table */}
        <Card className="detail-card">
          <CardBody>
            <div className="table-header">
              <h2 className="section-title">
                반려 <span style={{ color: "#ea3a50" }}>{rejectUsers.length}</span>
              </h2>
            </div>
            <div className="table-responsive">
              <Table className="detail-table">
                <thead>
                  <tr>
                    <ApplicantHeaders columns={columns} />
                    <th>관리</th>
                  </tr>
                </thead>
                <tbody>
                  {rejectUsers.length === 0 ? (
                    <tr>
                      <td colSpan={columns.length + 4} className="text-center">반려된 신청자가 없습니다</td>
                    </tr>
                  ) : (
                    rejectUsers.map((user, index) => (
                      <tr key={user.missionEnrollId}>
                        <ApplicantCells user={user} index={index} columns={columns} />
                        <td>
                          <Button
                            size="sm"
                            color="secondary"
                            outline
                            onClick={() => handleSelectApplicant(user.missionEnrollId, "applied")}
                          >
                            반려취소
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default CampaignDetail;
