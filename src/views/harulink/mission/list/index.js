
// ** Reactstrap Imports
import { Row, Col, Card, CardHeader, CardTitle, CardBody, CardText } from 'reactstrap'

// ** Demo Components
import NewJoinTable from './NewJoin'

import StatsCard from './statsCard'

// ** Custom Components
import Breadcrumbs from '@components/breadcrumbs'

// ** Styles
import '@styles/react/libs/charts/apex-charts.scss'
import '@styles/base/pages/dashboard-ecommerce.scss'

const EcommerceDashboard = () => {

  return (
    <div id='dashboard-ecommerce'>
      <Breadcrumbs title='미션관리' data={[{ title: '관리' }, { title: '미션관리' }]} />

      <Row className='match-height'>
        <Col xl='12' md='12' xs='12'>
          <StatsCard cols={{ xl: '3', sm: '6' }} />
        </Col>
      </Row>
      <Row className='match-height'>
        <Col lg='12' md='12'>
          <Card className='card-statistics'>
            <CardHeader>
              <CardTitle tag='h4'>미션 관리</CardTitle>
            </CardHeader>
            <CardBody className='' style={{ padding: 0 }}>
              <NewJoinTable />
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default EcommerceDashboard
