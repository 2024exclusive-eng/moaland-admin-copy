/* eslint-disable multiline-ternary */
// ** React Imports
import { Fragment, useState, useEffect } from 'react'

// ** Reactstrap Imports
import {
  Table,
  Card,
  Input,
  Button,
  Row,
  Col,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Label
} from 'reactstrap'

import axios from 'axios'
import moment from 'moment'

// ** Icons
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoreVertical,
  ChevronDown
} from 'react-feather'

// ** Styles
import './MissionList.scss'

const fetchData = async (page, item, search, filters) => {
  try {
    const response = await axios.get('/admin/mission', {
      params: {
        page,
        item,
        search,
        ...filters
      }
    })
    return response
  } catch (error) {
    console.error('Error fetching data:', error)
    return { missions: { data: [], paging: {} } }
  }
}

const statusOptions = [
  { value: 'open_scheduled', label: '오픈예정', count: 21 },
  { value: 'applying', label: '신청중', count: 21 },
  { value: 'selection_waiting', label: '선정대기', count: 20 },
  { value: 'selection_complete', label: '선정완료', count: 20 },
  { value: 'in_progress', label: '진행중', count: 19 },
  { value: 'ended', label: '종료', count: 19 }
]

const regionOptions = [
  { value: 'seoul', label: '서울', count: 21 },
  { value: 'busan', label: '부산', count: 21 },
  { value: 'jeju', label: '제주', count: 21 },
  { value: 'etc', label: '기타', count: 21 }
]

const categoryOptions = [
  { value: 'restaurant', label: '맛집', count: 21 },
  { value: 'beauty', label: '뷰티', count: 21 },
  { value: 'music', label: '뮤티', count: 21 },
  { value: 'culture', label: '문화', count: 21 },
  { value: 'accommodation', label: '숙박', count: 21 },
  { value: 'massage', label: '마사지', count: 21 }
]

const mediaOptions = [
  { value: 'blog', label: '식으홍슈', count: 21 },
  { value: 'naver', label: '도우안', count: 21 },
  { value: 'review', label: '따졋디앤팀', count: 21 },
  { value: 'instagram', label: '인스타', count: 21 },
  { value: 'youtube', label: '유튜브', count: 21 }
]

const statusMap = {
  open_scheduled: '오픈예정',
  applying: '신청중',
  selection_waiting: '선정대기',
  selection_complete: '선정완료',
  in_progress: '진행중',
  ended: '종료'
}

