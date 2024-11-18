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
      code: 'P00000CB',
      email: 'parkms@daum.net',
      class: '[러닝] 런린이를 위한 3km 달리기',
      promotion: '블로그 체험단 신청',
      reqDate: '2024-07-21',
      resDate: '2024-07-29',
      status: '대기'
    },
    {
      code: 'P00001KL',
      email: 'kimcs@naver.com',
      class: '[요가] 아침 스트레칭 요가',
      promotion: 'SNS 이벤트',
      reqDate: '2024-08-01',
      resDate: '2024-08-05',
      status: '승인'
    },
    {
      code: 'P00002YM',
      email: 'lee.yh@gmail.com',
      class: '[요리] 홈메이드 파스타 만들기',
      promotion: '지인 추천',
      reqDate: '2024-08-10',
      resDate: '2024-08-15',
      status: '반려'
    },
    {
      code: 'P00003SD',
      email: 'choi.sj@gmail.com',
      class: '[댄스] 초보자를 위한 힙합 댄스',
      promotion: '블로그 체험단 신청',
      reqDate: '2024-09-01',
      resDate: '2024-09-05',
      status: '승인'
    },
    {
      code: 'P00004KR',
      email: 'ohsh@naver.com',
      class: '[독서] 독서 토론 모임',
      promotion: '온라인 광고',
      reqDate: '2024-09-15',
      resDate: '2024-09-20',
      status: '대기'
    },
    {
      code: 'P00005JK',
      email: 'shinjs@hanmail.net',
      class: '[사진] 초보자를 위한 스마트폰 사진 촬영',
      promotion: 'SNS 이벤트',
      reqDate: '2024-09-25',
      resDate: '2024-09-30',
      status: '승인'
    },
    {
      code: 'P00006MG',
      email: 'handm@gmail.com',
      class: '[헬스] 체력 기초 운동 클래스',
      promotion: '지인 추천',
      reqDate: '2024-10-10',
      resDate: '2024-10-15',
      status: '반려'
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
        <tr key={col.code}>
          <td>{col.code}</td>
          <td>{col.email}</td>
          <td>{col.class}</td>
          <td>{col.promotion}</td>
          <td>{col.reqDate}</td>
          <td>
            <Badge color='light-secondary'>대기</Badge>
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
            <th>상품코드</th>
            <th>아이디</th>
            <th>클래스명</th>
            <th>신청 프로모션</th>
            <th>요청일자</th>
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
