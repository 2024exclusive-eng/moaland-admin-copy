// ** React Imports
import { Fragment, useState } from 'react'
import moment from 'moment/moment'

// ** Reactstrap Imports
import { Card, Table, Nav, NavItem, NavLink, Button } from 'reactstrap'

// ** Styles
import './CampaignDetails.scss'

const CampaignDetails = ({ enrollData, selectData, completeData }) => {
  const [activeTab, setActiveTab] = useState('applied')

  const handleRowClick = (id) => {
    window.location.href = `/harulink/manage/mission/${id}`
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
            <Button color="light" size="sm" className='view-btn'>
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
            <Button color="light" size="sm" className='view-btn'>
              신청서 보기
            </Button>
          </td>
        </tr>
      )
    })
  }

  const renderCompletedData = () => {
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
            <Button color="light" size="sm" className='view-btn'>
              신청서 보기
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
        return renderCompletedData()
      case 'ended':
        return (
          <tr>
            <td colSpan="8" className="text-center">데이터가 없습니다</td>
          </tr>
        )
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
    </Fragment>
  )
}

export default CampaignDetails
