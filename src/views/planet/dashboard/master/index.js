// ** React Imports
import { useContext } from 'react'

// ** Reactstrap Imports
import { Row, Col, Card, CardHeader, CardTitle, CardBody, CardText } from 'reactstrap'

// ** Context
import { ThemeColors } from '@src/utility/context/ThemeColors'

// ** Demo Components
import NewJoinTable from './NewJoin'
import NewClassTable from './NewClass'
import NewPromotionTable from './NewPromotion'
import NewSettlementTable from './NewSettlement'

import Earnings from '@src/views/ui-elements/cards/analytics/Earnings'
import CardMeetup from '@src/views/ui-elements/cards/advance/CardMeetup'
import StatsCard from './StatsCard'
import GoalOverview from '@src/views/ui-elements/cards/analytics/GoalOverview'
import RevenueReport from '@src/views/ui-elements/cards/analytics/RevenueReport'
import OrdersBarChart from '@src/views/ui-elements/cards/statistics/OrdersBarChart'
import CardTransactions from '@src/views/ui-elements/cards/advance/CardTransactions'
import ProfitLineChart from '@src/views/ui-elements/cards/statistics/ProfitLineChart'
import CardBrowserStates from '@src/views/ui-elements/cards/advance/CardBrowserState'

// ** Styles
import '@styles/react/libs/charts/apex-charts.scss'
import '@styles/base/pages/dashboard-ecommerce.scss'

const EcommerceDashboard = () => {
  // ** Context
  const { colors } = useContext(ThemeColors)

  // ** vars
  const trackBgColor = '#e9ecef'

  return (
    <div id='dashboard-ecommerce'>
      <Row className='match-height'>
        <Col xl='12' md='12' xs='12'>
          <StatsCard cols={{ xl: '3', sm: '6' }} />
        </Col>
      </Row>
      <Row className='match-height'>
        <Col lg='12' md='12'>
          <Card className='card-statistics'>
            <CardHeader>
              <CardTitle tag='h4'>신규 입점 (총 11건)</CardTitle>
              <CardText className='card-text font-small-2 me-25 mb-0'>더보기</CardText>
            </CardHeader>
            <CardBody className='' style={{ padding: 0 }}>
              <NewJoinTable />
            </CardBody>
          </Card>
        </Col>
      </Row>
      <Row className='match-height'>
        <Col lg='12' md='12'>
          <Card className='card-statistics'>
            <CardHeader>
              <CardTitle tag='h4'>신규 클래스 검수요청 (총 11건)</CardTitle>
              <CardText className='card-text font-small-2 me-25 mb-0'>더보기</CardText>
            </CardHeader>
            <CardBody className='' style={{ padding: 0 }}>
              <NewClassTable />
            </CardBody>
          </Card>
        </Col>
      </Row>
      <Row className='match-height'>
        <Col lg='12' md='12'>
          <Card className='card-statistics'>
            <CardHeader>
              <CardTitle tag='h4'>신규 프로모션 신청 (총 11건)</CardTitle>
              <CardText className='card-text font-small-2 me-25 mb-0'>더보기</CardText>
            </CardHeader>
            <CardBody className='' style={{ padding: 0 }}>
              <NewPromotionTable />
            </CardBody>
          </Card>
        </Col>
      </Row>
      <Row className='match-height'>
        <Col lg='12' md='12'>
          <Card className='card-statistics'>
            <CardHeader>
              <CardTitle tag='h4'>신규 정산 요청 (총 11건)</CardTitle>
              <CardText className='card-text font-small-2 me-25 mb-0'>더보기</CardText>
            </CardHeader>
            <CardBody className='' style={{ padding: 0 }}>
              <NewSettlementTable />
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default EcommerceDashboard
