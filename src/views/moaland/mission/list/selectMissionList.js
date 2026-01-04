// ** Custom Components
import Avatar from '@components/avatar'

// ** Reactstrap Imports
import { Button, Table, Input, Card, CardHeader, CardText, Pagination, PaginationItem, PaginationLink } from 'reactstrap'

import moment from 'moment/moment'
import axios from 'axios'
import { useEffect, useState } from 'react'

const fetchData = async (page, item, type) => {
  try {
    const response = await axios.get('/admin/mission', {
      params: {
        page,
        item,
        type
      }
    })
    return response
  } catch (error) {
    console.error('Error fetching data:', error)
    return []
  }
}

const categoryMap = {
  beauty: '뷰티',
  fashion: '패션',
  food: '음식',
  lifestyle: '라이프스타일',
  kids: '키즈',
  digital: '디지털',
  books: '도서',
  pets: '반려동물',
  sports: '스포츠',
  etc: '기타'
}

const CompanyTable = () => {
  // ** vars
  const [data, setData] = useState([0])
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    const fetchInitialData = async () => {
      const result = await fetchData(currentPage, 30, 'select')
      console.log(result.missions)
      setData(result.missions)
    }
    fetchInitialData()
  }, [currentPage])

  const handlePagination = page => {
    setCurrentPage(page.selected)
  }

  const renderData = () => {
    if ((data?.data ?? []).length === 0) {
      return (
        <tr>
          <td colSpan="9" className="text-center">데이터가 없습니다</td>
        </tr>
      )
    }
    return (data?.data ?? []).map(col => {
      return (
        <tr key={col.missionId} onClick={() => { window.location.href = `/moaland/manage/mission/${col.missionId}` }}>
          <td>{col.missionId}</td>
          <td>{categoryMap[col.category] || col.category}</td>
          <td>
            <Avatar img={col.thumbnailImg} size='xl' />
          </td>
          <td>
            <div className='d-flex align-items-center'>
              <div>
                <div className='fw-bolder'>{col.brand}</div>
                <div className='font-small-2 text-muted'>{col.title}</div>
              </div>
            </div>
          </td>
          <td>선정대기</td>
          <td>{moment(col.enrollStartDate).format("YY.MM.DD")} ~ {moment(col.enrollEndDate).format("YY.MM.DD")}</td>
          <td>{moment(col.selectDate).format("YY.MM.DD")}</td>
          <td>{moment(col.missionStartDate).format("YY.MM.DD")} ~ {moment(col.missionEndDate).format("YY.MM.DD")}</td>
          <td>{col.enrollCount}/{col.maxEnroll}</td>
          <td>{moment(col.created).format("YY.MM.DD")}</td>
        </tr>
      )
    })
  }

  return (
    <Card className='card-company-table'>

      <Table responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>카테고리</th>
            <th>썸네일</th>
            <th>브랜드</th>
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
        {Array.from({ length: data?.paging?.totalPages }, (_, i) => (
          <PaginationItem key={i} active={i + 1 === currentPage}>
            <PaginationLink href='#' onClick={e => { e.preventDefault(); handlePagination({ selected: i + 1 }) }}>
              {i + 1}
            </PaginationLink>
          </PaginationItem>
        ))}
      </Pagination>
    </Card>
  )
}

export default CompanyTable
