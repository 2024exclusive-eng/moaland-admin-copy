/* eslint-disable multiline-ternary */
// ** React Imports
import { Fragment, useState, useEffect } from 'react'

// ** Reactstrap Imports
import {
  Table,
  Card,
  Button,
  Input,
  Row,
  Col
} from 'reactstrap'

import axios from 'axios'
import moment from 'moment'

// ** Icons
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight
} from 'react-feather'

// ** Styles
import './NoticeList.scss'

const fetchData = async (page, item, search) => {
  try {
    const params = {
      page,
      item
    }

    if (search) {
      params.search = search
    }

    const response = await axios.get('/admin/notice', { params })
    return response.data
  } catch (error) {
    console.error('Error fetching data:', error)
    return { data: [], paging: { totalPages: 1, currentPage: 1 } }
  }
}

const DataTableWithButtons = () => {
  const [data, setData] = useState({ data: [], paging: {} })
  const [currentPage, setCurrentPage] = useState(1)
  const [search, setSearch] = useState('')
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [targetPage, setTargetPage] = useState('')

  useEffect(() => {
    const fetchInitialData = async () => {
      const result = await fetchData(currentPage, itemsPerPage, search)
      setData(result || { data: [], paging: {} })
    }
    fetchInitialData()
  }, [currentPage, itemsPerPage])

  useEffect(() => {
    const debounceTimer = setTimeout(async () => {
      const result = await fetchData(currentPage, itemsPerPage, search)
      setData(result || { data: [], paging: {} })
    }, 500)

    return () => clearTimeout(debounceTimer)
  }, [search])

  const handlePagination = (page) => {
    setCurrentPage(page)
  }

  const handleRowClick = (id) => {
    window.location.href = `/harulink/manage/notice/${id}`
  }

  const handleMovePage = () => {
    const pageNum = parseInt(targetPage)
    if (pageNum && pageNum > 0 && pageNum <= (data?.paging?.totalPages || 1)) {
      setCurrentPage(pageNum)
      setTargetPage('')
    }
  }

  const handleSearchChange = (e) => {
    setSearch(e.target.value)
  }

  const renderData = () => {
    if (!data.data || data.data.length === 0) {
      return (
        <tr>
          <td colSpan="3" className="text-center" style={{ padding: '40px' }}>
            데이터가 없습니다
          </td>
        </tr>
      )
    }

    return data.data.map(col => {
      return (
        <tr key={col.id} onClick={() => handleRowClick(col.id)}>
          <td>{col.id}</td>
          <td>{col.title}</td>
          <td>{moment(col.created).format("DD.MM.YY")}</td>
        </tr>
      )
    })
  }

  const totalPages = data?.paging?.totalPages || 1

  return (
    <Fragment>
      <Card className="notice-list-card">
        <div style={{ padding: '32px' }}>
          {/* Header Row */}
          <Row style={{ marginBottom: '20px' }}>
            <Col md="12" className="d-flex justify-content-end">
              <Button
                color="primary"
                style={{ height: '48px', fontSize: '16px', minWidth: '120px' }}
                onClick={() => { window.location.href = '/harulink/manage/notice/new' }}
              >
                공지사항 등록
              </Button>
            </Col>
          </Row>

          {/* Search Input */}
          <div style={{ marginBottom: '20px' }}>
            <Input
              type="text"
              placeholder="검색어를 입력하세요."
              style={{ fontSize: '16px', height: '48px' }}
              value={search}
              onChange={handleSearchChange}
            />
          </div>

          {/* Table */}
          <div className="table-wrapper" style={{ marginBottom: '12px' }}>
            <Table className="notice-table" responsive>
              <thead>
                <tr>
                  <th style={{ width: '80px' }}>ID</th>
                  <th>제목</th>
                  <th style={{ width: '120px' }}>작성일</th>
                </tr>
              </thead>
              <tbody>{renderData()}</tbody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="pagination-wrapper d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center" style={{ gap: '8px' }}>
              <Button
                className="pagination-btn"
                onClick={() => handlePagination(1)}
                disabled={currentPage === 1}
              >
                <ChevronsLeft size={24} />
              </Button>
              <Button
                color="secondary"
                className="pagination-btn"
                onClick={() => handlePagination(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft size={24} />
              </Button>
              <Button
                color="secondary"
                className="pagination-btn"
                onClick={() => handlePagination(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <ChevronRight size={24} />
              </Button>
              <Button
                color="secondary"
                className="pagination-btn"
                onClick={() => handlePagination(totalPages)}
                disabled={currentPage === totalPages}
              >
                <ChevronsRight size={24} />
              </Button>
              <div className="page-indicator">
                <span className="current-page">{currentPage}</span>
                <span>/</span>
                <span className="total-pages">{totalPages}</span>
              </div>
            </div>

            <div className="d-flex align-items-center" style={{ gap: '8px' }}>
              <Input
                type="number"
                placeholder="페이지"
                value={targetPage}
                onChange={(e) => setTargetPage(e.target.value)}
                style={{ width: '100px', height: '48px', fontSize: '16px' }}
              />
              <Button
                color="light"
                onClick={handleMovePage}
                style={{ height: '48px', fontSize: '16px' }}
              >
                이동
              </Button>
              <Input
                type="select"
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                style={{ width: '96px', height: '48px', fontSize: '16px' }}
              >
                <option value={10}>10건</option>
                <option value={20}>20건</option>
                <option value={30}>30건</option>
                <option value={50}>50건</option>
              </Input>
            </div>
          </div>
        </div>
      </Card>
    </Fragment>
  )
}

export default DataTableWithButtons
