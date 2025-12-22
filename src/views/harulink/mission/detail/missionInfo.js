/* eslint-disable multiline-ternary */
import moment from 'moment/moment'
import { Fragment, useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
// ** Reactstrap Imports
import {
  Row,
  Button,
  Col,
  Card,
  Input,
  Label,
  CardBody
} from 'reactstrap'
import axios from 'axios'
import Editor from '@components/editor/editor'
import './missionInfo.scss'

const formatDate = (date) => {
  if (!date) return ''
  return moment(date).format('YYYY-MM-DD')
}

const formatDateForServer = (date) => {
  if (!date) return null
  return moment(date).format('YYYY-MM-DD HH:mm:ss')
}

const HorizontalFormIcons = ({ missionData }) => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({})

  useEffect(() => {
    if (missionData) {
      // Map server data to form fields
      setFormData({
        category: missionData.category,
        applicationStartDate: missionData.enrollStartDate,
        applicationEndDate: missionData.enrollEndDate,
        selectionDate: missionData.selectDate,
        paymentDate: missionData.paymentDate,
        visitStartDate: missionData.missionStartDate,
        visitEndDate: missionData.missionEndDate,
        contentStartDate: missionData.contentStartDate,
        contentEndDate: missionData.contentEndDate,
        mediaType: missionData.social ? missionData.social.split(',') : [],
        region: missionData.region,
        address: missionData.address,
        latitude: missionData.latitude,
        longitude: missionData.longitude,
        point: missionData.point,
        selectedCandidates: missionData.maxEnroll,
        brand: missionData.brand,
        campaignName: missionData.title,
        provisionDetails: missionData.goodsContents,
        filmingMission: missionData.missionContents,
        additionalInfo: missionData.additionalInfo,
        guideline: missionData.guideline
      })
    } else {
      setFormData({})
    }
  }, [missionData])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleCheckboxChange = (name, value) => {
    const currentValues = formData[name] || []
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value]

    setFormData({
      ...formData,
      [name]: newValues
    })
  }

  const handleEditorChange = (name, data) => {
    setFormData({
      ...formData,
      [name]: data
    })
  }

  const [thumbnailImage, setThumbnailImage] = useState(null)
  const [detailedImage, setDetailedImage] = useState(null)

  useEffect(() => {
    setThumbnailImage(missionData?.thumbnailImg || null)
    setDetailedImage(missionData?.detailImg || null)
  }, [missionData])

  const handleImageUpload = async (event, type) => {
    const file = event.target.files[0]
    if (!file) return

    const formDataUpload = new FormData()
    formDataUpload.append('file', file)

    try {
      const response = await axios.post('/admin/image', formDataUpload, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      if (type === 'thumbnail') {
        setThumbnailImage(response.data.uri)
      } else if (type === 'detailed') {
        setDetailedImage(response.data.uri)
      }
    } catch (error) {
      console.error('Image upload error:', error)
      alert('이미지 업로드 중 오류가 발생했습니다.')
    }
  }

  const handleSave = () => {
    // Validate required fields
    if (!formData.campaignName) {
      return alert('캠페인 이름을 입력해주세요.')
    }
    if (!formData.category) {
      return alert('카테고리를 선택해주세요.')
    }
    if (!formData.region) {
      return alert('지역을 선택해주세요.')
    }
    if (!formData.mediaType || formData.mediaType.length === 0) {
      return alert('미디어 타입을 최소 1개 이상 선택해주세요.')
    }
    if (!thumbnailImage) {
      return alert('썸네일 이미지를 업로드해주세요.')
    }

    // Get current date as default
    const now = moment()
    const defaultStartDate = formatDateForServer(now)
    const defaultEndDate = formatDateForServer(now.clone().add(30, 'days'))

    // Prepare data to be sent to the server
    const dataToSave = {
      category: formData.category,
      enrollStartDate: formatDateForServer(formData.applicationStartDate) || defaultStartDate,
      enrollEndDate: formatDateForServer(formData.applicationEndDate) || defaultEndDate,
      selectDate: formatDateForServer(formData.selectionDate),
      paymentDate: formatDateForServer(formData.paymentDate),
      missionStartDate: formatDateForServer(formData.visitStartDate),
      missionEndDate: formatDateForServer(formData.visitEndDate),
      contentStartDate: formatDateForServer(formData.contentStartDate),
      contentEndDate: formatDateForServer(formData.contentEndDate),
      social: formData.mediaType ? formData.mediaType.join(',') : null,
      region: formData.region,
      address: formData.address,
      latitude: formData.latitude || null,
      longitude: formData.longitude || null,
      point: formData.point || 0,
      maxEnroll: formData.selectedCandidates || 0,
      brand: formData.brand || null,
      title: formData.campaignName,
      thumbnailImg: thumbnailImage,
      detailImg: detailedImage,
      goodsContents: formData.provisionDetails,
      missionContents: formData.filmingMission,
      additionalInfo: formData.additionalInfo,
      guideline: formData.guideline
    }

    console.log(dataToSave)
    axios.post(`/admin/campaign/${id ? id : 'new'}`, dataToSave, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        if (response.success) {
          alert('저장되었습니다.')
          navigate('/harulink/manage/mission')
        }
      })
      .catch(error => {
        console.error('Error:', error)
        alert('저장 중 오류가 발생했습니다.')
      })
  }

  const handleCancel = () => {
    navigate('/harulink/manage/mission')
  }

  return (
    <Fragment>
      <div className="campaign-registration">
        {/* Header */}
        <div className="campaign-header">
          <h1 className="campaign-title">캠페인 등록</h1>
          <div className="campaign-actions">
            <Button className="btn-cancel" onClick={handleCancel}>
              취소
            </Button>
            <Button className="btn-register" onClick={handleSave}>
              등록 하기
            </Button>
          </div>
        </div>

        {/* Provided Information Section */}
        <Card className="campaign-card">
          <CardBody>
            <h2 className="section-title">제공 정보</h2>

            {/* Thumbnail Image */}
            <div className="form-group">
              <Label className="form-label">썸네일 이미지 (750px *750px 권장)</Label>
              <div className="image-upload-wrapper">
                <div
                  className="image-upload-box"
                  onClick={() => document.getElementById('thumbnailUpload').click()}
                >
                  {thumbnailImage ? (
                    <img src={thumbnailImage} alt="Thumbnail" className="uploaded-image" />
                  ) : (
                    <>
                      <div className="upload-icon">
                        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                          <path d="M16 8V24M8 16H24" stroke="#BEC1C7" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                      </div>
                      <p className="upload-text">파일업로드</p>
                    </>
                  )}
                </div>
                <Input
                  type="file"
                  id="thumbnailUpload"
                  className="d-none"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'thumbnail')}
                />
              </div>
            </div>

            {/* Detailed Image */}
            <div className="form-group">
              <Label className="form-label">상세 이미지 (가로 860px 권장)</Label>
              <div className="image-upload-wrapper">
                <div
                  className="image-upload-box"
                  onClick={() => document.getElementById('detailedUpload').click()}
                >
                  {detailedImage ? (
                    <img src={detailedImage} alt="Detailed" className="uploaded-image" />
                  ) : (
                    <>
                      <div className="upload-icon">
                        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                          <path d="M16 8V24M8 16H24" stroke="#BEC1C7" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                      </div>
                      <p className="upload-text">파일업로드</p>
                    </>
                  )}
                </div>
                <Input
                  type="file"
                  id="detailedUpload"
                  className="d-none"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'detailed')}
                />
              </div>
            </div>

            {/* Category */}
            <div className="form-group">
              <Label className="form-label">카테고리</Label>
              <div className="radio-group">
                {[
                  { value: 'restaurant', label: '맛집' },
                  { value: 'Hospital', label: '병원' },
                  { value: 'Beauty', label: '뷰티' },
                  { value: 'Culture', label: '문화' },
                  { value: 'Stay', label: '숙박' },
                  { value: 'Massage', label: '여가시설' }
                ].map((cat) => (
                  <div key={cat.value} className="radio-item">
                    <Input
                      type="radio"
                      name="category"
                      id={`category-${cat.value}`}
                      value={cat.value}
                      checked={formData?.category === cat.value}
                      onChange={handleChange}
                    />
                    <Label for={`category-${cat.value}`} className="radio-label">{cat.label}</Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Region */}
            <div className="form-group">
              <Label className="form-label">지역</Label>
              <div className="radio-group">
                {[
                  { value: 'Seoul', label: '서울' },
                  { value: 'Busan', label: '부산' },
                  { value: 'Jeju', label: '제주' },
                  { value: 'Other', label: '기타' }
                ].map((reg) => (
                  <div key={reg.value} className="radio-item">
                    <Input
                      type="radio"
                      name="region"
                      id={`region-${reg.value}`}
                      value={reg.value}
                      checked={formData?.region === reg.value}
                      onChange={handleChange}
                    />
                    <Label for={`region-${reg.value}`} className="radio-label">{reg.label}</Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Campaign Name */}
            <div className="form-group">
              <Label className="form-label">캠페인 이름</Label>
              <Input
                type="text"
                name="campaignName"
                className="form-input"
                placeholder="예) [지역] 장소이름"
                value={formData?.campaignName || ''}
                onChange={handleChange}
              />
            </div>

            {/* Provision Details */}
            <div className="form-group">
              <Label className="form-label">제공내역</Label>
              <Input
                type="text"
                name="provisionDetails"
                className="form-input"
                placeholder="Place holder"
                value={formData?.provisionDetails || ''}
                onChange={handleChange}
              />
            </div>

            {/* Address */}
            <div className="form-group">
              <Label className="form-label">주소 (구글맵)</Label>
              <Input
                type="text"
                name="address"
                className="form-input"
                placeholder="Place holder"
                value={formData?.address || ''}
                onChange={handleChange}
              />
            </div>
          </CardBody>
        </Card>

        {/* Campaign Information Section */}
        <Card className="campaign-card">
          <CardBody>
            <h2 className="section-title">캠페인 정보</h2>

            {/* Media Type */}
            <div className="form-group">
              <Label className="form-label">미션 유형</Label>
              <div className="checkbox-group">
                {[
                  { value: 'Xiaohongshu', label: '샤오홍슈' },
                  { value: 'Douyin', label: '도우인' },
                  { value: 'Dajongdienping', label: '따중띠앤핑' },
                  { value: 'Instagram', label: '인스타' },
                  { value: 'YouTube', label: '유튜브' }
                ].map((media) => (
                  <div key={media.value} className="checkbox-item">
                    <Input
                      type="checkbox"
                      name="mediaType"
                      id={`media-${media.value}`}
                      value={media.value}
                      checked={(formData?.mediaType || []).includes(media.value)}
                      onChange={() => handleCheckboxChange('mediaType', media.value)}
                    />
                    <Label for={`media-${media.value}`} className="checkbox-label">{media.label}</Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Date Fields Row 1 */}
            <Row className="form-row">
              <Col md={6}>
                <div className="form-group">
                  <Label className="form-label">캠페인 신청기간</Label>
                  <Row>
                    <Col>
                      <Input
                        type="date"
                        name="applicationStartDate"
                        className="form-input"
                        value={formatDate(formData?.applicationStartDate) || ''}
                        onChange={handleChange}
                      />
                    </Col>
                    <Col>
                      <Input
                        type="date"
                        name="applicationEndDate"
                        className="form-input"
                        value={formatDate(formData?.applicationEndDate) || ''}
                        onChange={handleChange}
                      />
                    </Col>
                  </Row>
                </div>
              </Col>
              <Col md={6}>
                <div className="form-group">
                  <Label className="form-label">인플루언서 선정일</Label>
                  <Input
                    type="date"
                    name="selectionDate"
                    className="form-input"
                    value={formatDate(formData?.selectionDate) || ''}
                    onChange={handleChange}
                  />
                </div>
              </Col>
            </Row>

            {/* Date Fields Row 2 */}
            <Row className="form-row">
              <Col md={6}>
                <div className="form-group">
                  <Label className="form-label">방문기간</Label>
                  <Row>
                    <Col>
                      <Input
                        type="date"
                        name="visitStartDate"
                        className="form-input"
                        value={formatDate(formData?.visitStartDate) || ''}
                        onChange={handleChange}
                      />
                    </Col>
                    <Col>
                      <Input
                        type="date"
                        name="visitEndDate"
                        className="form-input"
                        value={formatDate(formData?.visitEndDate) || ''}
                        onChange={handleChange}
                      />
                    </Col>
                  </Row>
                </div>
              </Col>
              <Col md={6}>
                <div className="form-group">
                  <Label className="form-label">콘텐츠 등록기간</Label>
                  <Row>
                    <Col>
                      <Input
                        type="date"
                        name="contentStartDate"
                        className="form-input"
                        value={formatDate(formData?.contentStartDate) || ''}
                        onChange={handleChange}
                      />
                    </Col>
                    <Col>
                      <Input
                        type="date"
                        name="contentEndDate"
                        className="form-input"
                        value={formatDate(formData?.contentEndDate) || ''}
                        onChange={handleChange}
                      />
                    </Col>
                  </Row>
                </div>
              </Col>
            </Row>

            {/* Number of Selected Candidates */}
            <div className="form-group">
              <Label className="form-label">선정자 수</Label>
              <Input
                type="number"
                name="selectedCandidates"
                className="form-input"
                placeholder="Place holder"
                value={formData?.selectedCandidates || ''}
                onChange={handleChange}
              />
            </div>

            {/* Guideline */}
            <div className="form-group">
              <Label className="form-label">가이드라인</Label>
              <Editor
                content={formData?.guideline || ''}
                onChange={(data) => handleEditorChange('guideline', data)}
              />
            </div>

            {/* Filming/Editing Mission */}
            <div className="form-group">
              <Label className="form-label">촬영/편집 미션</Label>
              <Editor
                content={formData?.filmingMission || ''}
                onChange={(data) => handleEditorChange('filmingMission', data)}
              />
            </div>

            {/* Additional Information */}
            <div className="form-group">
              <Label className="form-label">주의 안내사항</Label>
              <Editor
                content={formData?.additionalInfo || ''}
                onChange={(data) => handleEditorChange('additionalInfo', data)}
              />
            </div>
          </CardBody>
        </Card>
      </div>
    </Fragment>
  )
}
export default HorizontalFormIcons
