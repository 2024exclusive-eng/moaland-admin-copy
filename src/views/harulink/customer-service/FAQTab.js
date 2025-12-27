/* eslint-disable multiline-ternary */
// ** React Imports
import { Fragment, useState, useEffect } from "react";

// ** Reactstrap Imports
import {
  Table,
  Card,
  Button,
  Input,
  Row,
  Col,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

import axios from "axios";
import moment from "moment";

// ** Icons
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoreVertical,
  Edit,
  Trash,
  Power,
} from "react-feather";

// ** Components
import FAQModal from "./FAQModal";

// ** Styles
import "./FAQTab.scss";

const fetchData = async (type, page, item, search) => {
  try {
    const params = {
      type,
      page,
      item,
    };

    if (search) {
      params.search = search;
    }

    const response = await axios.get("/admin/faq", { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching FAQs:", error);
    return { data: [], paging: { totalPages: 1, currentPage: 1 } };
  }
};

const FAQTab = ({ type, title }) => {
  const [data, setData] = useState({ data: [], paging: {} });
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFAQ, setSelectedFAQ] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [targetPage, setTargetPage] = useState("");

  useEffect(() => {
    const fetchInitialData = async () => {
      const result = await fetchData(type, currentPage, itemsPerPage, search);
      setData(result || { data: [], paging: {} });
    };
    fetchInitialData();
  }, [type, currentPage, itemsPerPage]);

  useEffect(() => {
    const debounceTimer = setTimeout(async () => {
      const result = await fetchData(type, currentPage, itemsPerPage, search);
      setData(result || { data: [], paging: {} });
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [search]);

  const loadData = async () => {
    const result = await fetchData(type, currentPage, itemsPerPage, search);
    setData(result || { data: [], paging: {} });
  };

  const toggleModal = () => {
    if (modalOpen) {
      setSelectedFAQ(null);
    }
    setModalOpen(!modalOpen);
  };

  const handleCreate = () => {
    setSelectedFAQ(null);
    setModalOpen(true);
  };

  const handleEdit = (faq) => {
    setSelectedFAQ(faq);
    setModalOpen(true);
  };

  const handleSave = async (formData) => {
    try {
      if (selectedFAQ) {
        await axios.post("/admin/faq", {
          ...formData,
          type,
          id: selectedFAQ.id,
        });
      } else {
        const { isActive, ...createData } = formData;
        await axios.post("/admin/faq", {
          ...createData,
          type,
        });
      }
      toggleModal();
      loadData();
    } catch (error) {
      console.error("Error saving FAQ:", error);
      alert("저장에 실패했습니다.");
    }
  };

  const handleToggle = async (faq) => {
    try {
      await axios.patch(`/admin/faq/${faq.id}/toggle`);
      loadData();
    } catch (error) {
      console.error("Error toggling FAQ:", error);
      alert("상태 변경에 실패했습니다.");
    }
  };

  const handleDelete = async (faqId) => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      try {
        await axios.delete(`/admin/faq/${faqId}`);
        loadData();
      } catch (error) {
        console.error("Error deleting FAQ:", error);
        alert("삭제에 실패했습니다.");
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
          <td colSpan="7" className="text-center" style={{ padding: "40px" }}>
            데이터가 없습니다
          </td>
        </tr>
      );
    }

    return data.data.map((faq) => {
      return (
        <tr key={faq.id}>
          <td>{faq.title}</td>
          <td
            style={{
              maxWidth: "300px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {faq.answer}
          </td>
          <td className="action-cell" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <Button
                color="light"
                size="sm"
                onClick={() => handleEdit(faq)}
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
                onClick={() => handleDelete(faq.id)}
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
      <Card className="faq-tab-card mt-2">
        <div style={{ padding: "32px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "12px",
              marginBottom: "20px",
            }}
          >
            <Input
              type="text"
              placeholder="검색어를 입력하세요."
              style={{ fontSize: "16px", height: "48px" }}
              value={search}
              onChange={handleSearchChange}
            />
            <Button
              color="primary"
              style={{ height: "48px", fontSize: "16px", minWidth: "120px" }}
              onClick={handleCreate}
            >
              등록하기
            </Button>
          </div>

          {/* Table */}
          <div className="table-wrapper" style={{ marginBottom: "12px" }}>
            <Table className="faq-table" responsive>
              <thead>
                <tr>
                  <th>제목</th>
                  <th>등록일자</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>{renderData()}</tbody>
            </Table>
          </div>
        </div>
      </Card>

      <FAQModal
        isOpen={modalOpen}
        toggle={toggleModal}
        faq={selectedFAQ}
        type={type}
        onSave={handleSave}
      />
    </Fragment>
  );
};

export default FAQTab;
