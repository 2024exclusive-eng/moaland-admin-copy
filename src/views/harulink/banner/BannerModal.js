// ** React Imports
import { useState, useEffect, useRef } from "react";

// ** Reactstrap Imports
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Form,
  Label,
  Input,
} from "reactstrap";

// ** Icons
import { Upload } from "react-feather";

// ** Axios
import axios from "axios";

// ** Utils
import { normalizeUrl, isValidUrl } from "@utils";

// ** Styles
import "./BannerModal.scss";

const BannerModal = ({
  isOpen,
  toggle,
  banner,
  onSave,
  defaultType = "home",
}) => {
  const [formData, setFormData] = useState({
    type: defaultType,
    name: "",
    thumbnailPath: "",
    link: "",
    isActive: "Y",
  });

  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [thumbnailUrl, setThumbnailUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (banner) {
      setFormData({
        type: banner.type || defaultType,
        name: banner.name || "",
        thumbnailPath: banner.thumbnailPath || "",
        link: banner.link || "",
        isActive: banner.isActive || "Y",
      });
      setImagePreview(banner.thumbnailPath || null);
      setThumbnailUrl(banner.thumbnailPath || null);
    } else {
      setFormData({
        type: defaultType,
        name: "",
        thumbnailPath: "",
        link: "",
        isActive: "Y",
      });
      setImagePreview(null);
      setThumbnailUrl(null);
    }
    setErrors({});
  }, [banner, isOpen, defaultType]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Show preview immediately
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Upload to server
    const formDataUpload = new FormData();
    formDataUpload.append("file", file);

    try {
      setUploading(true);
      const response = await axios.post("/admin/image", formDataUpload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setThumbnailUrl(response.data.uri);
      if (errors.thumbnail) {
        setErrors((prev) => ({ ...prev, thumbnail: "" }));
      }
    } catch (error) {
      console.error("Image upload error:", error);
      alert("이미지 업로드 중 오류가 발생했습니다.");
      setImagePreview(null);
    } finally {
      setUploading(false);
    }
  };

  const handleFileUploadClick = () => {
    if (!uploading) {
      fileInputRef.current?.click();
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "배너명을 입력해주세요";
    }
    if (!formData.link.trim()) {
      newErrors.link = "URL을 입력해주세요";
    } else if (!isValidUrl(formData.link)) {
      newErrors.link = "올바른 URL 형식이 아닙니다";
    }
    if (!thumbnailUrl) {
      newErrors.thumbnail = "썸네일 이미지를 업로드해주세요";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      const dataToSave = {
        ...formData,
        link: normalizeUrl(formData.link),
        thumbnailPath: thumbnailUrl,
      };
      onSave(dataToSave);
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg" className="banner-modal">
      <ModalHeader toggle={toggle} className="banner-modal-header">
        배너 수정
      </ModalHeader>
      <ModalBody className="banner-modal-body">
        <Form>
          {/* Thumbnail Image Upload */}
          <Label className="banner-modal-label">
            썸네일 이미지
            <span
              style={{
                fontSize: "12px",
                color: "#999",
                fontWeight: "normal",
              }}
            >
              (744px * 320px 권장)
            </span>
          </Label>
          <div
            className={`image-upload-area ${errors.thumbnail ? "error" : ""} ${
              uploading ? "uploading" : ""
            }`}
            onClick={handleFileUploadClick}
          >
            {uploading ? (
              <div className="upload-placeholder">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <span>업로드 중...</span>
              </div>
            ) : imagePreview ? (
              <img src={imagePreview} alt="Preview" className="image-preview" />
            ) : (
              <div className="upload-placeholder">
                <Upload size={24} color="#999" />
                <span>파일업로드</span>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: "none" }}
              disabled={uploading}
            />
          </div>

          {/* Banner Name */}
          <Label
            for="name"
            className="banner-modal-label"
            style={{ marginTop: "24px" }}
          >
            배너관리명
          </Label>
          <Input
            type="text"
            id="name"
            placeholder="배너관리명"
            className="banner-modal-input"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            invalid={!!errors.name}
          />

          {/* Link URL */}
          <Label
            for="link"
            className="banner-modal-label"
            style={{ marginTop: "24px" }}
          >
            연결 URL
          </Label>
          <Input
            type="text"
            id="link"
            placeholder="URL을 입력하세요."
            className="banner-modal-input"
            value={formData.link}
            onChange={(e) => handleChange("link", e.target.value)}
            invalid={!!errors.link}
          />
        </Form>
      </ModalBody>
      <ModalFooter className="banner-modal-footer">
        <Button color="light" onClick={toggle} className="cancel-btn">
          취소
        </Button>
        <Button color="primary" onClick={handleSubmit} className="submit-btn">
          등록하기
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default BannerModal;