const MissionList = () => {
  // ** States
  const [data, setData] = useState({ data: [], paging: {} })
  const [currentPage, setCurrentPage] = useState(1)
  const [search, setSearch] = useState('')
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [targetPage, setTargetPage] = useState('')
  const [filters, setFilters] = useState({
    status: [],
    region: [],
    category: [],
    media: []
  })
  const [dropdownOpen, setDropdownOpen] = useState({
    status: false,
    region: false,
    category: false,
    media: false
  })

  // ** Get data on mount
  useEffect(() => {
    const fetchInitialData = async () => {
      const result = await fetchData(currentPage, itemsPerPage, search, filters)
      setData(result.missions || { data: [], paging: {} })
    }
    fetchInitialData()
  }, [currentPage, itemsPerPage, filters])

  const handlePagination = (page) => {
    setCurrentPage(page)
  }

  const handleRowClick = (id) => {
    window.location.href = `/harulink/manage/campaign/${id}`
  }

  const handleMovePage = () => {
    const pageNum = parseInt(targetPage)
    if (pageNum && pageNum > 0 && pageNum <= (data?.paging?.totalPages || 1)) {
      setCurrentPage(pageNum)
      setTargetPage('')
    }
  }

  const toggleDropdown = (filterName) => {
    setDropdownOpen(prev => ({
      ...prev,
      [filterName]: !prev[filterName]
    }))
  }

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => {
      const currentFilters = prev[filterName]
      const newFilters = currentFilters.includes(value)
        ? currentFilters.filter(item => item !== value)
        : [...currentFilters, value]

      return {
        ...prev,
        [filterName]: newFilters
      }
    })
    setCurrentPage(1)
  }

  const resetFilter = (filterName) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: []
    }))
    setCurrentPage(1)
  }

  const getFilterLabel = (filterName) => {
    const filterLabels = {
      status: '상태',
      region: '지역',
      category: '카테고리',
      media: '미디어'
    }
    return filterLabels[filterName]
  }

  const renderData = () => {
    if (!data.data || data.data.length === 0) {
      return (
        <tr>
          <td colSpan="9" className="text-center" style={{ padding: '40px' }}>
            데이터가 없습니다
          </td>
        </tr>
      )
    }

    return data.data.map((col) => {
      return (
        <tr key={col.missionId}>
          <td className="thumbnail-cell" onClick={() => handleRowClick(col.missionId)}>
            <div className="thumbnail-wrapper">
              <img src={col.thumbnailImg} alt={col.title} />
            </div>
          </td>
          <td onClick={() => handleRowClick(col.missionId)}>
            <div className="mission-title">
              <a href={`/harulink/manage/campaign/${col.missionId}`} onClick={(e) => e.preventDefault()}>
                {col.title || '[미션명칭] 미뇨네뜨 도쿄라멘 초대캠페인'}
              </a>
            </div>
          </td>
          <td onClick={() => handleRowClick(col.missionId)}>
            {/* eslint-disable-next-line multiline-ternary */}
            {col.enrollStartDate && col.enrollEndDate
              // eslint-disable-next-line multiline-ternary
              ? `${moment(col.enrollStartDate).format("YY.MM.DD")}~${moment(col.enrollEndDate).format("YY.MM.DD")}`
              : '24.08.12~24.08.22'}
          </td>
          <td onClick={() => handleRowClick(col.missionId)}>
            {col.brand || '오르페셰'}
          </td>
          <td onClick={() => handleRowClick(col.missionId)}>
            {col.enrollCount || '0'}/{col.maxEnroll || '0'}
          </td>
          <td onClick={() => handleRowClick(col.missionId)}>
            {col.selectDate ? moment(col.selectDate).format("YY.MM.DD") : '24.08.12'}
          </td>
          <td onClick={() => handleRowClick(col.missionId)}>
            <span className={`status-badge ${col.status || 'new'}`}>
              {statusMap[col.status] || '초대대기'}
            </span>
          </td>
          <td onClick={() => handleRowClick(col.missionId)}>
            {col.selectedCount || '-'}
          </td>
          <td className="action-cell" onClick={(e) => e.stopPropagation()}>
            <Button color="link" className="action-btn">
              <MoreVertical size={20} />
            </Button>
          </td>
        </tr>
      )
    })
  }

  const handleSearchChange = (e) => {
    setSearch(e.target.value)
  }

  const handleSearchKeyPress = async (e) => {
    if (e.key === 'Enter') {
      const result = await fetchData(currentPage, itemsPerPage, search, filters)
      setData(result.missions || { data: [], paging: {} })
    }
  }

  const totalPages = data?.paging?.totalPages || 1

  return (
    <Fragment>
      <Card className="mission-list-card">
        <div style={{ padding: '32px' }}>
          {/* Filters Row */}
          <Row className="filters-row" style={{ marginBottom: '20px' }}>
            <Col md="2">
              <Dropdown isOpen={dropdownOpen.status} toggle={() => toggleDropdown('status')} className="filter-dropdown">
                <DropdownToggle caret className="filter-toggle">
                  {getFilterLabel('status')}
                  <ChevronDown size={16} className="ms-auto" />
                </DropdownToggle>
                <DropdownMenu className="filter-menu">
                  {statusOptions.map((option) => (
                    <DropdownItem key={option.value} toggle={false} className="filter-item">
                      <Label check className="filter-checkbox-label">
                        <Input
                          type="checkbox"
                          checked={filters.status.includes(option.value)}
                          onChange={() => handleFilterChange('status', option.value)}
                        />
                        <span className="filter-label-text">{option.label}</span>
                        <span className="filter-count">{option.count}</span>
                      </Label>
                    </DropdownItem>
                  ))}
                  <DropdownItem divider />
                  <DropdownItem className="filter-reset" onClick={() => resetFilter('status')}>
                    필터 초기화
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </Col>
            <Col md="2">
              <Dropdown isOpen={dropdownOpen.region} toggle={() => toggleDropdown('region')} className="filter-dropdown">
                <DropdownToggle caret className="filter-toggle">
                  {getFilterLabel('region')}
                  <ChevronDown size={16} className="ms-auto" />
                </DropdownToggle>
                <DropdownMenu className="filter-menu">
                  {regionOptions.map((option) => (
                    <DropdownItem key={option.value} toggle={false} className="filter-item">
                      <Label check className="filter-checkbox-label">
                        <Input
                          type="checkbox"
                          checked={filters.region.includes(option.value)}
                          onChange={() => handleFilterChange('region', option.value)}
                        />
                        <span className="filter-label-text">{option.label}</span>
                        <span className="filter-count">{option.count}</span>
                      </Label>
                    </DropdownItem>
                  ))}
                  <DropdownItem divider />
                  <DropdownItem className="filter-reset" onClick={() => resetFilter('region')}>
                    필터 초기화
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </Col>
            <Col md="2">
              <Dropdown isOpen={dropdownOpen.category} toggle={() => toggleDropdown('category')} className="filter-dropdown">
                <DropdownToggle caret className="filter-toggle">
                  {getFilterLabel('category')}
                  <ChevronDown size={16} className="ms-auto" />
                </DropdownToggle>
                <DropdownMenu className="filter-menu">
                  {categoryOptions.map((option) => (
                    <DropdownItem key={option.value} toggle={false} className="filter-item">
                      <Label check className="filter-checkbox-label">
                        <Input
                          type="checkbox"
                          checked={filters.category.includes(option.value)}
                          onChange={() => handleFilterChange('category', option.value)}
                        />
                        <span className="filter-label-text">{option.label}</span>
                        <span className="filter-count">{option.count}</span>
                      </Label>
                    </DropdownItem>
                  ))}
                  <DropdownItem divider />
                  <DropdownItem className="filter-reset" onClick={() => resetFilter('category')}>
                    필터 초기화
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </Col>
            <Col md="2">
              <Dropdown isOpen={dropdownOpen.media} toggle={() => toggleDropdown('media')} className="filter-dropdown">
                <DropdownToggle caret className="filter-toggle">
                  {getFilterLabel('media')}
                  <ChevronDown size={16} className="ms-auto" />
                </DropdownToggle>
                <DropdownMenu className="filter-menu">
                  {mediaOptions.map((option) => (
                    <DropdownItem key={option.value} toggle={false} className="filter-item">
                      <Label check className="filter-checkbox-label">
                        <Input
                          type="checkbox"
                          checked={filters.media.includes(option.value)}
                          onChange={() => handleFilterChange('media', option.value)}
                        />
                        <span className="filter-label-text">{option.label}</span>
                        <span className="filter-count">{option.count}</span>
                      </Label>
                    </DropdownItem>
                  ))}
                  <DropdownItem divider />
                  <DropdownItem className="filter-reset" onClick={() => resetFilter('media')}>
                    필터 초기화
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </Col>
            <Col md="4" className="d-flex justify-content-end">
              <Button
                color="primary"
                style={{ height: '48px', fontSize: '16px', minWidth: '120px' }}
                onClick={() => { window.location.href = '/harulink/manage/campaign/modify/new' }}
              >
                캠페인 등록
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
              onKeyPress={handleSearchKeyPress}
            />
          </div>

          {/* Table */}
          <div className="table-wrapper" style={{ marginBottom: '12px' }}>
            <Table className="mission-table" responsive>
              <thead>
                <tr>
                  <th style={{ width: '80px' }}>번제</th>
                  <th>산업/기업</th>
                  <th style={{ width: '140px' }}>상태</th>
                  <th style={{ width: '120px' }}>산업/업태</th>
                  <th style={{ width: '100px' }}>산업/업태</th>
                  <th style={{ width: '100px' }}>산업/업태</th>
                  <th style={{ width: '100px' }}>진행상태</th>
                  <th style={{ width: '100px' }}>공개여부</th>
                  <th style={{ width: '60px' }}>공개여부</th>
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

export default MissionList
