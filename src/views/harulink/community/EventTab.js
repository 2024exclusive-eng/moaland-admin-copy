/* eslint-disable multiline-ternary */
// ** React Imports
import { Fragment, useState, useEffect } from "react";

// ** Reactstrap Imports
import { Table, Card, Button, Input } from "reactstrap";

import axios from "axios";
import moment from "moment";

// ** Icons
import { Edit, Trash, ExternalLink } from "react-feather";

// ** Utils
import { openUrlInNewTab } from "@utils";

// ** Components
import EventModal from "./EventModal";

// ** Styles
import "./EventTab.scss";

const fetchData = async (page, item, search) => {
  try {
    const params = {
      page,
      item,
    };

    if (search) {
      params.search = search;
    }

    const response = await axios.get("/admin/event", { params });
    return response?.data;
  } catch (error) {
    console.error("Error fetching events:", error);
    return { data: [], paging: { totalPages: 1, currentPage: 1 } };
  }
};

const EventTab = () => {
  const [data, setData] = useState({ data: [], paging: {} });
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [targetPage, setTargetPage] = useState("");

  useEffect(() => {
    const fetchInitialData = async () => {
      const result = await fetchData(currentPage, itemsPerPage, search);
      setData(result || { data: [], paging: {} });
    };
    fetchInitialData();
  }, [currentPage, itemsPerPage]);

  useEffect(() => {
    const debounceTimer = setTimeout(async () => {
      const result = await fetchData(currentPage, itemsPerPage, search);
      setData(result || { data: [], paging: {} });
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [search]);

  const loadData = async () => {
    const result = await fetchData(currentPage, itemsPerPage, search);
    setData(result || { data: [], paging: {} });
  };

  const toggleModal = () => {
    if (modalOpen) {
      setSelectedEvent(null);
    }
    setModalOpen(!modalOpen);
  };

  const handleCreate = () => {
    setSelectedEvent(null);
    setModalOpen(true);
  };

  const handleEdit = (event) => {
    setSelectedEvent(event);
    setModalOpen(true);
  };

  const handleSave = async (formData) => {
    if (data.data.length === 6) {
      alert("최대 데이터는 6입니다.");

      return;
    }
    try {
      if (selectedEvent) {
        await axios.post("/admin/event", {
          ...formData,
          id: selectedEvent.id,
        });
      } else {
        const { isActive, ...createData } = formData;
        await axios.post("/admin/event", createData);
      }
      toggleModal();
      loadData();
    } catch (error) {
      console.error("Error saving event:", error);
      alert("이벤트 저장에 실패했습니다.");
    }
  };

  const handleDelete = async (eventId) => {
    if (window.confirm("정말 이 이벤트를 삭제하시겠습니까?")) {
      try {
        await axios.delete(`/admin/event/${eventId}`);
        loadData();
      } catch (error) {
        console.error("Error deleting event:", error);
        alert("이벤트 삭제에 실패했습니다.");
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

    return data.data.map((event, index) => {
      return (
        <tr key={event.id}>
          <td>{index + 1}</td>
          <td
            className="thumbnail-cell"
            style={{ display: "flex", alignItems: "center", gap: "12px" }}
          >
            <div className="thumbnail-wrapper">
              <img
                src={event.thumbnailPath}
                alt={event.name}
                width={42}
                height={42}
                style={{ objectFit: "cover" }}
              />
            </div>
          </td>
          <td>{event.name || "-"}</td>
          <td>
            {event.link || event.url ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  cursor: "pointer",
                  textDecoration: "underline",
                  color: "#509594",
                  maxWidth: "180px",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  openUrlInNewTab(event.link || event.url);
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.textDecoration = "underline";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.textDecoration = "none";
                }}
              >
                <span
                  style={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  URL
                </span>
              </div>
            ) : (
              "-"
            )}
          </td>
          <td>{moment(event.created).format("YY.MM.DD")}</td>
          <td className="action-cell" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <Button
                color="light"
                size="sm"
                onClick={() => handleEdit(event)}
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
                onClick={() => handleDelete(event.id)}
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
      <Card className="event-tab-card mt-2">
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
            <h4 className="mb-0">등록된 캠페인 {data.data.length}/6</h4>

            <Button
              color="primary"
              style={{ height: "48px", fontSize: "16px", minWidth: "120px" }}
              onClick={handleCreate}
            >
              이벤트 생성
            </Button>
          </div>

          {/* Table */}
          <div className="table-wrapper" style={{ marginBottom: "12px" }}>
            <Table className="event-table" responsive>
              <thead>
                <tr>
                  <th>순서</th>
                  <th>썸네일</th>
                  <th>배너관리명</th>
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

      <EventModal
        isOpen={modalOpen}
        toggle={toggleModal}
        event={selectedEvent}
        onSave={handleSave}
      />
    </Fragment>
  );
};

export default EventTab;
