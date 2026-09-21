// ** React Imports
import { Fragment, useState } from 'react'
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
    alert('선정이 완료되었습니다.')
    window.location.reload()
  } catch (error) {
    console.error('Error fetching data:', error)
    return []
  }
}

const DataTableWithButtons = ({ data }) => {
  const [channel, setChannel] = useState('')
  const handleRowClick = (id) => {
    fetchData(id, 'select')
  }

  const renderData = () => {
    if (data.length === 0) {
      return (
        <tr>
          <td colSpan="9" className="text-center">데이터가 없습니다</td>
        </tr>
      )
    }

    return data.filter(col => !channel || col.channel === channel).map(col => {
      return (
        <tr key={col.missionEnrollId} >
          <td>{col.missionEnrollId}</td>
          <td>{col.name || `WeChat #${col.userId}`} {col.channel === 'wechat_mp' && <span className='badge bg-success'>WeChat</span>}</td>
          <td>{col.social}</td>
          <td>{col.address}</td>
          <td>{moment(col.created).format("YY.MM.DD")}</td>
          <td><Button onClick={() => handleRowClick(col.missionEnrollId)} color='primary'>선정</Button></td>
        </tr>
      )
    })
  }

  return (
    <Fragment>
      <Card><label className='m-2'>신청 경로 <select value={channel} onChange={e => setChannel(e.target.value)}><option value=''>전체</option><option value='web'>웹</option><option value='wechat_mp'>WeChat</option></select></label>
        <CardHeader>
          <CardTitle tag='h4'>선정대기</CardTitle>
        </CardHeader>

        <div className='react-dataTable react-dataTable-selectable-rows'>
          <Table responsive>
            <thead>
              <tr>
                <th>신청ID</th>
                <th>이름</th>
                <th>소셜주소</th>
                <th>배송지</th>
                <th>신청일</th>
                <th>선정</th>
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
