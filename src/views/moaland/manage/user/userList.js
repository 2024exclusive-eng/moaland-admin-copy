// ** React Imports
import { Fragment, useState, useEffect } from "react";

// ** Reactstrap Imports
import {
  Table,
  Card,
  Input,
  Button,
  Nav,
  NavItem,
  NavLink,
  Label,
} from "reactstrap";

import axios from "axios";

// ** Icons
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "react-feather";

// ** Styles
import "./userList.scss";

const fetchData = async (page, item, search) => {
  try {
    const response = await axios.get("/admin/manage/user", {
      params: {
        page,
        item,
        search,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};

const DataTableWithButtons = () => {
  // ** States
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedRows, setSelectedRows] = useState([]);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [targetPage, setTargetPage] = useState("");

  // ** Get data on mount
  useEffect(() => {
    const fetchInitialData = async () => {
      // Note: You may need to pass activeTab to API if backend supports filtering by user type
      const result = await fetchData(currentPage, itemsPerPage, search);
      setData(result);
    };
    fetchInitialData();
  }, [currentPage, itemsPerPage, activeTab]);

  useEffect(() => {
    const debounceTimer = setTimeout(async () => {
      const result = await fetchData(currentPage, itemsPerPage, search);
      setData(result);
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [search]);

  const handlePagination = (page) => {
    setCurrentPage(page);
  };

  const handleRowClick = (id) => {
    window.location.href = `/moaland/manage/user/${id}`;
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allIds = data.data?.map((item) => item.id) || [];
      setSelectedRows(allIds);
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (id) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  const handleMovePage = () => {
    const pageNum = parseInt(targetPage);
    if (pageNum && pageNum > 0 && pageNum <= (data?.paging?.totalPages || 1)) {
      setCurrentPage(pageNum);
      setTargetPage("");
    }
  };

  const renderData = () => {
    return data.data?.map((col, index) => {
      const isSelected = selectedRows.includes(col.id);
      return (
        <tr key={col.id} onClick={() => handleRowClick(col.id)}>
          <td className="text-center" onClick={(e) => e.stopPropagation()}>
            <Input
              type="checkbox"
              checked={isSelected}
              onChange={() => handleSelectRow(col.id)}
            />
          </td>
          <td>{index + 1}</td>
          <td>
            {col.is_delete === "Y" ? "탈퇴" : "활동적인"}
          </td>
          <td>{col.email}</td>
          <td>
            {col.appliedMission || "0"}
          </td>
          <td>
            {col.selectedMission || "0"}
          </td>
          <td>
            {col.registeredMission || "0"}
          </td>
          <td>
            {col.endedMission || "0"}
          </td>
        </tr>
      );
    });
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const totalPages = data?.paging?.totalPages || 1;

  return (
    <Fragment>
      <Card className="user-list-card" style={{ marginBottom: "0"}}>
        <div style={{ padding: "32px" }}>
          {/* Tabs */}
          <div style={{ marginBottom: "10px" }}>
            <Nav className="user-tabs">
              <NavItem style={{ height: "52px"}}>
                <NavLink
                  className={activeTab === "all" ? "active" : ""}
                  onClick={() => setActiveTab("all")}
                >
                  <span style={{ fontSize: "16px" }}>전체</span>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={activeTab === "regular" ? "active" : ""}
                  onClick={() => setActiveTab("regular")}
                >
                  <span style={{ fontSize: "16px" }}>일반회원</span>
                </NavLink>
              </NavItem>
            </Nav>
          </div>

          {/* Search Input */}
          <div style={{ marginBottom: "20px" }}>
            <Input
              type="text"
              placeholder="검색어를 입력하세요."
              style={{ fontSize: "16px"}}
              value={search}
              onChange={handleSearchChange}
            />
          </div>

          {/* Table */}
          <div className="table-wrapper" style={{ marginBottom: "12px" }}>
            <Table className="user-table" responsive>
              <thead>
                <tr>
                  <th className="text-center" style={{ width: "32px" }}>
                    <Input
                      type="checkbox"
                      checked={
                        selectedRows.length === data.data?.length &&
                        data.data?.length > 0
                      }
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th style={{ width: "52px", fontSize: "14px" }}>No</th>
                  <th style={{ width: "100px" }}>상태</th>
                  <th>가입 이메일</th>
                  <th>신청한 캠페인</th>
                  <th>선정된 캠페인</th>
                  <th>등록한 캠페인</th>
                  <th>종료된 캠페인</th>
                </tr>
              </thead>
              <tbody>{renderData()}</tbody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="pagination-wrapper d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center" style={{ gap: "8px" }}>
              <Button
                // color="secondary"
                className="pagination-btn"
                onClick={() => handlePagination(1)}
                disabled={currentPage === 1}
              >
                <ChevronsLeft size={24} />
              </Button>
              <Button
                color="secondary"
                className="pagination-btn"
                onClick={() => handlePagination(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft size={24} />
              </Button>
              <Button
                color="secondary"
                className="pagination-btn"
                onClick={() => handlePagination(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <ChevronRight size={24} />
              </Button>
              <Button
                color="secondary"
                className="pagination-btn"
                onClick={() => handlePagination(totalPages)}
                disabled={currentPage === totalPages}
              >
                <ChevronsRight size={24} />
              </Button>
              <div className="page-indicator">
                <span className="current-page">{currentPage}</span>
                <span>/</span>
                <span className="total-pages">{totalPages}</span>
              </div>
            </div>

            <div className="d-flex align-items-center" style={{ gap: "8px" }}>
              <Input
                type="number"
                placeholder="페이지"
                value={targetPage}
                onChange={(e) => setTargetPage(e.target.value)}
                style={{ width: "100px", height: "48px", fontSize: "16px" }}
              />
              <Button
                color="light"
                onClick={handleMovePage}
                style={{ height: "48px", fontSize: "16px" }}
              >
                이동
              </Button>
              <Input
                type="select"
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                style={{ width: "96px", height: "48px", fontSize: "16px" }}
              >
                <option value={10}>10건</option>
                <option value={20}>20건</option>
                <option value={30}>30건</option>
                <option value={50}>50건</option>
              </Input>
            </div>
          </div>
        </div>
      </Card>
    </Fragment>
  );
};

export default DataTableWithButtons;
