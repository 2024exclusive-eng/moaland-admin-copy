// ** React Imports
import { Fragment } from 'react'

// ** Reactstrap Imports
import { Card, CardBody, Row, Col } from 'reactstrap'

// ** Styles
import './UserHeader.scss'

const UserHeader = ({ stats }) => {
  return (
    <Fragment>
      {/* Page Title Section */}
      <div className='user-header-title'>
        <div className='title-wrapper'>
          <h1 className='page-title'>회원 관리</h1>
          <div className='member-badge'>100,000명</div>
        </div>
        <p className='page-subtitle'>회원 리스트 관리 페이지</p>
      </div>

      {/* Statistics Cards */}
      <Row className='user-stats-row'>
        <Col md='4' sm='12'>
          <Card className='stat-card'>
            <CardBody>
              <p className='stat-label'>전체 회원</p>
              <h2 className='stat-value'>{stats?.totalMembers?.toLocaleString() || '8,923'}</h2>
            </CardBody>
          </Card>
        </Col>
        <Col md='4' sm='12'>
          <Card className='stat-card'>
            <CardBody>
              <p className='stat-label'>신규 회원(30일 기준)</p>
              <h2 className='stat-value'>{stats?.newMembers?.toLocaleString() || '923'}</h2>
            </CardBody>
          </Card>
        </Col>
        <Col md='4' sm='12'>
          <Card className='stat-card'>
            <CardBody>
              <p className='stat-label'>탈퇴 회원</p>
              <h2 className='stat-value'>{stats?.withdrawnMembers?.toLocaleString() || '23'}</h2>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Fragment>
  )
}

export default UserHeader
