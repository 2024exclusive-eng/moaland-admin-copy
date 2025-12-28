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

import { getMissionEnrollmentStatus, getSelectionStatus } from "../../../../utility/missionStatus";
import { getRegionOptions, getCategoryOptions, getMediaTypeOptions } from '../constants';

// ** Icons
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ChevronDown
} from 'react-feather'

// ** Styles
import './MissionList.scss'

const fetchData = async (page, item, search, filters) => {
  try {
    const params = {
      page,
      item
    }

    if (search) {
      params.search = search
    }

    if (filters.status && filters.status.length > 0) {
      params.status = filters.status.join(',')
    }

    if (filters.selection_status && filters.selection_status.length > 0) {
      params.selection_status = filters.selection_status.join(',')
    }

    if (filters.region && filters.region.length > 0) {
      params.region = filters.region.join(',')
    }

    if (filters.category && filters.category.length > 0) {
      params.category = filters.category.join(',')
    }

    if (filters.social && filters.social.length > 0) {
      params.social = filters.social.join(',')
    }

    const response = await axios.get('/admin/mission', { params })
    return response
  } catch (error) {
    console.error('Error fetching data:', error)
    return { missions: { data: [], paging: {} } }
  }
}

const fetchFilterCounts = async () => {
  try {
    const response = await axios.get('/admin/mission/filter-counts')
    return response.counts || {}
  } catch (error) {
    console.error('Error fetching filter counts:', error)
    return {}
  }
}

const getStatusOptions = (counts = {}) => [
  { value: 'opening_soon', label: '오픈예정', count: counts.opening_soon || 0 },
  { value: 'applying', label: '신청중', count: counts.applying || 0 },
  { value: 'application_deadline', label: '선정대기', count: counts.application_deadline || 0 },
  { value: 'in_progress', label: '선정완료', count: counts.in_progress || 0 },
  { value: 'registration_deadline', label: '진행중', count: counts.registration_deadline || 0 },
  { value: 'end', label: '종료', count: counts.end || 0 }
]

const getSelectionStatusOptions = (counts = {}) => [
  { value: 'waiting', label: '선정대기', count: counts.waiting || 0 },
  { value: 'selection_date', label: '선정일', count: counts.selection_date || 0 },
  { value: 'delayed', label: '선정지연', count: counts.delayed || 0 },
  { value: 'completed', label: '선정완료', count: counts.completed || 0 },
  { value: 'selection_deadline', label: '선정지연', count: counts.selection_deadline || 0 }
]
 
