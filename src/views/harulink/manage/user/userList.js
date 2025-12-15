// ** React Imports
import { Fragment, useState, useEffect } from 'react'

// ** Reactstrap Imports
import { Table, Card, Input, Button, Pagination, PaginationItem, PaginationLink, CardHeader } from 'reactstrap'

import axios from 'axios'

const fetchData = async (page, item, search) => {
  try {
    const response = await axios.get('/admin/manage/user', {
      params: {
        page,
        item,
        search
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
  const [search, setSearch] = useState('')

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
    window.location.href = `/harulink/manage/user/${id}`
  }

  const renderData = () => {
    return data.data?.map(col => {
      return (
        <tr key={col.id} onClick={() => handleRowClick(col.id)}>
          <td>{col.id}</td>
          <td>{col.email}</td>
          <td>harulink.com/{col.link}</td>
          <td>{col.oauthType ? '라인사용자' : '일반사용자'}</td>
          <td>{col.account}</td>
          <td>{col.depositor}</td>
        </tr>
      )
    })
  }

  // ** Function to handle search
  const handleSearchChange = (e) => {
    setSearch(e.target.value)
  }
  const handleSearch = async () => {
    const result = await fetchData(currentPage, 30, search)
    setData(result)
  }

  return (
    <Fragment>
      <Card>
        <CardHeader className='flex-md-row flex-column align-md-items-center align-items-start border-bottom'>
          <div className='d-flex mt-md-0 mt-1'>
            <Input type='text' placeholder='Search...' value={search} onChange={handleSearchChange} />
          </div>
          <div className='d-flex mt-md-0 mt-1'>
            <Button className='ms-2' color='primary' onClick={handleSearch}>
              <span className='align-middle '>검색</span>
            </Button>
          </div>
        </CardHeader>

        <div className='react-dataTable react-dataTable-selectable-rows'>
          <Table responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Email</th>
                <th>Link</th>
                <th>Oauth Type</th>
                <th>Account</th>
                <th>Depositor</th>
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
