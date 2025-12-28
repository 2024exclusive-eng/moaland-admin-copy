/* eslint-disable multiline-ternary */
// ** React Imports
import { useState, useEffect, useRef } from "react";

// ** Reactstrap Imports
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Table,
  Spinner,
} from "reactstrap";

import axios from "axios";
import moment from "moment";

// ** Icons
import { X } from "react-feather";

// ** Utils
import { getMissionEnrollmentStatus } from "../../../utility/missionStatus";

const CampaignSelectionModal = ({ isOpen, toggle, onSelect }) => {
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaigns, setSelectedCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const observerRef = useRef();
  const lastCampaignRef = useRef();
  const modalBodyRef = useRef();

  const fetchCampaigns = async (pageNum, searchTerm, reset = false) => {
    if (loading) return;

    setLoading(true);
    try {
      const params = {
        page: pageNum,
        item: 20,
      };
      if (searchTerm) {
        params.search = searchTerm;
      }

      const response = await axios.get("/admin/mission", { params });
      const newCampaigns = response.missions?.data || [];

      if (reset) {
        setCampaigns(newCampaigns);
      } else {
        setCampaigns((prev) => [...prev, ...newCampaigns]);
      }

      setHasMore(newCampaigns.length === 20);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setCampaigns([]);
      setSelectedCampaigns([]);
      setPage(1);
      setSearch("");
      fetchCampaigns(1, "", true);
    }
  }, [isOpen]);

  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        setPage((prev) => prev + 1);
      }
    });

    if (lastCampaignRef.current) {
      observerRef.current.observe(lastCampaignRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, loading, campaigns]);

  useEffect(() => {
    if (page > 1) {
      fetchCampaigns(page, search);
    }
  }, [page]);

  const handleSearch = (value) => {
    setSearch(value);
    setCampaigns([]);
    setPage(1);
    fetchCampaigns(1, value, true);
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      // Only select campaigns that are not already recommended
      const selectableCampaigns = campaigns.filter(
        (c) => c.isRecommended !== 1
      );
      setSelectedCampaigns(selectableCampaigns.map((c) => c.id));
    } else {
      setSelectedCampaigns([]);
    }
  };

  const handleSelectCampaign = (campaignId) => {
    console.log(campaignId)
    setSelectedCampaigns((prev) => {
      if (prev.includes(campaignId)) {
        return prev.filter((id) => id !== campaignId);
      } else {
        return [...prev, campaignId];
      }
    });
  };

  const handleRegister = () => {
    const selected = campaigns.filter((c) => selectedCampaigns.includes(c.id));
    selected.forEach((campaign) => {
      onSelect(campaign);
    });
    toggle();
  };

  const selectableCampaignsCount = campaigns.filter(
    (c) => c.isRecommended !== 1
  ).length;

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="xl">
      <ModalHeader
        toggle={toggle}
        close={
          <button className="close" onClick={toggle}>
            <X size={14} />
          </button>
        }
      >
        <div className="d-flex align-items-center justify-content-between w-100">
          <span>
            선택된 캠페인 ({selectedCampaigns.length}/{selectableCampaignsCount}
            )
          </span>
        </div>
      </ModalHeader>
      <ModalBody>
        <div className="mb-3">
          <Input
            type="text"
            placeholder="캠페인 검색..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>

        <div
          ref={modalBodyRef}
          style={{ maxHeight: "500px", overflowY: "auto" }}
        >
          <Table hover responsive>
            <thead
              style={{
                whiteSpace: "nowrap",
                position: "sticky",
                top: 0,
                backgroundColor: "#fff",
                zIndex: 1,
              }}
            >
              <tr>
                <th style={{ width: "40px" }}>
                  <Input
                    type="checkbox"
                    checked={(() => {
                      const selectableCampaigns = campaigns.filter(
                        (c) => c.isRecommended !== 1
                      );
                      return (
                        selectableCampaigns.length > 0 &&
                        selectedCampaigns.length === selectableCampaigns.length
                      );
                    })()}
                    onChange={handleSelectAll}
                  />
                </th>
                <th>캠페인</th>
                <th style={{ width: "100px" }}>상태</th>
                <th style={{ width: "100px" }}>카테고리</th>
                <th style={{ width: "100px" }}>미디어</th>
                <th style={{ width: "150px" }}>신청기간</th>
                <th style={{ width: "80px" }}>신청자</th>
                <th style={{ width: "80px" }}>선정수</th>
                <th style={{ width: "100px" }}>선정일</th>
                <th style={{ width: "80px" }}>선정자</th>
                <th style={{ width: "150px" }}>방문기간</th>
                <th style={{ width: "150px" }}>콘텐츠 등록기간</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((campaign, index) => {
                const isLast = campaigns.length === index + 1;
                const isSelected = selectedCampaigns.includes(campaign.missionId);
                const isAlreadyRecommended = campaign.isRecommended === 1;

                return (
                  <tr
                    key={campaign.missionId}
                    ref={isLast ? lastCampaignRef : null}
                    className={isSelected ? "table-active" : ""}
                    style={{
                      opacity: isAlreadyRecommended ? 0.5 : 1,
                      cursor: "initial !important",
                    }}
                  >
                    <td>
                      <Input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSelectCampaign(campaign.missionId)}
                        disabled={isAlreadyRecommended}
                      />
                    </td>
                    <td>
                      <div
                        className="d-flex gap-2"
                        style={{ alignItems: "end" }}
                      >
                        {campaign.thumbnailImg && (
                          <img
                            src={campaign.thumbnailImg}
                            alt={campaign.title}
                            style={{
                              width: "40px",
                              height: "40px",
                              objectFit: "cover",
                              borderRadius: "4px",
                            }}
                          />
                        )}
                        <div className="fw-bold" style={{ color: "#509594" }}>
                          {campaign.title}
                        </div>
                      </div>
                    </td>
                    <td>
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
                    <td>
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
                    <td>
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
                    <td>
                      {campaign.enrollStartDate && campaign.enrollEndDate ? (
                        <small>
                          {moment(campaign.enrollStartDate).format("YY.MM.DD")}-
                          {moment(campaign.enrollEndDate).format("MM.DD")}
                        </small>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="text-center">{campaign.enrollCount || 0}</td>
                    <td>{campaign.maxEnroll}</td>
                    <td>{moment(campaign.selectDate).format("YY.MM.DD")}</td>
                    <td className="text-center">
                      {campaign.selectedParticipantCount || 0}
                    </td>
                    <td>
                      {campaign.missionStartDate && campaign.missionEndDate
                        ? `${moment(campaign.missionStartDate).format(
                            "YY.MM.DD"
                          )}-${moment(campaign.missionEndDate).format("YY.MM.DD")}`
                        : "-"}
                    </td>
                    <td>
                      {campaign.contentStartDate && campaign.contentEndDate
                        ? `${moment(campaign.contentStartDate).format(
                            "YY.MM.DD"
                          )}-${moment(campaign.contentEndDate).format("YY.MM.DD")}`
                        : "-"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>

          {loading && (
            <div className="text-center py-3">
              <Spinner size="sm" />
            </div>
          )}

          {!loading && campaigns.length === 0 && (
            <div className="text-center py-3 text-muted">캠페인이 없습니다</div>
          )}
        </div>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={toggle}>
          취소
        </Button>
        <Button
          color="primary"
          onClick={handleRegister}
          disabled={selectedCampaigns.length === 0}
        >
          등록
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default CampaignSelectionModal;
