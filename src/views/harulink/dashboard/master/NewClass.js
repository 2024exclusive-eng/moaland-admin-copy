// ** Custom Components
import Avatar from '@components/avatar'

// ** Reactstrap Imports
import { Table, Card } from 'reactstrap'

// ** Icons Imports
import { Monitor, Coffee, Watch, TrendingUp, TrendingDown } from 'react-feather'

const CompanyTable = () => {
  // ** vars

  const data = [
    {
      email: 'parkms@daum.net',
      class: '[러닝] 런린이를 위한 3km 달리기',
      location: '인천',
      start: '2024-07-21',
      end: '2024-07-29',
      price: '10000'
    },
    {
      email: 'kimcs@naver.com',
      class: '[요가] 아침 스트레칭 요가',
      location: '서울',
      start: '2024-08-01',
      end: '2024-08-10',
      price: '15000'
    },
    {
      email: 'lee.yh@gmail.com',
      class: '[요리] 홈메이드 파스타 만들기',
      location: '대구',
      start: '2024-08-15',
      end: '2024-08-22',
      price: '20000'
    },
    {
      email: 'choi.sj@gmail.com',
      class: '[댄스] 초보자를 위한 힙합 댄스',
      location: '광주',
      start: '2024-09-05',
      end: '2024-09-12',
      price: '12000'
    },
    {
      email: 'ohsh@naver.com',
      class: '[독서] 독서 토론 모임',
      location: '대전',
      start: '2024-09-20',
      end: '2024-09-27',
      price: '8000'
    },
    {
      email: 'shinjs@hanmail.net',
      class: '[사진] 초보자를 위한 스마트폰 사진 촬영',
      location: '울산',
      start: '2024-10-01',
      end: '2024-10-08',
      price: '5000'
    },
    {
      email: 'handm@gmail.com',
      class: '[헬스] 체력 기초 운동 클래스',
      location: '부산',
      start: '2024-10-15',
      end: '2024-10-22',
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
        <tr key={col.email}>
          <td>{col.email}</td>
          <td>{col.class}</td>
          <td>{col.start}</td>
          <td>{col.end}</td>
          <td>{col.price}원</td>
          <td>{col.location}</td>

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
            <th>클래스명</th>
            <th>시작인</th>
            <th>종료일</th>
            <th>가격</th>
            <th>지역</th>
          </tr>
        </thead>
        <tbody>{renderData()}</tbody>
      </Table>
    </Card>
  )
}

export default CompanyTable
