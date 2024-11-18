// ** React Imports
import { Fragment } from 'react'

// ** Third Party Components
import { useForm, Controller } from 'react-hook-form'
import { ChevronLeft, ChevronRight } from 'react-feather'

// ** Reactstrap Imports
import { Form, Label, Input, Row, Col, Button, FormFeedback } from 'reactstrap'

const defaultValues = {
  address: '',
  firstName: ''
}

const PersonalInfo = ({ stepper }) => {
  // ** Hooks
  const {
    control,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm({
    // defaultValues
  })

  const onSubmit = data => {
    stepper.next()
    // if (Object.values(data).every(field => field.length > 0)) {
    //   stepper.next()
    // } else {
    //   for (const key in data) {
    //     if (data[key].length === 0) {
    //       setError(key, {
    //         type: 'manual',
    //         message: `Please enter a valid ${key}`
    //       })
    //     }
    //   }
    // }
  }

  return (
    <Fragment>
      <div className='content-header mb-2'>
        <h2 className='fw-bolder mb-75'>이용약관 동의</h2>
        <p className='mt-2'>플래닛2536에서 서비스를 제공하기 위해 필요 약관으로 꼭 자세한 입점 이용 약관을 확인해주세요</p>
        <p className='mt-1'>기본 수수료는 30%로 PG사, 부가세 수수료 포함 금액 입니다.</p>
        <p>원천세 3.3% 정산시 별도 공제됩니다.</p>
      </div>

      <Form className='mt-2' onSubmit={handleSubmit(onSubmit)}>
        <Row>

          <Col md='12' className='mb-1'>
            <h4 className='fw-bolder mb-75'>개인정보 처리방침</h4>
            <Input type='textarea' style={{ height: "110px" }} disabled name='text' id='exampleText' rows='3' placeholder='프롬더허들(이하 ‘회사’)는 개인정보보호법 제 30조에 따라 이용자(도는 회원)의 개인정보를 보호하고 이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 하기 위하여 다음과 같이 개인정보 처리방침을 수립ㆍ공개합니프롬더허들(이하 ‘회사’)는 개인정보보호법 제 30조에 따라 이용자(도는 회원)의 개인정보를 보호하고 이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 하기 위하여 다음과 같이 개인정보 처리방침을 수립ㆍ공개합니프롬더허들(이하 ‘회사’)는 개인정보보호법 제 30조에 따라 이용자(도는 회원)의 개인정보를 보호하고 이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 하기 위하여 다음과 같이 개인정보 처리방침을 수립ㆍ공개합니' values="프롬더허들(이하 ‘회사’)는 개인정보보호법 제 30조에 따라 이용자(도는 회원)의 개인정보를 보호하고 이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 하기 위하여 다음과 같이 개인정보 처리방침을 수립ㆍ공개합니프롬더허들(이하 ‘회사’)는 개인정보보호법 제 30조에 따라 이용자(도는 회원)의 개인정보를 보호하고 이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 하기 위하여 다음과 같이 개인정보 처리방침을 수립ㆍ공개합니프롬더허들(이하 ‘회사’)는 개인정보보호법 제 30조에 따라 이용자(도는 회원)의 개인정보를 보호하고 이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 하기 위하여 다음과 같이 개인정보 처리방침을 수립ㆍ공개합니" />
          </Col>
          <Col md='12' className='mb-1'>
            <h4 className='fw-bolder mb-75'>입점 이용 약관</h4>
            <Input type='textarea' style={{ height: "110px" }} disabled name='text' id='exampleText' rows='3' placeholder='프롬더허들(이하 ‘회사’)는 개인정보보호법 제 30조에 따라 이용자(도는 회원)의 개인정보를 보호하고 이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 하기 위하여 다음과 같이 개인정보 처리방침을 수립ㆍ공개합니프롬더허들(이하 ‘회사’)는 개인정보보호법 제 30조에 따라 이용자(도는 회원)의 개인정보를 보호하고 이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 하기 위하여 다음과 같이 개인정보 처리방침을 수립ㆍ공개합니프롬더허들(이하 ‘회사’)는 개인정보보호법 제 30조에 따라 이용자(도는 회원)의 개인정보를 보호하고 이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 하기 위하여 다음과 같이 개인정보 처리방침을 수립ㆍ공개합니' values="프롬더허들(이하 ‘회사’)는 개인정보보호법 제 30조에 따라 이용자(도는 회원)의 개인정보를 보호하고 이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 하기 위하여 다음과 같이 개인정보 처리방침을 수립ㆍ공개합니프롬더허들(이하 ‘회사’)는 개인정보보호법 제 30조에 따라 이용자(도는 회원)의 개인정보를 보호하고 이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 하기 위하여 다음과 같이 개인정보 처리방침을 수립ㆍ공개합니프롬더허들(이하 ‘회사’)는 개인정보보호법 제 30조에 따라 이용자(도는 회원)의 개인정보를 보호하고 이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 하기 위하여 다음과 같이 개인정보 처리방침을 수립ㆍ공개합니" />
          </Col>
          <Col md='12' className='mb-1'>
            <h4 className='fw-bolder mb-75'>서비스 이용 약관</h4>
            <Input type='textarea' style={{ height: "110px" }} disabled name='text' id='exampleText' rows='3' placeholder='프롬더허들(이하 ‘회사’)는 개인정보보호법 제 30조에 따라 이용자(도는 회원)의 개인정보를 보호하고 이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 하기 위하여 다음과 같이 개인정보 처리방침을 수립ㆍ공개합니프롬더허들(이하 ‘회사’)는 개인정보보호법 제 30조에 따라 이용자(도는 회원)의 개인정보를 보호하고 이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 하기 위하여 다음과 같이 개인정보 처리방침을 수립ㆍ공개합니프롬더허들(이하 ‘회사’)는 개인정보보호법 제 30조에 따라 이용자(도는 회원)의 개인정보를 보호하고 이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 하기 위하여 다음과 같이 개인정보 처리방침을 수립ㆍ공개합니' values="프롬더허들(이하 ‘회사’)는 개인정보보호법 제 30조에 따라 이용자(도는 회원)의 개인정보를 보호하고 이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 하기 위하여 다음과 같이 개인정보 처리방침을 수립ㆍ공개합니프롬더허들(이하 ‘회사’)는 개인정보보호법 제 30조에 따라 이용자(도는 회원)의 개인정보를 보호하고 이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 하기 위하여 다음과 같이 개인정보 처리방침을 수립ㆍ공개합니프롬더허들(이하 ‘회사’)는 개인정보보호법 제 30조에 따라 이용자(도는 회원)의 개인정보를 보호하고 이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 하기 위하여 다음과 같이 개인정보 처리방침을 수립ㆍ공개합니" />
          </Col>

        </Row>
        <div>
          <p>*약관 미동의시 입점이 불가능합니다.</p>

        </div>
        <div className='d-flex justify-content-between mt-2'>
          <Button color='secondary' className='btn-prev' outline onClick={() => stepper.previous()}>
            <ChevronLeft size={14} className='align-middle me-sm-25 me-0'></ChevronLeft>
            <span className='align-middle d-sm-inline-block d-none'>Previous</span>
          </Button>
          <Button type='submit' color='primary' className='btn-next'>
            <span className='align-middle d-sm-inline-block d-none'>동의</span>
            <ChevronRight size={14} className='align-middle ms-sm-25 ms-0'></ChevronRight>
          </Button>
        </div>
      </Form>
    </Fragment>
  )
}

export default PersonalInfo
