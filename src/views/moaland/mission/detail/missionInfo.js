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
import { GoogleMapsAutocomplete } from '@components/google-maps'
import { getRegionOptions, getCategoryOptions, getMediaTypeOptions } from '../constants'
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

  const [thumbnailFile, setThumbnailFile] = useState(null)
  const [detailedFile, setDetailedFile] = useState(null)
  const [thumbnailPreview, setThumbnailPreview] = useState(null)
  const [detailedPreview, setDetailedPreview] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [formData, setFormData] = useState({})
  const [loading, setLoading] = useState(false)
  const [fetchedMissionData, setFetchedMissionData] = useState(null)

  // Fetch mission detail when editing
  useEffect(() => {
    const fetchMissionDetail = async () => {
      if (!id || id === 'new') {
        return
      }

      try {
        setLoading(true)
        const response = await axios.get(`/admin/mission/${id}`)

        if (response.success) {
          setFetchedMissionData(response.mission)
          setThumbnailPreview(response.mission.thumbnailImg)
          setDetailedPreview(response.mission.detailImg)
        }
      } catch (error) {
        console.error('Failed to fetch mission details:', error)
        alert('미션 정보를 불러오는데 실패했습니다.')
      } finally {
        setLoading(false)
      }
    }

    fetchMissionDetail()
  }, [id])

  // Populate form when mission data is available
  useEffect(() => {
    const dataSource = missionData || fetchedMissionData

    if (dataSource) {
      // Map server data to form fields
      setFormData({
        category: dataSource.category,
        applicationStartDate: dataSource.enrollStartDate,
        applicationEndDate: dataSource.enrollEndDate,
        selectionDate: dataSource.selectDate,
        paymentDate: dataSource.paymentDate,
        visitStartDate: dataSource.missionStartDate,
        visitEndDate: dataSource.missionEndDate,
        contentStartDate: dataSource.contentStartDate,
        contentEndDate: dataSource.contentEndDate,
        mediaType: dataSource.social ? dataSource.social.split(',') : [],
        region: dataSource.region,
        address: dataSource.address,
        latitude: dataSource.latitude,
        longitude: dataSource.longitude,
        point: dataSource.point,
        selectedCandidates: dataSource.maxEnroll,
        brand: dataSource.brand,
        campaignName: dataSource.title,
        provisionDetails: dataSource.goodsContents,
        filmingMission: dataSource.missionContents,
        additionalInfo: dataSource.additionalInfo,
        guideline: dataSource.guideline,
        isRecommended: dataSource.isRecommended === true
      })
    } else {
      setFormData({})
    }
  }, [missionData, fetchedMissionData])

  const handleChange = (e) => {
    const { name, value, latitude, longitude } = e.target
    const updates = { [name]: value }

    // Capture latitude and longitude if present (from GoogleMapsAutocomplete)
    if (latitude !== undefined) updates.latitude = latitude
    if (longitude !== undefined) updates.longitude = longitude

    setFormData(prev => ({
      ...prev,
      ...updates
    }))
  }

  const handleEditorChange = (name, data) => {
    setFormData(prev => ({
      ...prev,
      [name]: data
    }))
  }

  const handlePlaceSelect = (placeData) => {
    setFormData(prev => ({
      ...prev,
      address: placeData.address,
      latitude: placeData.latitude,
      longitude: placeData.longitude
    }))
  }

  const handleNumberKeyDown = (e) => {
    // Prevent: e, E, +, -, .
    if (['e', 'E', '+', '-', '.'].includes(e.key)) {
      e.preventDefault()
    }
  }

  const handleNumberChange = (e) => {
    const { name, value } = e.target
    // Only allow digits (remove any non-numeric characters)
    const numericValue = value.replace(/[^0-9]/g, '')
    setFormData(prev => ({
      ...prev,
      [name]: numericValue
    }))
  }

  useEffect(() => {
    // Load existing images from missionData
    if (missionData?.thumbnailImg) {
      setThumbnailPreview(missionData.thumbnailImg)
    }
    if (missionData?.detailImg) {
      setDetailedPreview(missionData.detailImg)
    }
  }, [missionData])

  // Cleanup blob URLs on unmount
  useEffect(() => {
    return () => {
      if (thumbnailPreview && thumbnailPreview.startsWith('blob:')) {
        URL.revokeObjectURL(thumbnailPreview)
      }
      if (detailedPreview && detailedPreview.startsWith('blob:')) {
        URL.revokeObjectURL(detailedPreview)
      }
    }
  }, [thumbnailPreview, detailedPreview])

  const handleImageSelect = (event, type) => {
    const file = event.target.files[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드 가능합니다.')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('파일 크기는 5MB를 초과할 수 없습니다.')
      return
    }

    // Create preview URL
    const previewUrl = URL.createObjectURL(file)

    if (type === 'thumbnail') {
      // Cleanup old preview URL if exists
      if (thumbnailPreview && thumbnailPreview.startsWith('blob:')) {
        URL.revokeObjectURL(thumbnailPreview)
      }
      setThumbnailFile(file)
      setThumbnailPreview(previewUrl)
    } else if (type === 'detailed') {
      // Cleanup old preview URL if exists
      if (detailedPreview && detailedPreview.startsWith('blob:')) {
        URL.revokeObjectURL(detailedPreview)
      }
      setDetailedFile(file)
      setDetailedPreview(previewUrl)
    }
  }

  const uploadImage = async (file) => {
    const formDataUpload = new FormData()
    formDataUpload.append('file', file)

    const response = await axios.post('/admin/image', formDataUpload, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    return response.data.uri
  }

  const handleSave = async () => {
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
      return alert('미션 유형을 선택해주세요.')
    }
    if (!thumbnailPreview && !thumbnailFile) {
      return alert('썸네일 이미지를 업로드해주세요.')
    }

    try {
      setIsUploading(true)

      // Upload images if new files are selected
      let thumbnailUrl = thumbnailPreview
      let detailedUrl = detailedPreview

      // Upload thumbnail if new file selected
      if (thumbnailFile) {
        try {
          thumbnailUrl = await uploadImage(thumbnailFile)
        } catch (error) {
          console.error('Thumbnail upload error:', error)
          alert('썸네일 이미지 업로드 중 오류가 발생했습니다.')
          setIsUploading(false)
          return
        }
      }

      // Upload detailed image if new file selected
      if (detailedFile) {
        try {
          detailedUrl = await uploadImage(detailedFile)
        } catch (error) {
          console.error('Detailed image upload error:', error)
          alert('상세 이미지 업로드 중 오류가 발생했습니다.')
          setIsUploading(false)
          return
        }
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
        thumbnailImg: thumbnailUrl,
        detailImg: detailedUrl,
        goodsContents: formData.provisionDetails,
        missionContents: formData.filmingMission,
        additionalInfo: formData.additionalInfo,
        guideline: formData.guideline,
        isRecommended: formData.isRecommended
      }

      const response = await axios.post(`/admin/mission/${id ? id : 'new'}`, dataToSave, {
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (response.success) {
        alert('저장되었습니다.')
        navigate('/moaland/manage/campaign')
      }
    } catch (error) {
      console.error('Save error:', error)
      alert('저장 중 오류가 발생했습니다.')
    } finally {
      setIsUploading(false)
    }
  }

  const handleCancel = () => {
    navigate('/moaland/manage/campaign')
  }

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <div style={{ fontSize: '16px', color: '#666' }}>로딩 중...</div>
      </div>
    )
  }

  return (
    <Fragment>
      <div className="campaign-registration">
        {/* Header */}
        <div className="campaign-header">
          <h1 className="campaign-title">{id && id !== 'new' ? '캠페인 수정' : '캠페인 등록'}</h1>
          <div className="campaign-actions">
            <Button className="btn-cancel" onClick={handleCancel} disabled={isUploading}>
              취소
            </Button>
            <Button className="btn-register" onClick={handleSave} disabled={isUploading}>
              {isUploading ? '업로드 중...' : (id && id !== 'new' ? '수정 하기' : '등록 하기')}
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
                  {thumbnailPreview ? (
                    <img src={thumbnailPreview} alt="Thumbnail" className="uploaded-image" />
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
                  onChange={(e) => handleImageSelect(e, 'thumbnail')}
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
                  {detailedPreview ? (
                    <img src={detailedPreview} alt="Detailed" className="uploaded-image" />
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
                  onChange={(e) => handleImageSelect(e, 'detailed')}
                />
              </div>
            </div>

            {/* Category */}
            <div className="form-group">
              <Label className="form-label">카테고리</Label>
              <div className="radio-group">
                {getCategoryOptions().map((cat) => (
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
                {getRegionOptions().map((reg) => (
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
                placeholder="제공내역을 입력해주세요"
                value={formData?.provisionDetails || ''}
                onChange={handleChange}
              />
            </div>

            {/* Address */}
            <div className="form-group">
              <Label className="form-label">주소 (구글맵)</Label>
              <GoogleMapsAutocomplete
                value={formData?.address || ''}
                onChange={handleChange}
                onPlaceSelect={handlePlaceSelect}
                latitude={formData?.latitude}
                longitude={formData?.longitude}
                name="address"
                placeholder="주소를 입력하거나 검색하세요"
                className="form-input"
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
              <div className="radio-group">
                {getMediaTypeOptions().map((media) => (
                  <div key={media.value} className="radio-item">
                    <Input
                      type="radio"
                      name="mediaType"
                      id={`media-${media.value}`}
                      value={media.value}
                      checked={(formData?.mediaType || [])[0] === media.value}
                      onChange={() => setFormData(prev => ({ ...prev, mediaType: [media.value] }))}
                    />
                    <Label for={`media-${media.value}`} className="radio-label">{media.label}</Label>
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
                placeholder="선정자 수를 숫자로 입력해주세요."
                value={formData?.selectedCandidates || ''}
                onChange={handleNumberChange}
                onKeyDown={handleNumberKeyDown}
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
