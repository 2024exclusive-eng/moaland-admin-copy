// ** React Imports
import { Fragment } from 'react'

// ** Custom Components
import Breadcrumbs from '@components/breadcrumbs'

// ** Third Party Components
import { Row, Col } from 'reactstrap'

// ** Demo Components
import UserHeader from './UserHeader'
import UsetList from './userList'

// ** Styles
import '@styles/react/libs/tables/react-dataTable-component.scss'

const Tables = () => {
  // ** Stats data - you can replace this with data from API
  const stats = {
    totalMembers: 8923,
    newMembers: 923,
    withdrawnMembers: 23
  }

  return (
    <Fragment>
      {/* <Breadcrumbs title='회원관리' data={[{ title: '관리' }, { title: '회원관리' }]} /> */}

      {/* Page Header with Title and Stats */}
      <UserHeader stats={stats} />

      {/* User List Table */}
      <Row>
        <Col sm='12'>
          <UsetList />
        </Col>
      </Row>
    </Fragment>
  )
}

export default Tables
