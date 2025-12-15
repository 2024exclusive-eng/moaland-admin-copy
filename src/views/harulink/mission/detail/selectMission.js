// ** React Imports
import { Fragment } from 'react'
import moment from 'moment/moment'
// ** Reactstrap Imports
import {
  Table,
  Card,
  CardHeader,
  CardTitle,
  Button
} from 'reactstrap'
import axios from 'axios'

const fetchData = async (enrollId, type) => {
  try {
    await axios.post(`/admin/mission/status/${enrollId}/${type}`)
    alert('완료처리 되었습니다.')
    window.location.reload()
  } catch (error) {
    console.error('Error fetching data:', error)
    return []
  }
}

const DataTableWithButtons = ({ data }) => {
  const handleRowClick = (id) => {
    fetchData(id, 'complete')
  }

  const renderData = () => {
    if (data.length === 0) {
      return (
        <tr>
          <td colSpan="9" className="text-center">데이터가 없습니다</td>
        </tr>
      )
    }

    return data.map(col => {
      return (
        <tr key={col.missionEnrollId} onClick={() => handleRowClick(col.missionEnrollId)}>
          <td>{col.missionEnrollId}</td>
          <td>{col.name}</td>
          <td>{col.social}</td>
          <td>{col.address}</td>
          <td>{col.link}</td>
          <td>{col.linkUpdated ? moment(col.linkUpdated).format("YY.MM.DD") : ""}</td>
          <td>{moment(col.created).format("YY.MM.DD")}</td>
          <td><Button color='primary'>완료</Button></td>
        </tr>
      )
    })
  }

  return (
    <Fragment>
      <Card>
        <CardHeader>
          <CardTitle tag='h4'>완료대기</CardTitle>
        </CardHeader>

        <div className='react-dataTable react-dataTable-selectable-rows'>
          <Table responsive>
            <thead>
              <tr>
                <th>신청ID</th>
                <th>이름</th>
                <th>소셜주소</th>
                <th>배송지</th>
                <th>링크</th>
                <th>링크수정일</th>
                <th>신청일</th>
                <th>완료처리</th>
              </tr>
            </thead>
            <tbody>{renderData()}</tbody>
          </Table>
        </div>
      </Card>
    </Fragment>
  )
}

export default DataTableWithButtons
