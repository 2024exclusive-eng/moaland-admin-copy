/* eslint-disable multiline-ternary */
// ** React Imports
import { Fragment, useState, useEffect } from "react";

// ** Reactstrap Imports
import { Table, Card, Button, Input } from "reactstrap";

import axios from "axios";
import moment from "moment";

// ** Icons
import { Edit, Trash } from "react-feather";

// ** Components
import BannerModal from "./BannerModal";

// ** Styles
import "./BannerList.scss";

const fetchData = async (page, item, search, type) => {
  try {
    const params = {
      page,
      item,
      type,
    };

    if (search) {
      params.search = search;
    }

    const response = await axios.get("/admin/banner", { params });
    return response?.data;
  } catch (error) {
    console.error("Error fetching banners:", error);
    return { data: [], paging: { totalPages: 1, currentPage: 1 } };
  }
};

const BannerNoticeTab = () => {
  const [data, setData] = useState({ data: [], paging: {} });
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [targetPage, setTargetPage] = useState("");

  useEffect(() => {
    const fetchInitialData = async () => {
      const result = await fetchData(currentPage, itemsPerPage, search, "home");
      setData(result || { data: [], paging: {} });
    };
    fetchInitialData();
  }, [currentPage, itemsPerPage]);

  useEffect(() => {
    const debounceTimer = setTimeout(async () => {
      const result = await fetchData(currentPage, itemsPerPage, search, "home");
      setData(result || { data: [], paging: {} });
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [search]);

  const loadData = async () => {
    const result = await fetchData(currentPage, itemsPerPage, search, "home");
    setData(result || { data: [], paging: {} });
  };

  const toggleModal = () => {
    if (modalOpen) {
      setSelectedBanner(null);
    }
    setModalOpen(!modalOpen);
  };

  const handleCreate = () => {
    setSelectedBanner(null);
    setModalOpen(true);
  };

  const handleEdit = (banner) => {
    setSelectedBanner(banner);
    setModalOpen(true);
  };

  const handleSave = async (formData) => {
    try {
      if (selectedBanner) {
        await axios.post("/admin/banner", {
          ...formData,
          id: selectedBanner.id,
          type: "home",
        });
      } else {
        const { isActive, ...createData } = formData;
        await axios.post("/admin/banner", { ...createData, type: "home" });
      }
      toggleModal();
      loadData();
    } catch (error) {
      console.error("Error saving banner:", error);
      alert("배너 저장에 실패했습니다.");
    }
  };

  const handleDelete = async (bannerId) => {
    if (window.confirm("정말 이 배너를 삭제하시겠습니까?")) {
      try {
        await axios.delete(`/admin/banner/${bannerId}`);
        loadData();
      } catch (error) {
        console.error("Error deleting banner:", error);
        alert("배너 삭제에 실패했습니다.");
      }
    }
  };

  const handlePagination = (page) => {
    setCurrentPage(page);
  };

  const handleMovePage = () => {
    const pageNum = parseInt(targetPage);
    if (pageNum && pageNum > 0 && pageNum <= (data?.paging?.totalPages || 1)) {
      setCurrentPage(pageNum);
      setTargetPage("");
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const renderData = () => {
    if (!data.data || data.data.length === 0) {
      return (
        <tr>
          <td colSpan="6" className="text-center" style={{ padding: "40px" }}>
            데이터가 없습니다
          </td>
        </tr>
      );
    }

    return data.data.map((banner, index) => {
      return (
        <tr key={banner.id}>
          <td>{index + 1}</td>
          <td
            className="thumbnail-cell"
            style={{ display: "flex", alignItems: "center", gap: "12px" }}
          >
            <div className="thumbnail-wrapper">
              <img
                src={banner.thumbnailPath}
                alt={banner.name}
                width={42}
                height={42}
                style={{ objectFit: "cover" }}
              />
            </div>
          </td>
          <td>{banner.name || "-"}</td>
          <td>
            <div
              style={{
                padding: "2px 8px",
                width: "fit-content",
                whiteSpace: "nowrap",
                fontSize: "12px",
                color: "#509594",
                textDecoration: "underline",
                cursor: "pointer",
              }}
              onClick={() => {
                if (banner.link) {
                  window.open(banner.link, "_blank")?.focus();
                }
              }}
            >
              {banner.link ? "URL" : "-"}
            </div>
          </td>
          <td>{moment(banner.created).format("YY.MM.DD")}</td>
          <td className="action-cell" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <Button
                color="light"
                size="sm"
                onClick={() => handleEdit(banner)}
                style={{
                  border: "1px solid #E5E7EB",
                  background: "white",
                  borderRadius: "6px",
                  height: "32px",
                  whiteSpace: "nowrap",
                }}
              >
                <span style={{ color: "#374151" }}>수정</span>
              </Button>
              <Button
                color="light"
                size="sm"
                onClick={() => handleDelete(banner.id)}
                style={{
                  border: "1px solid #E5E7EB",
                  background: "white",
                  borderRadius: "6px",
                  height: "32px",
                  whiteSpace: "nowrap",
                }}
              >
                <span style={{ color: "#374151" }}>삭제</span>
              </Button>
            </div>
          </td>
        </tr>
      );
    });
  };

  const totalPages = data?.paging?.totalPages || 1;

  return (
    <Fragment>
      <Card className="banner-list-card mt-2">
        <div style={{ padding: "32px" }}>
          {/* Header Row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "20px",
              gap: "12px",
            }}
          >
            <h4 className="mb-0">등록된 배너 {data.data.length}</h4>

            <Button
              color="primary"
              style={{ height: "48px", fontSize: "16px", minWidth: "120px" }}
              onClick={handleCreate}
            >
              배너 생성
            </Button>
          </div>

          {/* Table */}
          <div className="table-wrapper" style={{ marginBottom: "12px" }}>
            <Table className="event-table" responsive>
              <thead>
                <tr>
                  <th>순서</th>
                  <th>썸네일</th>
                  <th>배너명</th>
                  <th>URL</th>
                  <th>등록일자</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>{renderData()}</tbody>
            </Table>
          </div>
        </div>
      </Card>

      <BannerModal
        isOpen={modalOpen}
        toggle={toggleModal}
        banner={selectedBanner}
        onSave={handleSave}
        defaultType="home"
      />
    </Fragment>
  );
};

export default BannerNoticeTab;
