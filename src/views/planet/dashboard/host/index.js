// ** React Imports
import { useContext } from 'react'

// ** Icons Imports
import { List, AlertCircle } from 'react-feather'

// ** Custom Components
import Avatar from '@components/avatar'
import Timeline from '@components/timeline'
import AvatarGroup from '@components/avatar-group'

// ** Utils
import { kFormatter } from '@utils'

// ** Context
import { ThemeColors } from '@src/utility/context/ThemeColors'

// ** Reactstrap Imports
import { Row, Col, Card, CardHeader, CardTitle, CardBody, Alert, CardText, Nav, NavItem, NavLink } from 'reactstrap'
import NewClassTable from './NewClass'

// ** Demo Components
import Banner from './Banner'

// ** Images
import StatsCard from './StatsCard'

// ** Styles
import '@styles/react/libs/charts/apex-charts.scss'

const AnalyticsDashboard = () => {

  return (
    <div id='dashboard-analytics'>
      <Alert color='warning' isOpen={true}>
        <div className='alert-body'>
          <AlertCircle size={15} />{' '}
          <span className='ms-1'>
            프로그램 등록이 필요합니다.
          </span>
        </div>
      </Alert>
      <Row className='match-height'>
        <Col lg='12' sm='12'>
          <Banner />
        </Col>
      </Row>
      <Row className='match-height'>
        <Col xl='12' md='12' xs='12'>
          <StatsCard cols={{ xl: '3', sm: '6' }} />
        </Col>
      </Row>
      <Row className='match-height'>
        <Col lg='12' md='12'>

          <Card className='card-statistics'>
            <CardHeader>
              <CardTitle tag='h4'>통합게시판</CardTitle>
              <CardText className='card-text font-small-2 me-25 mb-0'>더보기</CardText>
            </CardHeader>
            <CardBody className='' style={{ padding: 0 }}>
              <Nav tabs fill>
                <NavItem>
                  <NavLink
                    active={true}
                    onClick={() => {
                    }}
                  >
                    전체
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    active={false}
                    onClick={() => {
                    }}
                  >
                    일반
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    active={false}
                    onClick={() => {
                    }}
                  >
                    교육
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    active={false}
                    onClick={() => {
                    }}
                  >
                    프로그램운영
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    active={false}
                    onClick={() => {
                    }}
                  >
                    메뉴얼
                  </NavLink>
                </NavItem>
              </Nav>
              <NewClassTable />
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default AnalyticsDashboard
