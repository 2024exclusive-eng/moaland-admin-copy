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


// const fetchData = async (id) => {
//   try {
//     const response = await axios.get(`/admin/manage/user/${id}`)
//     return response
//   } catch (error) {
//     console.error('Error fetching data:', error)
//     return []
//   }
// }

const FormLayouts = () => {
  const { id } = useParams()
  const [data, setData] = useState()

  // useEffect(() => {
  //   const fetchInitialData = async () => {
  //     const result = await fetchData(id)
  //     console.log(result)
  //     setData(result)
  //   }
  //   fetchInitialData()
  // }, [])

  return (
    <Fragment>
      <Breadcrumbs title='미션관리' data={[{ title: '관리' }, { title: '미션관리' }]} />
      <Row>
        <Col md='12' sm='12'>
          <MissionInfo data={data?.user ? data.user : {}} />
        </Col>

      </Row>
    </Fragment>
  )
}
export default FormLayouts
