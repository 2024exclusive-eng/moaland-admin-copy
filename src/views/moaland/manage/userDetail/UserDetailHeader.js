// ** React Imports
import { Fragment } from 'react'

// ** Styles
import './UserDetailHeader.scss'

const UserDetailHeader = () => {
  return (
    <Fragment>
      <div className='user-detail-header'>
        <h1 className='page-title'>회원 상세</h1>
        <p className='page-subtitle'>사용자 정보를 수정할 수 있습니다.</p>
      </div>
    </Fragment>
  )
}

export default UserDetailHeader
