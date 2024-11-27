// ** React Imports
import { Fragment } from 'react'

// ** Reactstrap Imports
import { Row, Col } from 'reactstrap'

// ** Custom Components
import Breadcrumbs from '@components/breadcrumbs'
import NoticeDetail from './noticeDetail'

const FormLayouts = () => {

  return (
    <Fragment>
      <Breadcrumbs title='공지사항 관리' data={[{ title: '관리' }, { title: '공지사항 관리' }]} />
      <Row>
        <Col md='12' sm='12'>
          <NoticeDetail />
        </Col>
      </Row>
    </Fragment>
  )
}
export default FormLayouts
