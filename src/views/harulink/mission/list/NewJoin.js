// ** Custom Components
import Avatar from '@components/avatar'

// ** Reactstrap Imports
import { Button, Table, Input, Card, CardHeader, CardText, Pagination, PaginationItem, PaginationLink } from 'reactstrap'

// ** Icons Imports
import { Monitor, Coffee, Watch, TrendingUp, TrendingDown } from 'react-feather'

// ** Avatar Image
import avatarImg from '@src/assets/images/portrait/small/avatar-s-20.jpg'

const CompanyTable = () => {
  // ** vars

  const data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

  const renderData = () => {
    return data.map(col => {
      return (
        <tr key={col.name}>
          <td>12</td>
          <td>뷰티</td>
          <td>
            <Avatar img={avatarImg} size='xl' />
          </td>
          <td>
            <div className='d-flex align-items-center'>
              <div>
                <div className='fw-bolder'>이니스프리</div>
                <div className='font-small-2 text-muted'>이니스프리 인플루언서 모집공고</div>
              </div>
            </div>
          </td>
          <td>선정대기</td>
          <td>21.08.01 ~ 21.08.10</td>
          <td>21.08.11</td>
          <td>21.08.12 ~ 21.08.15</td>
          <td>12/30</td>
          <td>21.08.01</td>
        </tr>
      )
    })
  }

  return (
    <Card className='card-company-table'>
      <CardHeader className='flex-md-row flex-column align-md-items-center align-items-start border-bottom'>
        <div className='d-flex mt-md-0 mt-1'>
          <Input className='me-1' type='text' placeholder='Search...' />
          <Input type='select' name='select' id='missionStatus'>
            <option value=''>미션 상태</option>
            <option value='completed'>신규</option>
            <option value='inProgress'>선정대기</option>
            <option value='notStarted'>완료대기</option>
            <option value='notStarted'>완료</option>
          </Input>
        </div>

        <div className='d-flex mt-md-0 mt-1'>
          <Button className='ms-2' color='primary' >
            <span className='align-middle '>검색</span>
          </Button>
        </div>
      </CardHeader>
      <Table responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>카테고리</th>
            <th>브랜드</th>
            <th>썸네일</th>
            <th>미션상태</th>
            <th>신청기간</th>
            <th>선정일자</th>
            <th>미션일자</th>
            <th>신청자수</th>
            <th>등록일</th>
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
