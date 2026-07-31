/* eslint-disable multiline-ternary */
// ** React Imports
import { Fragment, useState, useEffect } from "react";

// ** Reactstrap Imports
import { Card, Table, Button, Nav, NavItem, NavLink } from "reactstrap";

// ** Third Party Components
import { ReactSortable } from "react-sortablejs";
import toast from "react-hot-toast";

import axios from "axios";

// ** Components
import CampaignSelectionModal from "../recommended-campaign/CampaignSelectionModal";

import emptyImg from "../../../assets/images/icons/empty-img-simple.png";

// 회원 홈에서 고정 슬롯을 지원하는 섹션 (P34)
const SECTIONS = [
  { key: "new", label: "새로운 캠페인" },
  { key: "deadline", label: "마감임박 캠페인" },
];

const DragHandleIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="9" cy="6" r="1.5" fill="#999" />
    <circle cx="15" cy="6" r="1.5" fill="#999" />
    <circle cx="9" cy="12" r="1.5" fill="#999" />
    <circle cx="15" cy="12" r="1.5" fill="#999" />
    <circle cx="9" cy="18" r="1.5" fill="#999" />
    <circle cx="15" cy="18" r="1.5" fill="#999" />
  </svg>
);

const fetchPinned = async (section) => {
  try {
    const response = await axios.get(`/admin/mission/pin/${section}`);
    return response?.data || [];
  } catch (error) {
    console.error("Error fetching pinned campaigns:", error);
    return [];
  }
};

const PinnedCampaign = () => {
  const [section, setSection] = useState("new");
  const [list, setList] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadData = async (target) => {
    const result = await fetchPinned(target);
    setList(result);
  };

  useEffect(() => {
    loadData(section);
  }, [section]);

  const toggleModal = () => setModalOpen(!modalOpen);

  // 모달에서 고른 캠페인을 목록 끝에 추가 (중복은 무시)
  const handleAddCampaign = (campaign) => {
    setList((prev) => {
      if (prev.some((c) => c.id === campaign.missionId)) return prev;
      return [
        ...prev,
        {
          id: campaign.missionId,
          title: campaign.title,
          brand: campaign.brand,
          thumbnailImg: campaign.thumbnailImg,
        },
      ];
    });
  };

  const handleRemove = (missionId) => {
    setList((prev) => prev.filter((c) => c.id !== missionId));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await axios.put(`/admin/mission/pin/${section}`, {
        missionIds: list.map((c) => c.id),
      });
      toast.success("고정 슬롯을 저장했습니다.");
      loadData(section);
    } catch (error) {
      console.error("Error saving pinned campaigns:", error);
      alert("고정 슬롯 저장에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  const renderRows = () => {
    if (!list.length) {
      return (
        <tr>
          <td colSpan="5" className="text-center" style={{ padding: "40px" }}>
            고정된 캠페인이 없습니다
          </td>
        </tr>
      );
    }

    return list.map((campaign, index) => (
      <tr key={campaign.id}>
        <td className="drag-handle-cell" style={{ width: "57px", padding: "16px", cursor: "grab" }}>
          <DragHandleIcon />
        </td>
        <td style={{ width: "70px", padding: "16px" }}>{index + 1}</td>
        <td style={{ padding: "16px" }}>
          <img
            src={campaign.thumbnailImg || emptyImg}
            alt={campaign.title}
            width={42}
            height={42}
            style={{ objectFit: "cover", borderRadius: "4px" }}
          />
        </td>
        <td style={{ padding: "16px" }}>{campaign.title || "-"}</td>
        <td style={{ padding: "16px", width: "120px" }}>
          <Button
            color="light"
            size="sm"
            onClick={() => handleRemove(campaign.id)}
            style={{
              border: "1px solid #E5E7EB",
              background: "white",
              borderRadius: "6px",
              height: "32px",
              whiteSpace: "nowrap",
            }}
          >
            <span style={{ color: "#374151" }}>제거</span>
          </Button>
        </td>
      </tr>
    ));
  };

  return (
    <Fragment>
      <div className="user-header-title">
        <div className="title-wrapper">
          <h1 className="page-title">고정 슬롯</h1>
        </div>
        <p className="page-subtitle">회원 홈 섹션 상단에 고정할 캠페인을 지정합니다</p>
      </div>

      <Nav tabs className="mt-2">
        {SECTIONS.map((s) => (
          <NavItem key={s.key}>
            <NavLink active={section === s.key} onClick={() => setSection(s.key)} style={{ cursor: "pointer" }}>
              {s.label}
            </NavLink>
          </NavItem>
        ))}
      </Nav>

      <Card className="mt-2">
        <div style={{ padding: "32px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "20px",
              gap: "12px",
            }}
          >
            <h4 className="mb-0">고정된 캠페인 {list.length}개</h4>

            <div style={{ display: "flex", gap: "12px" }}>
              <Button
                color="light"
                style={{
                  height: "48px",
                  fontSize: "16px",
                  minWidth: "120px",
                  border: "1px solid #E5E7EB",
                  background: "white",
                  borderRadius: "6px",
                }}
                onClick={toggleModal}
              >
                <span style={{ fontWeight: "600" }}>캠페인 추가</span>
              </Button>
              <Button
                color="primary"
                style={{ height: "48px", fontSize: "16px", minWidth: "120px" }}
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? "저장 중..." : "순서 저장"}
              </Button>
            </div>
          </div>

          <p style={{ color: "#6B7280", fontSize: "13px", marginBottom: "12px" }}>
            드래그로 순서를 바꾼 뒤 저장하세요. 고정된 캠페인은 아래 자동정렬 목록에 중복 노출되지 않습니다.
          </p>

          <div className="table-wrapper">
            <Table responsive>
              <thead>
                <tr>
                  <th style={{ width: "57px" }}></th>
                  <th style={{ width: "70px", whiteSpace: "nowrap" }}>순서</th>
                  <th>썸네일</th>
                  <th>캠페인명</th>
                  <th style={{ width: "120px" }}></th>
                </tr>
              </thead>
              <ReactSortable
                tag="tbody"
                list={list}
                setList={setList}
                handle=".drag-handle-cell"
                animation={200}
              >
                {renderRows()}
              </ReactSortable>
            </Table>
          </div>
        </div>
      </Card>

      <CampaignSelectionModal isOpen={modalOpen} toggle={toggleModal} onSelect={handleAddCampaign} />
    </Fragment>
  );
};

export default PinnedCampaign;
