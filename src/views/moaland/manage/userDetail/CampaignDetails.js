// ** React Imports
import { Fragment, useState } from 'react'
import moment from 'moment/moment'

// ** Reactstrap Imports
import { Card, Table, Nav, NavItem, NavLink, Button, Modal, ModalHeader, ModalBody } from 'reactstrap'

// ** Styles
import './CampaignDetails.scss'

const CampaignDetails = ({ enrollData, selectData, completeData, userData }) => {
  const [activeTab, setActiveTab] = useState('applied')
  const [modalOpen, setModalOpen] = useState(false)
  const [contentModalOpen, setContentModalOpen] = useState(false)
  const [selectedCampaign, setSelectedCampaign] = useState(null)

  // Helper function to ensure URL has proper protocol
  const ensureHttpsUrl = (url) => {
    if (!url || typeof url !== 'string') return null
    const trimmedUrl = url.trim()
    if (!trimmedUrl) return null
    // If URL already has a protocol, return as-is (but upgrade http to https)
    if (trimmedUrl.startsWith('http://')) {
      return trimmedUrl.replace('http://', 'https://')
    }
    if (trimmedUrl.startsWith('https://')) {
      return trimmedUrl
    }
    // Add https:// prefix for URLs without protocol
    return `https://${trimmedUrl}`
  }

  const getContentUrl = (campaign) => {
    if (!campaign?.link) return null
    try {
      const linkObj = typeof campaign.link === 'string' ? JSON.parse(campaign.link) : campaign.link
      // Use the social field to get the correct URL, or get the first available URL
      if (campaign.social && linkObj[campaign.social]) {
        return ensureHttpsUrl(linkObj[campaign.social])
      }
      // Fallback: return the first URL in the object
      const keys = Object.keys(linkObj)
      return keys.length > 0 ? ensureHttpsUrl(linkObj[keys[0]]) : null
    } catch (e) {
      // If parsing fails, assume it's already a direct URL
      return ensureHttpsUrl(campaign.link)
    }
  }

  const toggleModal = () => setModalOpen(!modalOpen)
  const toggleContentModal = () => setContentModalOpen(!contentModalOpen)

  const handleViewApplication = (e, campaign) => {
    e.stopPropagation()
    setSelectedCampaign(campaign)
    setModalOpen(true)
  }

  const handleViewContent = (e, campaign) => {
    e.stopPropagation()
    setSelectedCampaign(campaign)
    setContentModalOpen(true)
  }

  const handleRowClick = (id) => {
    window.location.href = `/moaland/manage/campaign/${id}`
  }

  const renderEnrolledData = () => {
    if (!enrollData || enrollData.length === 0) {
      return (
        <tr>
          <td colSpan="8" className="text-center">데이터가 없습니다</td>
        </tr>
      )
    }

    return enrollData.map(col => {
      return (
        <tr key={col.missionId} onClick={() => handleRowClick(col.missionId)}>
          <td>{col.missionId}</td>
          <td className='underline-text'>{col.title}</td>
          <td>진행중</td>
          <td>{col.social}</td>
          <td>{col.enrollCount}/{col.maxEnroll}명</td>
          <td>{moment(col.created).format("YY.MM.DD")}~{moment(col.created).format("YY.MM.DD")}</td>
          <td>{moment(col.created).format("YY.MM.DD")}</td>
          <td>
            <Button color="light" size="sm" className='view-btn' onClick={(e) => handleViewApplication(e, col)}>
              신청서 보기
            </Button>
          </td>
        </tr>
      )
    })
  }

  const renderSelectedData = () => {
    if (!selectData || selectData.length === 0) {
      return (
        <tr>
          <td colSpan="8" className="text-center">데이터가 없습니다</td>
        </tr>
      )
    }

    return selectData.map(col => {
      return (
        <tr key={col.missionId} onClick={() => handleRowClick(col.missionId)}>
          <td>{col.missionId}</td>
          <td className='underline-text'>{col.title}</td>
          <td>선정됨</td>
          <td>{col.social}</td>
          <td>{col.enrollCount}/{col.maxEnroll}명</td>
          <td>{moment(col.created).format("YY.MM.DD")}~{moment(col.created).format("YY.MM.DD")}</td>
          <td>{col.linkUpdated ? moment(col.linkUpdated).format("YY.MM.DD") : '-'}</td>
          <td>
            <Button color="light" size="sm" className='view-btn' onClick={(e) => handleViewContent(e, col)}>
              신청서 보기
            </Button>
          </td>
        </tr>
      )
    })
  }

  const renderCompletedData = (isEnded) => {
    if (!completeData || completeData.length === 0) {
      return (
        <tr>
          <td colSpan="8" className="text-center">데이터가 없습니다</td>
        </tr>
      )
    }

    return completeData.map(col => {
      return (
        <tr key={col.missionId} onClick={() => handleRowClick(col.missionId)}>
          <td>{col.missionId}</td>
          <td className='underline-text'>{col.title}</td>
          <td>완료됨</td>
          <td>{col.social}</td>
          <td>{col.enrollCount}/{col.maxEnroll}명</td>
          <td>{moment(col.created).format("YY.MM.DD")}~{moment(col.created).format("YY.MM.DD")}</td>
          <td>{col.linkUpdated ? moment(col.linkUpdated).format("YY.MM.DD") : '-'}</td>
          <td>
            <Button color="light" size="sm" className='view-btn' onClick={(e) => handleViewContent(e, col)}>
              {isEnded ? "콘텐츠 보기" : "콘텐츠 보기"}
            </Button>
          </td>
        </tr>
      )
    })
  }

  const renderData = () => {
    switch (activeTab) {
      case 'applied':
        return renderEnrolledData()
      case 'selected':
        return renderSelectedData()
      case 'registered':
        return renderCompletedData(false)
      case 'ended':
        return renderCompletedData(true)
      default:
        return renderEnrolledData()
    }
  }

  return (
    <Fragment>
      <Card className='campaign-details-card'>
        <div className='card-content'>
          <h4 className='card-title'>캠페인 내역</h4>

          <div className='tabs-wrapper'>
            <Nav className='campaign-tabs'>
              <NavItem>
                <NavLink
                  className={activeTab === 'applied' ? 'active' : ''}
                  onClick={() => setActiveTab('applied')}
                >
                  신청한 캠페인
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={activeTab === 'selected' ? 'active' : ''}
                  onClick={() => setActiveTab('selected')}
                >
                  선정된 캠페인
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={activeTab === 'registered' ? 'active' : ''}
                  onClick={() => setActiveTab('registered')}
                >
                  등록한 캠페인
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={activeTab === 'ended' ? 'active' : ''}
                  onClick={() => setActiveTab('ended')}
                >
                  종료된 캠페인
                </NavLink>
              </NavItem>
            </Nav>
          </div>

          <div className='table-wrapper'>
            <Table responsive>
              <thead>
                <tr>
                  <th>캠페인 번호</th>
                  <th>캠페인 제목</th>
                  <th>캠페인 상태</th>
                  <th>미디어</th>
                  <th>신청현황</th>
                  <th>신청기간</th>
                  <th>인플루언서 발표</th>
                  <th>신청 정보</th>
                </tr>
              </thead>
              <tbody>{renderData()}</tbody>
            </Table>
          </div>
        </div>
      </Card>

      {/* Application Modal */}
      <Modal isOpen={modalOpen} toggle={toggleModal} className="application-modal" centered>
        <ModalHeader toggle={toggleModal} className="application-modal-header">
          캠페인 신청서
        </ModalHeader>
        <ModalBody className="application-modal-body">
          {selectedCampaign && (
            <>
              <div className="modal-section">
                <label className="modal-label">신청 캠페인</label>
                <div className="modal-campaign-info">
                  <p className="campaign-title">{selectedCampaign.title}</p>
                  <p className="campaign-desc">{selectedCampaign.goodsContents || '-'}</p>
                </div>
              </div>
              <hr className="modal-divider" />
              <div className="modal-section">
                <label className="modal-label">이름</label>
                <p className="modal-value">{userData?.name || '-'}</p>
              </div>
              <div className="modal-section">
                <label className="modal-label">SNS</label>
                <p className="modal-value">{userData?.instagram_link || userData?.sns || '-'}</p>
              </div>
              <div className="modal-section">
                <label className="modal-label">방문일 및 시간</label>
                <p className="modal-value">
                  {selectedCampaign.visit_datetime_start ? moment(selectedCampaign.visit_datetime_start).format("YY.MM.DD a h시") : '-'}
                </p>
              </div>
            </>
          )}
        </ModalBody>
      </Modal>

      {/* Content Modal */}
      <Modal isOpen={contentModalOpen} toggle={toggleContentModal} className="application-modal" centered>
        <ModalHeader toggle={toggleContentModal} className="application-modal-header">
          등록된 콘텐츠
        </ModalHeader>
        <ModalBody className="application-modal-body">
          {selectedCampaign && (
            <>
              <div className="modal-section">
                <label className="modal-label">신청 캠페인</label>
                <div className="modal-campaign-info">
                  <p className="campaign-title">{selectedCampaign.title}</p>
                  <p className="campaign-desc">{selectedCampaign.goodsContents || '-'}</p>
                </div>
              </div>
              <div className="modal-section">
                <label className="modal-label">콘텐츠 등록기간</label>
                <p className="modal-value">
                  {selectedCampaign.contentStartDate && selectedCampaign.contentEndDate ? `${moment(selectedCampaign.contentStartDate).format("MM.DD")}~${moment(selectedCampaign.contentEndDate).format("MM.DD")}` : '-'}
                </p>
              </div>
              <hr className="modal-divider" />
              <div className="modal-section">
                <label className="modal-label">콘텐츠 URL</label>
                {getContentUrl(selectedCampaign) ? (
                  <a href={getContentUrl(selectedCampaign)} target="_blank" rel="noopener noreferrer" className="modal-link">
                    콘텐츠 URL
                  </a>
                ) : (
                  <p className="modal-value">-</p>
                )}
              </div>
            </>
          )}
        </ModalBody>
      </Modal>
    </Fragment>
  )
}

export default CampaignDetails
