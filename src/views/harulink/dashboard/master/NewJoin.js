// ** Custom Components
import Avatar from '@components/avatar'

// ** Reactstrap Imports
import { Table, Card, Pagination, PaginationItem, PaginationLink } from 'reactstrap'

// ** Icons Imports
import { Monitor, Coffee, Watch, TrendingUp, TrendingDown } from 'react-feather'

const CompanyTable = () => {
  // ** vars

  const data = [
    {
      registerDate: '2024-10-21',
      name: '홍길동',
      email: 'meguc@ruj.io',
      phone: '010-1234-1234',
      location: '서울',
      type: '리더',
      category: '운동',
      join: '지인추천',
      class: 0
    },
    {
      registerDate: '2024-10-22',
      name: '김철수',
      email: 'kimcs@naver.com',
      phone: '010-5678-1234',
      location: '부산',
      type: '회원',
      category: '음악',
      join: '온라인광고',
      class: 1
    },
    {
      registerDate: '2024-10-23',
      name: '이영희',
      email: 'lee.yh@gmail.com',
      phone: '010-4321-8765',
      location: '대구',
      type: '리더',
      category: '미술',
      join: 'SNS',
      class: 2
    },
    {
      registerDate: '2024-10-24',
      name: '박민수',
      email: 'parkms@daum.net',
      phone: '010-1111-2222',
      location: '인천',
      type: '회원',
      category: '요리',
      join: '지인추천',
      class: 0
    },
    {
      registerDate: '2024-10-29',
      name: '정유진',
      email: 'jungyj@outlook.com',
      phone: '010-2222-3333',
      location: '서울',
      type: '리더',
      category: '영화',
      join: '블로그',
      class: 2
    },
    {
      registerDate: '2024-10-30',
      name: '권지훈',
      email: 'kwon.jh@yahoo.com',
      phone: '010-4444-5555',
      location: '제주',
      type: '회원',
      category: '패션',
      join: 'SNS',
      class: 1
    }
  ]

  const renderData = () => {
    return data.map(col => {
      const IconTag = col.salesUp ? (
        <TrendingUp size={15} className='text-success' />
      ) : (
        <TrendingDown size={15} className='text-danger' />
      )

      return (
        <tr key={col.name}>
          <td>{col.registerDate}</td>
          <td>
            <div className='d-flex align-items-center'>
              <div>
                <div className='fw-bolder'>{col.name}</div>
                <div className='font-small-2 text-muted'>{col.email}</div>
              </div>
            </div>
          </td>
          <td>{col.phone}</td>
          <td>{col.location}</td>
          <td>{col.type}</td>
          <td>{col.category}</td>
          <td>{col.join}</td>
          <td>{col.class}건</td>

        </tr>
      )
    })
  }

  return (
    <Card className='card-company-table'>
      <Table responsive>
        <thead>
          <tr>
            <th>등록일</th>
            <th>이름</th>
            <th>연락처</th>
            <th>지역</th>
            <th>구분</th>
            <th>카테고리</th>
            <th>가입경로</th>
            <th>등록된 클래스</th>
          </tr>
        </thead>
        <tbody>{renderData()}</tbody>
      </Table>
      <Pagination className='d-flex justify-content-center mt-2'>
        <PaginationItem>
          <PaginationLink href='#' onClick={e => e.preventDefault()}>
            1
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href='#' onClick={e => e.preventDefault()}>
            2
          </PaginationLink>
        </PaginationItem>
        <PaginationItem active>
          <PaginationLink href='#' onClick={e => e.preventDefault()}>
            3
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href='#' onClick={e => e.preventDefault()}>
            4
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href='#' onClick={e => e.preventDefault()}>
            5
          </PaginationLink>
        </PaginationItem>
      </Pagination>
    </Card>
  )
}

export default CompanyTable
