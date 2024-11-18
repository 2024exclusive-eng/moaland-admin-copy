// ** Custom Components
import Avatar from '@components/avatar'

// ** Reactstrap Imports
import { Table, Card, Badge } from 'reactstrap'

// ** Icons Imports
import { Monitor, Coffee, Watch, TrendingUp, TrendingDown } from 'react-feather'

const CompanyTable = () => {
  // ** vars
  const data = [
    {
      email: 'parkms@daum.net',
      num: '202400000CB',
      file: '24.08.11 - 09.01 출석부',
      operateTime: '19:00 - 20:30',
      reqDate: '2024-07-21',
      resDate: '2024-07-29',
      status: '대기',
      price: '10000'
    },
    {
      email: 'kimcs@naver.com',
      num: '202400001KL',
      file: '24.08.15 - 09.05 출석부',
      operateTime: '08:00 - 09:00',
      reqDate: '2024-08-01',
      resDate: '2024-08-08',
      status: '승인',
      price: '15000'
    },
    {
      email: 'lee.yh@gmail.com',
      num: '202400002YM',
      file: '24.09.01 - 09.20 출석부',
      operateTime: '10:00 - 11:30',
      reqDate: '2024-08-10',
      resDate: '2024-08-20',
      status: '반려',
      price: '20000'
    },
    {
      email: 'choi.sj@gmail.com',
      num: '202400003SD',
      file: '24.09.11 - 10.01 출석부',
      operateTime: '14:00 - 15:30',
      reqDate: '2024-09-01',
      resDate: '2024-09-10',
      status: '승인',
      price: '12000'
    },
    {
      email: 'ohsh@naver.com',
      num: '202400004KR',
      file: '24.09.21 - 10.10 출석부',
      operateTime: '18:30 - 20:00',
      reqDate: '2024-09-15',
      resDate: '2024-09-25',
      status: '대기',
      price: '8000'
    },
    {
      email: 'shinjs@hanmail.net',
      num: '202400005JK',
      file: '24.10.01 - 10.20 출석부',
      operateTime: '16:00 - 17:30',
      reqDate: '2024-09-25',
      resDate: '2024-10-05',
      status: '승인',
      price: '5000'
    },
    {
      email: 'handm@gmail.com',
      num: '202400006MG',
      file: '24.10.11 - 10.30 출석부',
      operateTime: '09:00 - 10:30',
      reqDate: '2024-10-10',
      resDate: '2024-10-20',
      status: '반려',
      price: '13000'
    }
  ]
  const colorsArr = {
    Technology: 'light-primary',
    Grocery: 'light-success',
    Fashion: 'light-warning'
  }

  const renderData = () => {
    return data.map(col => {
      const IconTag = col.salesUp ? (
        <TrendingUp size={15} className='text-success' />
      ) : (
        <TrendingDown size={15} className='text-danger' />
      )

      return (
        <tr key={col.num}>
          <td>{col.email}</td>
          <td>{col.num}</td>
          <td>{col.file}</td>
          <td>{col.operateTime}</td>
          <td>{col.reqDate}</td>
          <td>{col.price}</td>
          <td>
            <Badge color='light-warning'>요청</Badge>
          </td>
          <td>{col.resDate}</td>
        </tr>
      )
    })
  }

  return (
    <Card className='card-company-table'>
      <Table responsive>
        <thead>
          <tr>
            <th>아이디</th>
            <th>요청번호</th>
            <th>파일명</th>
            <th>운영시간</th>
            <th>요청일자</th>
            <th>정산금액</th>
            <th>처리상태</th>
            <th>처리일자</th>

          </tr>
        </thead>
        <tbody>{renderData()}</tbody>
      </Table>
    </Card>
  )
}

export default CompanyTable
