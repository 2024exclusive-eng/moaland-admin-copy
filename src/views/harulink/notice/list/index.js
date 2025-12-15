// ** React Imports
import { Fragment } from 'react'

// ** Custom Components
import Breadcrumbs from '@components/breadcrumbs'

// ** Third Party Components
import { Row, Col } from 'reactstrap'

// ** Demo Components
import NoticeList from './noticeList'

// ** Styles
import '@styles/react/libs/tables/react-dataTable-component.scss'

const Tables = () => {
  return (
    <Fragment>
      <Breadcrumbs title='공지사항 관리' data={[{ title: '관리' }, { title: '공지사항 관리' }]} />
      <Row>
        <Col sm='12'>
          <NoticeList />
        </Col>
      </Row>
    </Fragment>
  )
}

export default Tables