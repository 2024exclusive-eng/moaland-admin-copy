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
  Nav, NavItem, NavLink,
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
    email: 'parkms@daum.net',
    num: '202400000CB',
    file: '24.08.11 - 09.01 출석부',
    operateTime: '19:00 - 20:30',
    reqDate: '2024-07-21',
    resDate: '2024-07-29',
    status: '대기',
    price: '10000'
  },
  {
    email: 'kimcs@naver.com',
    num: '202400001KL',
    file: '24.08.15 - 09.05 출석부',
    operateTime: '08:00 - 09:00',
    reqDate: '2024-08-01',
    resDate: '2024-08-08',
    status: '승인',
    price: '15000'
  },
  {
    email: 'lee.yh@gmail.com',
    num: '202400002YM',
    file: '24.09.01 - 09.20 출석부',
    operateTime: '10:00 - 11:30',
    reqDate: '2024-08-10',
    resDate: '2024-08-20',
    status: '반려',
    price: '20000'
  },
  {
    email: 'choi.sj@gmail.com',
    num: '202400003SD',
    file: '24.09.11 - 10.01 출석부',
    operateTime: '14:00 - 15:30',
    reqDate: '2024-09-01',
    resDate: '2024-09-10',
    status: '승인',
    price: '12000'
  },
  {
    email: 'ohsh@naver.com',
    num: '202400004KR',
    file: '24.09.21 - 10.10 출석부',
    operateTime: '18:30 - 20:00',
    reqDate: '2024-09-15',
    resDate: '2024-09-25',
    status: '대기',
    price: '8000'
  },
  {
    email: 'shinjs@hanmail.net',
    num: '202400005JK',
    file: '24.10.01 - 10.20 출석부',
    operateTime: '16:00 - 17:30',
    reqDate: '2024-09-25',
    resDate: '2024-10-05',
    status: '승인',
    price: '5000'
  },
  {
    email: 'handm@gmail.com',
    num: '202400006MG',
    file: '24.10.11 - 10.30 출석부',
    operateTime: '09:00 - 10:30',
    reqDate: '2024-10-10',
    resDate: '2024-10-20',
    status: '반려',
    price: '13000'
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
        <tr key={col.num}>
          <td>
            <div className='form-check'>
              <Input type='checkbox' />
            </div>
          </td>
          <td>{col.num}</td>
          <td>{col.file}</td>
          <td>{col.operateTime}</td>
          <td>{col.reqDate}</td>
          <td>{col.price}</td>
          <td>
            <Badge color='light-warning'>요청</Badge>
          </td>
          <td>{col.resDate}</td>
        </tr>
      )
    })
  }

  return (
    <Fragment>
      <Card>
        <Nav tabs fill>
          <NavItem>
            <NavLink
              className="p-1"
              active={true}
              onClick={() => {
              }}
            >
              정산요청
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className="p-1"

              active={false}
              onClick={() => {
              }}
            >
              반려
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className="p-1"

              active={false}
              onClick={() => {
              }}
            >
              정산완료
            </NavLink>
          </NavItem>

        </Nav>

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
              <span className='align-middle '>상태 변경</span>
            </Button>

          </div>
        </CardHeader>

        <div className='react-dataTable react-dataTable-selectable-rows'>
          <Table responsive>
            <thead>
              <tr>
                <th>선택</th>
                <th>요청번호</th>
                <th>파일명</th>
                <th>운영시간</th>
                <th>요청일자</th>
                <th>정산금액</th>
                <th>처리상태</th>
                <th>처리일자</th>
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
