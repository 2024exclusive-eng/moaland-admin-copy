// ** React Imports
import { Fragment } from 'react'

// ** Custom Components
import Breadcrumbs from '@components/breadcrumbs'

// ** Third Party Components
import { Row, Col } from 'reactstrap'

// ** Demo Components
import UsetList from './userList'

// ** Styles
import '@styles/react/libs/tables/react-dataTable-component.scss'

const Tables = () => {
  return (
    <Fragment>
      <Breadcrumbs title='회원관리' data={[{ title: '관리' }, { title: '회원관리' }]} />
      <Row>
        <Col sm='12'>
          <UsetList />
        </Col>
      </Row>
    </Fragment>
  )
}

export default Tables
