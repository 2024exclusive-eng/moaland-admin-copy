// ** React Imports
import { useState } from 'react'

// ** Third Party Components
import Flatpickr from 'react-flatpickr'
import { User, Briefcase, Mail, Calendar, DollarSign, X } from 'react-feather'

// ** Reactstrap Imports
import {
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  UncontrolledButtonDropdown,
  Modal, Table, Input, Label, Button, ModalHeader, ModalBody, InputGroup, InputGroupText
} from 'reactstrap'

// ** Styles
import '@styles/react/libs/flatpickr/flatpickr.scss'


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
const AddNewModal = ({ open, handleModal }) => {
  // ** Custom close btn
  const CloseBtn = <X className='cursor-pointer' size={15} onClick={handleModal} />
  const renderData = () => {
    return data.map(col => {

      return (
        <tr key={col.name}>
          <td>
            <div className='d-flex align-items-center'>
              <div>
                <div className='fw-bolder'>{col.name}</div>
                <div className='font-small-2 text-muted'>{col.email}</div>
              </div>
            </div>
          </td>
          <td>{col.phone}</td>
        </tr>
      )
    })
  }
  return (
    <Modal
      isOpen={open}
      toggle={handleModal}
      className='sidebar-sm'
      modalClassName='modal-slide-in'
      contentClassName='pt-0'
    >
      <ModalHeader className='mb-1' toggle={handleModal} close={CloseBtn} tag='div'>
        <h5 className='modal-title'>권한 변경</h5>
      </ModalHeader>
      <ModalBody className='flex-grow-1'>
        <h6>권한</h6>
        <Input className="mb-1 full-width" value={"Master"} type='select' style={{ width: '10rem' }} onChange={() => { }}>
          <option value='Master'>Master</option>
          <option value='Host'>Host</option>
        </Input>

        <h6>대상</h6>
        <Table responsive>
          <thead>
            <tr>
              <th>이름</th>
              <th>연락처</th>
            </tr>
          </thead>
          <tbody>{renderData()}</tbody>
        </Table>
        <Button className='me-1' color='primary' onClick={handleModal}>
          저장
        </Button>
      </ModalBody>
    </Modal>
  )
}

export default AddNewModal
