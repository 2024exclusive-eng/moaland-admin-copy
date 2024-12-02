// ** React Imports
import { Fragment, useState, useEffect } from 'react'

// ** Reactstrap Imports
import { Row, Col } from 'reactstrap'

import axios from 'axios'
import { useParams } from 'react-router-dom'

// ** Custom Components
import Breadcrumbs from '@components/breadcrumbs'

// ** Demo Components
import MissionInfo from './missionInfo'

// ** Demo Components
import EnrollMission from './enrollMission'
import SelectMission from './selectMission'
import CompleteMission from './completeMission'

const fetchData = async (id) => {
  try {
    const response = await axios.get(`/admin/mission/${id}`)
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
      console.log("0000", result)
      setData(result)
    }
    fetchInitialData()
  }, [])
  
  return (
    <Fragment>
      <Breadcrumbs title='미션관리' data={[{ title: '관리' }, { title: '미션관리' }]} />
      <Row>
        <Col md='12' sm='12'>
          <MissionInfo missionData={data?.mission ? data.mission : {}} />
        </Col>
        <Col md='12' sm='12'>
          <EnrollMission data={data?.enrollUsers ? data?.enrollUsers : []} />
        </Col>
        <Col md='12' sm='12'>
          <SelectMission data={data?.selectUsers ? data?.selectUsers : []} />
        </Col>
        <Col md='12' sm='12'>
          <CompleteMission data={data?.completeUsers ? data?.completeUsers : []} />
        </Col>
      </Row>
    </Fragment>
  )
}
export default FormLayouts