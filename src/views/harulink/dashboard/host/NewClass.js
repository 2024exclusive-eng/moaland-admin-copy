// ** Custom Components
import Avatar from '@components/avatar'

// ** Reactstrap Imports
import { Table, Card, Pagination, PaginationItem, PaginationLink, Badge } from 'reactstrap'

// ** Icons Imports
import { Monitor, Coffee, Watch, TrendingUp, TrendingDown } from 'react-feather'

const CompanyTable = () => {
  // ** vars

  const data = [
    {
      num: 1,
      title: '[매뉴얼] 프로그램 등록 A to Z ! 멋진 상세페이지 이렇게 제작해보세요!',
      date: '2024-07-21'
    },
    {
      num: 1,
      title: '[매뉴얼] 프로그램 등록 A to Z ! 멋진 상세페이지 이렇게 제작해보세요!',
      date: '2024-07-21'
    },
    {
      num: 1,
      title: '[매뉴얼] 프로그램 등록 A to Z ! 멋진 상세페이지 이렇게 제작해보세요!',
      date: '2024-07-21'
    },
    {
      num: 1,
      title: '[매뉴얼] 프로그램 등록 A to Z ! 멋진 상세페이지 이렇게 제작해보세요!',
      date: '2024-07-21'
    },
    {
      num: 1,
      title: '[매뉴얼] 프로그램 등록 A to Z ! 멋진 상세페이지 이렇게 제작해보세요!',
      date: '2024-07-21'
    },
    {
      num: 1,
      title: '[매뉴얼] 프로그램 등록 A to Z ! 멋진 상세페이지 이렇게 제작해보세요!',
      date: '2024-07-21'
    },
    {
      num: 1,
      title: '[매뉴얼] 프로그램 등록 A to Z ! 멋진 상세페이지 이렇게 제작해보세요!',
      date: '2024-07-21'
    },
    {
      num: 1,
      title: '[매뉴얼] 프로그램 등록 A to Z ! 멋진 상세페이지 이렇게 제작해보세요!',
      date: '2024-07-21'
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
          <td><Badge color='light-danger'>중요</Badge> {col.title}</td>
          <td>{col.date}</td>

        </tr>
      )
    })
  }

  return (
    <Card className='card-company-table'>
      <Table responsive>

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
