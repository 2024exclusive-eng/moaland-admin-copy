/* eslint-disable multiline-ternary */
// ** React Imports
import { Fragment, useState, useEffect } from "react";

// ** Reactstrap Imports
import { Card, Table, Button } from "reactstrap";

import axios from "axios";
import moment from "moment";

// ** Icons
import { FileText } from "react-feather";

// ** Components
import CampaignSelectionModal from "./CampaignSelectionModal";

// ** Utils
import { getMissionEnrollmentStatus } from "../../../utility/missionStatus";

import emptyImg from '../../../assets/images/icons/empty-img-simple.png'

const fetchRecommendedCampaigns = async () => {
  try {
    const response = await axios.get("/admin/mission", {
      params: {
        is_recommended: true,
      },
    });
    return response.missions?.data || [];
  } catch (error) {
    console.error("Error fetching recommended campaigns:", error);
    return [];
  }
};

const RecommendedCampaign = () => {
  const [data, setData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  const loadData = async () => {
    const result = await fetchRecommendedCampaigns();
    setData(result);
  };

  useEffect(() => {
    loadData();
  }, []);

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  const handleAddCampaign = async (campaign) => {
    try {
      // Only update if the campaign is not already recommended
      if (campaign.isRecommended) {
        return;
      }

      if (data.length === 4) {
        alert("최대 데이터는 4입니다.");

        return;
      }

      await axios.put(`/admin/mission/${campaign.missionId}/recommended`, {
        is_recommended: true,
      });
      loadData();
    } catch (error) {
      console.error("Error adding recommended campaign:", error);
      alert("추천 캠페인 추가에 실패했습니다.");
    }
  };

  const handleRemoveCampaign = async (campaignId) => {
    if (window.confirm("이 캠페인을 추천 목록에서 제거하시겠습니까?")) {
      try {
        await axios.put(`/admin/mission/${campaignId}/recommended`, {
          is_recommended: false,
        });
        loadData();
      } catch (error) {
        console.error("Error removing recommended campaign:", error);
        alert("추천 캠페인 제거에 실패했습니다.");
      }
    }
  };

  const renderData = () => {
    return data.map((campaign, index) => {
      return (
        <tr key={campaign.missionId}>
          <td style={{ padding: "16px" }}>{index + 1}</td>
          <td style={{ padding: "16px" }}>
            <div className="d-flex align-items-center gap-2">
              {campaign.thumbnailImg && (
                <img
                  src={campaign.thumbnailImg}
                  alt={campaign.title}
                  style={{
                    width: "42px",
                    height: "42px",
                    objectFit: "cover",
                    borderRadius: "2px",
                  }}
                />
              )}
              <a
                href={`/moaland/manage/campaign/${campaign.missionId}`}
                style={{
                  color: "#509594",
                  textDecoration: "underline",
                  flex: "1",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                }}
              >
                {campaign.title}
              </a>
            </div>
          </td>
          <td style={{ padding: "16px" }}>
            <div
              style={{
                padding: "2px 8px",
                width: "fit-content",
                whiteSpace: "nowrap",
                borderRadius: "100px",
                border: "1px solid #E4E6EA",
                fontSize: "12px",
              }}
            >
              {getMissionEnrollmentStatus(campaign).label}
            </div>
          </td>
          <td style={{ padding: "16px" }}>
            <div
              style={{
                padding: "2px 8px",
                width: "fit-content",
                whiteSpace: "nowrap",
                borderRadius: "100px",
                border: "1px solid #E4E6EA",
                fontSize: "12px",
              }}
            >
              {campaign.category || "-"}
            </div>
          </td>
          <td style={{ padding: "16px" }}>
            <div
              style={{
                padding: "2px 8px",
                width: "fit-content",
                whiteSpace: "nowrap",
                borderRadius: "100px",
                border: "1px solid #E4E6EA",
                fontSize: "12px",
              }}
            >
              {campaign.social || "-"}
            </div>
          </td>
          <td style={{ padding: "16px" }}>
            {campaign.enrollStartDate && campaign.enrollEndDate
              ? `${moment(campaign.enrollStartDate).format(
                  "YY.MM.DD"
                )}~${moment(campaign.enrollEndDate).format("YY.MM.DD")}`
              : "-"}
          </td>
          <td style={{ textAlign: "center", padding: "16px" }}>
            <a
              href={`/moaland/manage/campaign/${campaign.missionId}`}
              style={{ color: "#509594", textDecoration: "underline" }}
            >
              {campaign.enrollCount || 0}
            </a>
          </td>
          <td style={{ textAlign: "center", padding: "16px" }}>
            {campaign.maxEnroll || 0}
          </td>
          <td style={{ padding: "16px" }}>
            {campaign.selectDate
              ? moment(campaign.selectDate).format("YY.MM.DD")
              : "-"}
          </td>
          <td style={{ textAlign: "center", padding: "16px" }}>
            <a
              href={`/moaland/manage/campaign/${campaign.missionId}`}
              style={{ color: "#509594", textDecoration: "underline" }}
            >
              {campaign.selectedParticipantCount || 0}
            </a>
          </td>
          <td style={{ padding: "16px" }}>
            {campaign.missionStartDate && campaign.missionEndDate
              ? `${moment(campaign.missionStartDate).format(
                  "YY.MM.DD"
                )}~${moment(campaign.missionEndDate).format("YY.MM.DD")}`
              : "-"}
          </td>
          <td style={{ padding: "16px" }}>
            {campaign.contentStartDate && campaign.contentEndDate
              ? `${moment(campaign.contentStartDate).format(
                  "YY.MM.DD"
                )}~${moment(campaign.contentEndDate).format("YY.MM.DD")}`
              : "-"}
          </td>
          <td style={{ padding: "16px" }}>
            <Button
              color="light"
              size="sm"
              onClick={() => handleRemoveCampaign(campaign.missionId)}
              style={{
                border: "1px solid #E5E7EB",
                background: "white",
                borderRadius: "6px",
                height: "32px",
                whiteSpace: "nowrap",
              }}
            >
              <span style={{ color: "#374151" }}>해제</span>
            </Button>
          </td>
        </tr>
      );
    });
  };

  return (
    <Fragment>
      <div className="user-header-title">
        <div className="title-wrapper">
          <h1 className="page-title">추천 캠페인</h1>
        </div>
        <p className="page-subtitle">추천 캠페인 등록 페이지</p>
      </div>

      <Card
        style={{
          borderRadius: "12px",
          border: "1px solid #E5E7EB",
          boxShadow: "none",
        }}
      >
        <div style={{ padding: "32px" }}>
          <div
            className="d-flex align-items-center justify-content-between"
            style={{ marginBottom: "20px" }}
          >
            <h4 className="mb-0">등록된 캠페인 {data.length}/4</h4>
            <Button
              onClick={toggleModal}
              color="primary"
              style={{ height: "44px", fontSize: "16px", minWidth: "67px" }}
            >
              <span className="align-middle">등록하기</span>
            </Button>
          </div>

          {data.length === 0 ? (
            <div
              className="d-flex flex-column align-items-center justify-content-center"
            >
              <img src={emptyImg} width={64} height={40} alt="empty" />
              <p style={{ color: "#9CA3AF", fontSize: "14px", margin: 0 }}>
                캠페인을 등록해주세요.
              </p>
            </div>
          ) : (
            <div
              className="table-wrapper"
              style={{ overflowX: "auto", width: "100%" }}
            >
              <Table style={{ fontSize: "14px", minWidth: "1400px" }}>
                <thead
                  style={{
                    backgroundColor: "#F9FAFC",
                    borderBottom: "1px solid #E2E8F0",
                  }}
                >
                  <tr>
                    <th style={{ padding: "16px", width: "65px" }}>순서</th>
                    <th style={{ padding: "16px", width: "70px" }}>캠페인</th>
                    <th style={{ padding: "16px", width: "100px" }}>상태</th>
                    <th style={{ padding: "16px", width: "100px" }}>카테고리</th>
                    <th style={{ padding: "16px", width: "100px" }}>미디어</th>
                    <th style={{ padding: "16px", width: "160px" }}>신청기간</th>
                    <th style={{ padding: "16px", width: "100px" }}>신청자</th>
                    <th style={{ padding: "16px", width: "100px" }}>선정수</th>
                    <th style={{ padding: "16px", width: "120px" }}>선정일</th>
                    <th style={{ padding: "16px", width: "100px" }}>선정자</th>
                    <th style={{ padding: "16px", width: "160px" }}>방문기간</th>
                    <th style={{ padding: "16px", width: "160px" }}>
                      콘텐츠 등록기간
                    </th>
                    <th style={{ padding: "16px", width: "81px" }}></th>
                  </tr>
                </thead>
                <tbody>{renderData()}</tbody>
              </Table>
            </div>
          )}
        </div>
      </Card>

      <CampaignSelectionModal
        isOpen={modalOpen}
        toggle={toggleModal}
        onSelect={handleAddCampaign}
      />
    </Fragment>
  );
};

export default RecommendedCampaign;
