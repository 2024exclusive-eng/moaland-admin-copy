// ** React Imports
import { Fragment } from 'react'
import moment from 'moment/moment'
// ** Reactstrap Imports
import {
  Table,
  Card,
  CardHeader,
  CardTitle
} from 'reactstrap'

const DataTableWithButtons = ({data}) => {
  const handleRowClick = (id) => {
    window.location.href = `/harulink/manage/mission/${id}`
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
        <tr key={col.missionId} onClick={() => handleRowClick(col.missionId)}>
          <td>{col.missionId}</td>
          <td>{col.title}</td>
          <td>{col.social}</td>
          <td>{col.enrollCount}</td>
          <td>{col.maxEnroll}</td>
          <td>{moment(col.created).format("YY.MM.DD")}</td>
          <td>선정대기</td>
        </tr>
      )
    })
  }

  return (
    <Fragment>
      <Card>
        <CardHeader>
          <CardTitle tag='h4'>신청한 캠페인</CardTitle>
        </CardHeader>

        <div className='react-dataTable react-dataTable-selectable-rows'>
          <Table responsive>
            <thead>
              <tr>
                <th>미션ID</th>
                <th>미션명</th>
                <th>소셜종류</th>
                <th>참여자 수</th>
                <th>최대 참여자</th>
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
