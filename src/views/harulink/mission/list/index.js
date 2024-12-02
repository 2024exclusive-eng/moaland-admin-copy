
// ** Reactstrap Imports
import { Row, Col, Card, CardHeader, CardTitle, CardBody, Button } from 'reactstrap'

// ** Demo Components
import NewMissionList from './newMissionList'
import SelectMissionList from './selectMissionList'
import SelectedMissionList from './selectedMissionList'
import CompleteMissionList from './completeMissionList'

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
              <CardTitle tag='h4'>신규 미션</CardTitle>
              <div className='d-flex mt-md-0 mt-1'>
                <Button className='ms-2' color='primary' onClick={() => { window.location.href = '/harulink/manage/mission/modify/new' }} >
                  <span className='align-middle '>생성</span>
                </Button>
              </div>
            </CardHeader>
            <CardBody className='' style={{ padding: 0 }}>
              <NewMissionList />
            </CardBody>
          </Card>
        </Col>
        <Col lg='12' md='12'>
          <Card className='card-statistics'>
            <CardHeader>
              <CardTitle tag='h4'>선정대기 미션</CardTitle>
            </CardHeader>
            <CardBody className='' style={{ padding: 0 }}>
              <SelectMissionList />
            </CardBody>
          </Card>
        </Col>
        <Col lg='12' md='12'>
          <Card className='card-statistics'>
            <CardHeader>
              <CardTitle tag='h4'>완료대기 미션</CardTitle>

            </CardHeader>
            <CardBody className='' style={{ padding: 0 }}>
              <SelectedMissionList />
            </CardBody>
          </Card>
        </Col>
        <Col lg='12' md='12'>
          <Card className='card-statistics'>
            <CardHeader>
              <CardTitle tag='h4'>완료 미션</CardTitle>

            </CardHeader>
            <CardBody className='' style={{ padding: 0 }}>
              <CompleteMissionList />
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default EcommerceDashboard