const MissionList = () => {
  const [data, setData] = useState({ data: [], paging: {} })
  const [currentPage, setCurrentPage] = useState(1)
  const [search, setSearch] = useState('')
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [targetPage, setTargetPage] = useState('')
  const [filters, setFilters] = useState({
    status: [],
    selection_status: [],
    region: [],
    category: [],
    social: []
  })
  const [filterCounts, setFilterCounts] = useState({
    status: {},
    selection_status: {},
    region: {},
    category: {},
    social: {}
  })
  const [dropdownOpen, setDropdownOpen] = useState({
    status: false,
    selection_status: false,
    region: false,
    category: false,
    social: false
  })

  useEffect(() => {
    const fetchInitialData = async () => {
      const result = await fetchData(currentPage, itemsPerPage, search, filters)
      setData(result.missions || { data: [], paging: {} })
    }
    fetchInitialData()
  }, [currentPage, itemsPerPage, filters])

  useEffect(() => {
    const debounceTimer = setTimeout(async () => {
      const result = await fetchData(currentPage, itemsPerPage, search, filters)
      setData(result.missions || { data: [], paging: {} })
    }, 500)

    return () => clearTimeout(debounceTimer)
  }, [search])

  useEffect(() => {
    const loadFilterCounts = async () => {
      const counts = await fetchFilterCounts()
      setFilterCounts(counts)
    }
    loadFilterCounts()
  }, [])

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

  const handleDraftStatusChange = async (missionId, newStatus) => {
    const previousData = { ...data }

    setData(prevData => ({
      ...prevData,
      data: prevData.data.map(mission => (mission.missionId === missionId
          ? { ...mission, is_public: newStatus }
          : mission)
      )
    }))

    try {
      await axios.put(`/admin/mission/${missionId}/draft`, {
        status: newStatus
      })
    } catch (error) {
      console.error('Error updating draft status:', error)
      setData(previousData)
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
      selection_status: '선정상태',
      region: '지역',
      category: '카테고리',
      social: '미디어'
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
        <tr key={col.missionId} onClick={() => handleRowClick(col.missionId)}>
          <td className="thumbnail-cell" style={{ display :"flex", alignItems: "center", gap: "12px"}} onClick={() => handleRowClick(col.missionId)}>
            <div className="thumbnail-wrapper">
              <img src={col.thumbnailImg} alt={col.title} />
            </div>
            <a href={`/harulink/manage/campaign/${col.missionId}`} style={{ color: "#509594", maxWidth: "400px" }} onClick={(e) => e.preventDefault()}>
              {col.title}
            </a>
          </td>
           <td>
            {/* eslint-disable-next-line multiline-ternary */}
            {`${moment(col.enrollStartDate).format("YY.MM.DD")}-${moment(col.enrollEndDate).format("YY.MM.DD")}`}
          </td>
          <td>
            <div style={{ padding: "2px 8px", width: "fit-content", whiteSpace: "nowrap", borderRadius: "100px", border: "1px solid #E4E6EA", fontSize: "12px" }}>
              {getMissionEnrollmentStatus(col).label}
            </div>
          </td>
          <td>
            {col.enrollCount || '0'}/{col.maxEnroll || '0'}
          </td>
          <td>
            {col.selectDate ? moment(col.selectDate).format("YY.MM.DD") : '24.08.12'}
          </td>
          <td>
            <div style={{ padding: "2px 8px", width: "fit-content", whiteSpace: "nowrap", borderRadius: "100px", border: "1px solid #E4E6EA", fontSize: "12px", color: getSelectionStatus(col).color }}>
              {getSelectionStatus(col).label}
            </div>
          </td>
          <td>
            {col.selectedParticipantCount || '0'}
          </td>
          <td className="action-cell" onClick={(e) => e.stopPropagation()}>
            <div className="form-check form-switch">
              <Input
                type="switch"
                id={`draft-switch-${col.missionId}`}
                checked={col.is_public}
                onChange={(e) => {
                  e.stopPropagation()
                  handleDraftStatusChange(col.missionId, e.target.checked)
                }}
              />
            </div>
          </td>
        </tr>
      )
    })
  }

  const handleSearchChange = (e) => {
    setSearch(e.target.value)
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
                  {getStatusOptions(filterCounts.status).map((option) => (
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
              <Dropdown isOpen={dropdownOpen.selection_status} toggle={() => toggleDropdown('selection_status')} className="filter-dropdown">
                <DropdownToggle caret className="filter-toggle">
                  {getFilterLabel('selection_status')}
                  <ChevronDown size={16} className="ms-auto" />
                </DropdownToggle>
                <DropdownMenu className="filter-menu">
                  {getSelectionStatusOptions(filterCounts.selection_status).map((option) => (
                    <DropdownItem key={option.value} toggle={false} className="filter-item">
                      <Label check className="filter-checkbox-label">
                        <Input
                          type="checkbox"
                          checked={filters.selection_status.includes(option.value)}
                          onChange={() => handleFilterChange('selection_status', option.value)}
                        />
                        <span className="filter-label-text">{option.label}</span>
                        <span className="filter-count">{option.count}</span>
                      </Label>
                    </DropdownItem>
                  ))}
                  <DropdownItem divider />
                  <DropdownItem className="filter-reset" onClick={() => resetFilter('selection_status')}>
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
                  {getRegionOptions(filterCounts.region).map((option) => (
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
                  {getCategoryOptions(filterCounts.category).map((option) => (
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
              <Dropdown isOpen={dropdownOpen.social} toggle={() => toggleDropdown('social')} className="filter-dropdown">
                <DropdownToggle caret className="filter-toggle">
                  {getFilterLabel('social')}
                  <ChevronDown size={16} className="ms-auto" />
                </DropdownToggle>
                <DropdownMenu className="filter-menu">
                  {getMediaTypeOptions(filterCounts.social).map((option) => (
                    <DropdownItem key={option.value} toggle={false} className="filter-item">
                      <Label check className="filter-checkbox-label">
                        <Input
                          type="checkbox"
                          checked={filters.social.includes(option.value)}
                          onChange={() => handleFilterChange('social', option.value)}
                        />
                        <span className="filter-label-text">{option.label}</span>
                        <span className="filter-count">{option.count}</span>
                      </Label>
                    </DropdownItem>
                  ))}
                  <DropdownItem divider />
                  <DropdownItem className="filter-reset" onClick={() => resetFilter('social')}>
                    필터 초기화
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </Col>
            <Col md="2" className="d-flex justify-content-end">
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
            />
          </div>

          {/* Table */}
          <div className="table-wrapper" style={{ marginBottom: '12px' }}>
            <Table className="mission-table" responsive>
              <thead>
                <tr>
                  <th style={{ width: '80px' }}>캠페인</th>
                  <th style={{ width: '140px' }}>신청기간</th>
                  <th style={{ width: '120px' }}>상태</th>
                  <th style={{ width: '100px' }}>신청/선정</th>
                  <th style={{ width: '100px' }}>선정일</th>
                  <th style={{ width: '100px' }}>선정상태</th>
                  <th style={{ width: '100px' }}>선정자</th>
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
