// ** React Imports
import { useState, useEffect } from "react";

// ** Reactstrap Imports
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  FormFeedback,
} from "reactstrap";

const FAQModal = ({ isOpen, toggle, faq, type, onSave }) => {
  const [formData, setFormData] = useState({
    title: "",
    answer: "",
    displayOrder: 0,
    isActive: "Y",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (faq) {
      setFormData({
        title: faq.title || "",
        answer: faq.answer || "",
        displayOrder: faq.displayOrder || 0,
        isActive: faq.isActive || "Y",
      });
    } else {
      setFormData({
        title: "",
        answer: "",
        displayOrder: 0,
        isActive: "Y",
      });
    }
    setErrors({});
  }, [faq, isOpen]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = "제목을 입력해주세요";
    }
    if (!formData.answer.trim()) {
      newErrors.answer = "내용을 입력해주세요";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onSave(formData);
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg">
      <ModalHeader
        toggle={toggle}
        style={{ backgroundColor: "white", fontSize: "18px" }}
      >
        자주묻는 질문 등록
      </ModalHeader>
      <ModalBody>
        <Form>
          <Label for="title">
            질문 <span className="text-danger">*</span>
          </Label>
          <Input
            type="text"
            id="title"
            placeholder="자주묻는 질문"
            value={formData.title}
            onChange={(e) => handleChange("title", e.target.value)}
            invalid={!!errors.title}
          />

          <Label for="answer" style={{ marginTop: "12px" }}>
            답변 <span className="text-danger">*</span>
          </Label>
          <Input
            type="textarea"
            id="answer"
            rows="8"
            placeholder="답변"
            value={formData.answer}
            onChange={(e) => handleChange("answer", e.target.value)}
            invalid={!!errors.answer}
          />
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={toggle}>
          취소
        </Button>
        <Button color="primary" onClick={handleSubmit}>
          등록하기
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default FAQModal;
