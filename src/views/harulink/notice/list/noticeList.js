

// ** React Imports
import { Fragment, useState, useEffect } from 'react'

// ** Reactstrap Imports
import { Table, Card, Button, Pagination, PaginationItem, PaginationLink, CardHeader } from 'reactstrap'

import axios from 'axios'
import moment from 'moment'

const fetchData = async (page, item) => {
  try {
    const response = await axios.get('/admin/notice', {
      params: {
        page,
        item
      }
    })
    return response.data
  } catch (error) {
    console.error('Error fetching data:', error)
    return []
  }
}

const DataTableWithButtons = () => {
  // ** States
  const [data, setData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)

  // ** Get data on mount
  useEffect(() => {
    const fetchInitialData = async () => {
      const result = await fetchData(currentPage, 30, '')
      setData(result)
    }
    fetchInitialData()
  }, [currentPage])

  const handlePagination = page => {
    setCurrentPage(page.selected)
  }

  const handleRowClick = (id) => {
    window.location.href = `/harulink/manage/notice/${id}`
  }

  const renderData = () => {
    return data.data?.map(col => {
      return (
        <tr key={col.id} onClick={() => handleRowClick(col.id)}>
          <td>{col.id}</td>
          <td>{col.title}</td>
          <td style={{ textAlign: 'right' }}>{moment(col.created).format("YY.MM.DD")}</td>
        </tr>
      )
    })
  }

  return (
    <Fragment>
      <Card>
        <CardHeader className='flex-md-row flex-column align-md-items-center align-items-start border-bottom'>
          <div className='d-flex mt-md-0 mt-1 ms-auto'>
            <Button onClick={() => { window.location.href = '/harulink/manage/notice/new' }} className='ms-2' color='primary'>
              <span className='align-middle '>생성하기</span>
            </Button>
          </div>
        </CardHeader>
        <div className='react-dataTable react-dataTable-selectable-rows'>
          <Table responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>제목</th>
                <th style={{ textAlign: 'right' }}>작성일</th>
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
        </div>
      </Card>
    </Fragment>
  )
}

export default DataTableWithButtons
