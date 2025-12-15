// ** React Imports
import { Fragment, useState, useEffect } from 'react'

// ** Reactstrap Imports
import { Row, Col } from 'reactstrap'

import axios from 'axios'
import { useParams } from 'react-router-dom'

// ** Custom Components
import Breadcrumbs from '@components/breadcrumbs'

// ** Demo Components
import UserInfo from './userInfo'

// ** Demo Components
import EnrollMission from './enrollMission'
import SelectMission from './selectMission'
import CompleteMission from './completeMission'

const fetchData = async (id) => {
  try {
    const response = await axios.get(`/admin/manage/user/${id}`)
    return response
  } catch (error) {
    console.error('Error fetching data:', error)
    return []
  }
}

const FormLayouts = () => {
  const { id } = useParams()
  const [data, setData] = useState()

  useEffect(() => {
    const fetchInitialData = async () => {
      const result = await fetchData(id)
      console.log(result)
      setData(result)
    }
    fetchInitialData()
  }, [])

  return (
    <Fragment>
      <Breadcrumbs title='회원관리' data={[{ title: '관리' }, { title: '회원관리' }]} />
      <Row>
        <Col md='12' sm='12'>
          <UserInfo data={data?.user ? data.user : {}}/>
        </Col>
        <Col md='12' sm='12'>
          <EnrollMission data={data?.enrollMission?.data ? data?.enrollMission?.data : []}/>
        </Col>
        <Col md='12' sm='12'>
          <SelectMission data={data?.selectMission?.data ? data?.selectMission?.data : []}/>
        </Col>
        <Col md='12' sm='12'>
          <CompleteMission data={data?.completeMission?.data ? data?.completeMission?.data : []}/>
        </Col>
      </Row>
    </Fragment>
  )
}
export default FormLayouts
