// ** React Imports
import { Fragment, useState, useEffect } from 'react'

// ** Reactstrap Imports
import { Row, Col } from 'reactstrap'

import axios from 'axios'
import { useParams } from 'react-router-dom'

// ** Custom Components
import UserDetailHeader from './UserDetailHeader'
import UserInfo from './userInfo'
import CampaignDetails from './CampaignDetails'

const fetchData = async (id) => {
  try {
    const response = await axios.get(`/admin/manage/user/${id}`)
    return response
  } catch (error) {
    console.error('Error fetching data:', error)
    return []
  }
}

const UserDetail = () => {
  const { id } = useParams()
  const [data, setData] = useState()

  useEffect(() => {
    const fetchInitialData = async () => {
      const result = await fetchData(id)
      console.log(result)
      setData(result)
    }
    fetchInitialData()
  }, [id])

  return (
    <Fragment>
      <UserDetailHeader />
      <Row>
        <Col md='12' sm='12'>
          <UserInfo data={data?.user ? data.user : {}}/>
        </Col>
        <Col md='12' sm='12'>
          <CampaignDetails
            enrollData={data?.enrollMission?.data ? data?.enrollMission?.data : []}
            selectData={data?.selectMission?.data ? data?.selectMission?.data : []}
            completeData={data?.completeMission?.data ? data?.completeMission?.data : []}
            endedData={data?.endedMission?.data ? data?.endedMission?.data : []}
            userData={data?.user}
          />
        </Col>
      </Row>
    </Fragment>
  )
}

export default UserDetail
