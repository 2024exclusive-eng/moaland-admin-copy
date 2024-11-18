// ** React Imports
import { Fragment, useState, forwardRef, useEffect } from 'react'
import Avatar from '@components/avatar'

// ** Add New Modal Component
import AddNewModal from './ChangePermission'

// ** Third Party Components
import ReactPaginate from 'react-paginate'
import DataTable from 'react-data-table-component'
import { ChevronDown, Share, Printer, FileText, File, Grid, Copy, Plus, TrendingUp, TrendingDown } from 'react-feather'

// ** Reactstrap Imports
import {
  Table,
  Badge,
  Card,
  Input,
  Label,
  Button,
  Pagination, PaginationItem, PaginationLink,
  CardHeader,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  UncontrolledButtonDropdown
} from 'reactstrap'

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
    class: 0,
    tax: 30

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
    class: 1,
    tax: 30

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
    class: 2,
    tax: 30

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
    class: 0,
    tax: 30

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
    class: 2,
    tax: 30

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
    class: 1,
    tax: 30

  }
]

const DataTableWithButtons = () => {
  // ** States
  const [modal, setModal] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)

  // ** Function to handle Modal toggle
  const handleModal = () => setModal(!modal)


  // ** Function to handle Pagination
  const handlePagination = page => {
    setCurrentPage(page.selected)
  }

  const renderData = () => {
    return data.map(col => {

      return (
        <tr key={col.name}>
          <td>
            <div className='form-check'>
              <Input type='checkbox' />
            </div>
          </td>
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
          <td>{col.tax}%</td>

        </tr>
      )
    })
  }

  return (
    <Fragment>
      <Card>
        <CardHeader className='flex-md-row flex-column align-md-items-center align-items-start border-bottom'>
          <div className='d-flex mt-md-0 mt-1'>
            <UncontrolledButtonDropdown>
              <DropdownToggle color='secondary' caret outline>
                <span className='align-middle ms-50'>30개씩 보기</span>
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem className='w-100'>
                  <Printer size={15} />
                  <span className='align-middle ms-50'>Print</span>
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledButtonDropdown>
            <UncontrolledButtonDropdown className="ms-2">
              <DropdownToggle color='secondary' caret outline>
                <span className='align-middle ms-50'>등록일 순</span>
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem className='w-100'>
                  <Printer size={15} />
                  <span className='align-middle ms-50'>Print</span>
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledButtonDropdown>

          </div>
          <div className='d-flex mt-md-0 mt-1'>
            <Button className='ms-2' color='primary' onClick={handleModal}>
              <span className='align-middle '>엑셀 다운</span>
            </Button>
            <Button className='ms-2' color='primary' onClick={handleModal}>
              <span className='align-middle '>회원 삭제</span>
            </Button>
            <Button className='ms-2' color='primary' onClick={handleModal}>
              <span className='align-middle '>권한 변경</span>
            </Button>
          </div>
        </CardHeader>

        <div className='react-dataTable react-dataTable-selectable-rows'>
          <Table responsive>
            <thead>
              <tr>
                <th>선택</th>
                <th>등록일</th>
                <th>이름</th>
                <th>연락처</th>
                <th>지역</th>
                <th>구분</th>
                <th>카테고리</th>
                <th>가입경로</th>
                <th>등록된 클래스</th>
                <th>수수료</th>
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
        </div>
      </Card>
      <AddNewModal open={modal} handleModal={handleModal} />
    </Fragment>
  )
}

export default DataTableWithButtons
