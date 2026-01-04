// ** React Imports
import { Fragment, useState, useEffect } from "react";

// ** Reactstrap Imports
import { Table, Card, Button, Input } from "reactstrap";

import axios from "axios";
import moment from "moment";

// ** Styles
import "./NoticeTab.scss";

const fetchData = async (page, item, search) => {
  try {
    const params = {
      page,
      item,
    };

    if (search) {
      params.title = search;
    }

    const response = await axios.get("/admin/notice", { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return { data: [], paging: {} };
  }
};

const NoticeTab = () => {
  const [data, setData] = useState({ data: [], paging: {} });
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchInitialData = async () => {
      const result = await fetchData(1, 30, search);
      setData(result || { data: [], paging: {} });
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    const debounceTimer = setTimeout(async () => {
      const result = await fetchData(1, 30, search);
      setData(result || { data: [], paging: {} });
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [search]);

  const loadData = async () => {
    const result = await fetchData(1, 30, search);
    setData(result || { data: [], paging: {} });
  };

  const handleRowClick = (id) => {
    window.location.href = `/moaland/manage/community/${id}`;
  };

  const handleDelete = async (id) => {
    if (window.confirm("정말 이 공지사항을 삭제하시겠습니까?")) {
      try {
        await axios.delete(`/admin/notice/${id}`);
        loadData();
      } catch (error) {
        console.error("Error deleting notice:", error);
        alert("삭제에 실패했습니다.");
      }
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const renderData = () => {
    if (!data.data || data.data.length === 0) {
      return (
        <tr>
          <td colSpan="3" className="text-center" style={{ padding: "40px" }}>
            데이터가 없습니다
          </td>
        </tr>
      );
    }

    return data.data.map((col) => {
      return (
        <tr key={col.id}>
          <td>{col.title}</td>
          <td>{moment(col.created).format("YY.MM.DD")}</td>
          <td className="action-cell" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <Button
                color="light"
                size="sm"
                onClick={() => handleDelete(col.id)}
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
              <Button
                color="light"
                size="sm"
                onClick={() => handleRowClick(col.id)}
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
            </div>
          </td>
        </tr>
      );
    });
  };

  return (
    <Fragment>
      <Card className="notice-tab-card mt-2">
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
            <Input
              type="text"
              placeholder="검색어를 입력하세요."
              style={{ fontSize: "16px", height: "48px" }}
              value={search}
              onChange={handleSearchChange}
            />
            <Button
              color="primary"
              style={{ height: "48px", fontSize: "16px", minWidth: "140px" }}
              onClick={() => {
                window.location.href = "/moaland/manage/community/new";
              }}
            >
              등록하기
            </Button>
          </div>

          {/* Table */}
          <div className="table-wrapper" style={{ marginBottom: "12px" }}>
            <Table className="notice-table" responsive>
              <thead>
                <tr>
                  <th>제목</th>
                  <th style={{ width: "120px" }}>등록일자</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>{renderData()}</tbody>
            </Table>
          </div>
        </div>
      </Card>
    </Fragment>
  );
};

export default NoticeTab;
