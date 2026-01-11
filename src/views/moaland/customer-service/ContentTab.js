// ** React Imports
import { Fragment, useState, useEffect } from "react";

// ** Reactstrap Imports
import { Card, Button, Row, Col } from "reactstrap";

import axios from "axios";

// ** Editor
import Editor from "@components/editor/editor";

// ** Styles
import "./ContentTab.scss";

const fetchData = async (type) => {
  try {
    const params = {
      type,
      page: 1,
      item: 1,
    };

    const response = await axios.get("/admin/faq", { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching content:", error);
    return { data: [] };
  }
};

const ContentTab = ({ type, title }) => {
  const [content, setContent] = useState("");
  const [contentCn, setContentCn] = useState("");
  const [existingId, setExistingId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const result = await fetchData(type);
      if (result && result.data && result.data.length > 0) {
        const firstItem = result.data[0];
        setContent(firstItem.answer || "");
        setContentCn(firstItem.answerCn || "");
        setExistingId(firstItem.id);
      } else {
        setContent("");
        setContentCn("");
        setExistingId(null);
      }
    };
    loadData();
  }, [type]);

  const handleEditorChange = (data) => {
    setContent(data);
  };

  const handleEditorChangeCn = (data) => {
    setContentCn(data);
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      await axios.post("/admin/faq", {
        ...(existingId && { id: existingId }),
        type,
        title,
        answer: content,
        answerCn: contentCn,
      });

      alert("저장되었습니다.");

      // Reload data to get the ID if it was a create
      const result = await fetchData(type);
      if (result && result.data && result.data.length > 0) {
        setExistingId(result.data[0].id);
      }
    } catch (error) {
      console.error("Error saving content:", error);
      alert("저장에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Fragment>
      <Card className="content-tab-card mt-2">
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
            <h4 className="mb-0">{title}</h4>

            <Button
              color="primary"
              style={{ height: "48px", fontSize: "16px", minWidth: "120px" }}
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? "저장 중..." : "저장"}
            </Button>
          </div>

          {/* Editor */}
          <Row>
            <Col md={6}>
              <h5 className="mb-2">콘텐츠 (한국어)</h5>
              <div className="editor-wrapper">
                <Editor content={content} onChange={handleEditorChange} />
              </div>
            </Col>
            <Col md={6}>
              <h5 className="mb-2">콘텐츠 (중국어)</h5>
              <div className="editor-wrapper">
                <Editor content={contentCn} onChange={handleEditorChangeCn} />
              </div>
            </Col>
          </Row>
        </div>
      </Card>
    </Fragment>
  );
};

export default ContentTab;
