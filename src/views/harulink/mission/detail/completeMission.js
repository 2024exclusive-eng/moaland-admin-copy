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

const DataTableWithButtons = ({ data }) => {
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
        <tr key={col.missionEnrollId}>
          <td>{col.missionEnrollId}</td>
          <td>{col.name}</td>
          <td>{col.social}</td>
          <td>{col.address}</td>
          <td>{col.link}</td>
          <td>{col.linkUpdated ? moment(col.linkUpdated).format("YY.MM.DD") : ""}</td>
          <td>{moment(col.created).format("YY.MM.DD")}</td>
          <td>완료</td>
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
                <th>상태</th>
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
