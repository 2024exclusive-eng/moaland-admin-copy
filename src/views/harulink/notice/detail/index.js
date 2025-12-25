// ** React Imports
import { Fragment } from "react";

// ** Reactstrap Imports
import { Row, Col, Button } from "reactstrap";

// ** Custom Components
import Breadcrumbs from "@components/breadcrumbs";
import NoticeDetail from "./noticeDetail";

const FormLayouts = () => {
  const handleSave = async () => {
    if (!data.title || !data.contents) {
      alert("제목과 콘텐츠를 모두 입력하세요.");
      return;
    }

    try {
      await axios.post(`/admin/notice`, {
        ...data,
        id: id === "new" ? null : id,
      });
      alert("공지사항이 저장되었습니다.");
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <Fragment>
      <div
        className="title-wrapper"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h1 className="page-title">공지사항 등록</h1>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Button
            color="light"
            onClick={() => (window.location.href = "/harulink/manage/community")}
            style={{
              border: "1px solid #E5E7EB",
              background: "white",
              borderRadius: "6px",
              height: "40px",
              whiteSpace: "nowrap",
            }}
          >
            <span style={{ color: "#374151" }}>취소</span>
          </Button>
          <Button color="primary" onClick={handleSave}>
            등록 하기
          </Button>
        </div>
      </div>
      <Row>
        <Col md="12" sm="12">
          <NoticeDetail />
        </Col>
      </Row>
    </Fragment>
  );
};
export default FormLayouts;
