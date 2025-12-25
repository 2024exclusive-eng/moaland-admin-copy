/* eslint-disable multiline-ternary */
// ** React Imports
import { Fragment, useState, useEffect } from "react";

// ** Reactstrap Imports
import {
  Table,
  Card,
  Button,
  Badge,
  Input,
  Row,
  Col,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Label,
  UncontrolledDropdown,
} from "reactstrap";

import axios from "axios";
import moment from "moment";

// ** Icons
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ChevronDown,
  MoreVertical,
  Edit,
  Trash,
  Power,
} from "react-feather";

// ** Components
import BannerModal from "./BannerModal";

// ** Styles
import "./BannerList.scss";

const fetchData = async (page, item, search, filters) => {
  try {
    const params = {
      page,
      item,
    };

    if (search) {
      params.search = search;
    }

    if (filters.type) {
      params.type = filters.type;
    }

    if (filters.status) {
      params.is_active = filters.status;
    }

    const response = await axios.get("/admin/banner", { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching banners:", error);
    return { data: [], paging: { totalPages: 1, currentPage: 1 } };
  }
};

const BannerList = () => {
  const [data, setData] = useState({ data: [], paging: {} });
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [targetPage, setTargetPage] = useState("");
  const [filters, setFilters] = useState({
    type: "",
    status: "",
  });
  const [dropdownOpen, setDropdownOpen] = useState({
    type: false,
    status: false,
  });

  useEffect(() => {
    const fetchInitialData = async () => {
      const result = await fetchData(
        currentPage,
        itemsPerPage,
        search,
        filters
      );
      setData(result || { data: [], paging: {} });
    };
    fetchInitialData();
  }, [currentPage, itemsPerPage, filters]);

  useEffect(() => {
    const debounceTimer = setTimeout(async () => {
      const result = await fetchData(
        currentPage,
        itemsPerPage,
        search,
        filters
      );
      setData(result || { data: [], paging: {} });
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [search]);

  const loadData = async () => {
    const result = await fetchData(currentPage, itemsPerPage, search, filters);
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
        });
      } else {
        const { isActive, ...createData } = formData;
        await axios.post("/admin/banner", createData);
      }
      toggleModal();
      loadData();
    } catch (error) {
      console.error("Error saving banner:", error);
      alert("배너 저장에 실패했습니다.");
    }
  };

  const handleToggle = async (banner) => {
    try {
      await axios.patch(`/admin/banner/${banner.id}/toggle`);
      loadData();
    } catch (error) {
      console.error("Error toggling banner:", error);
      alert("배너 상태 변경에 실패했습니다.");
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

  const toggleDropdown = (filterName) => {
    setDropdownOpen((prev) => ({
      ...prev,
      [filterName]: !prev[filterName],
    }));
  };

  const handleFilterChange = (filterName, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: value,
    }));
    setCurrentPage(1);
  };

  const resetFilter = (filterName) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: "",
    }));
    setCurrentPage(1);
  };

  const getTypeLabel = (type) => {
    return type === "home" ? "홈 배너" : "우측 배너";
  };

  const renderData = () => {
    if (!data.data || data.data.length === 0) {
      return (
        <tr>
          <td colSpan="8" className="text-center" style={{ padding: "40px" }}>
            데이터가 없습니다
          </td>
        </tr>
      );
    }

    return data.data.map((banner) => {
      return (
        <tr key={banner.id}>
          <td>{banner.id}</td>
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
                style={{ objectFit: "contain" }}
              />
            </div>
            <span>{banner.name}</span>
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
              {getTypeLabel(banner.type)}
            </div>
          </td>
          <td>{banner.link || "-"}</td>
          <td>
            <div
              style={{
                padding: "2px 8px",
                width: "fit-content",
                whiteSpace: "nowrap",
                borderRadius: "100px",
                border: "1px solid #E4E6EA",
                fontSize: "12px",
                color: banner.isActive === "Y" ? "#00D9A3" : "#999",
              }}
            >
              {banner.isActive === "Y" ? "활성" : "비활성"}
            </div>
          </td>
          <td>{moment(banner.created).format("YY.MM.DD")}</td>
          <td className="action-cell" onClick={(e) => e.stopPropagation()}>
            <UncontrolledDropdown>
              <DropdownToggle
                className="icon-btn hide-arrow"
                color="transparent"
                size="sm"
                caret
              >
                <MoreVertical size={15} />
              </DropdownToggle>
              <DropdownMenu end>
                <DropdownItem onClick={() => handleEdit(banner)}>
                  <Edit className="me-50" size={15} />
                  <span className="align-middle">수정</span>
                </DropdownItem>
                <DropdownItem onClick={() => handleToggle(banner)}>
                  <Power className="me-50" size={15} />
                  <span className="align-middle">
                    {banner.isActive === "Y" ? "비활성화" : "활성화"}
                  </span>
                </DropdownItem>
                <DropdownItem
                  onClick={() => handleDelete(banner.id)}
                  className="text-danger"
                >
                  <Trash className="me-50" size={15} />
                  <span className="align-middle">삭제</span>
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </td>
        </tr>
      );
    });
  };

  const totalPages = data?.paging?.totalPages || 1;

  return (
    <Fragment>
      <Card className="banner-list-card">
        <div style={{ padding: "32px" }}>
          {/* Filters Row */}
          <Row className="filters-row" style={{ marginBottom: "20px" }}>
            <Col md="2">
              <Dropdown
                isOpen={dropdownOpen.type}
                toggle={() => toggleDropdown("type")}
                className="filter-dropdown"
              >
                <DropdownToggle caret className="filter-toggle">
                  타입
                  <ChevronDown size={16} className="ms-auto" />
                </DropdownToggle>
                <DropdownMenu className="filter-menu">
                  <DropdownItem onClick={() => handleFilterChange("type", "")}>
                    전체 타입
                  </DropdownItem>
                  <DropdownItem
                    onClick={() => handleFilterChange("type", "home")}
                  >
                    홈 배너
                  </DropdownItem>
                  <DropdownItem
                    onClick={() => handleFilterChange("type", "right_banner")}
                  >
                    우측 배너
                  </DropdownItem>
                  <DropdownItem divider />
                  <DropdownItem
                    className="filter-reset"
                    onClick={() => resetFilter("type")}
                  >
                    필터 초기화
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </Col>
            <Col md="2">
              <Dropdown
                isOpen={dropdownOpen.status}
                toggle={() => toggleDropdown("status")}
                className="filter-dropdown"
              >
                <DropdownToggle caret className="filter-toggle">
                  상태
                  <ChevronDown size={16} className="ms-auto" />
                </DropdownToggle>
                <DropdownMenu className="filter-menu">
                  <DropdownItem
                    onClick={() => handleFilterChange("status", "")}
                  >
                    전체 상태
                  </DropdownItem>
                  <DropdownItem
                    onClick={() => handleFilterChange("status", "Y")}
                  >
                    활성
                  </DropdownItem>
                  <DropdownItem
                    onClick={() => handleFilterChange("status", "N")}
                  >
                    비활성
                  </DropdownItem>
                  <DropdownItem divider />
                  <DropdownItem
                    className="filter-reset"
                    onClick={() => resetFilter("status")}
                  >
                    필터 초기화
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </Col>
            <Col md="8" className="d-flex justify-content-end">
              <Button
                color="primary"
                style={{ height: "48px", fontSize: "16px", minWidth: "120px" }}
                onClick={handleCreate}
              >
                배너 생성
              </Button>
            </Col>
          </Row>

          {/* Search Input */}
          <div style={{ marginBottom: "20px" }}>
            <Input
              type="text"
              placeholder="검색어를 입력하세요."
              style={{ fontSize: "16px", height: "48px" }}
              value={search}
              onChange={handleSearchChange}
            />
          </div>

          {/* Table */}
          <div className="table-wrapper" style={{ marginBottom: "12px" }}>
            <Table className="banner-table" responsive>
              <thead>
                <tr>
                  <th style={{ width: "80px" }}>ID</th>
                  <th style={{ width: "300px" }}>배너명</th>
                  <th style={{ width: "120px" }}>타입</th>
                  <th style={{ width: "200px" }}>링크</th>
                  <th style={{ width: "100px" }}>상태</th>
                  <th style={{ width: "120px" }}>생성일</th>
                  <th style={{ width: "80px" }}>작업</th>
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
      />
    </Fragment>
  );
};

export default BannerList;
