// ** React Imports
import { Fragment } from 'react'

// ** Third Party Components
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { ChevronLeft, ChevronRight, Search } from 'react-feather'
import Select from 'react-select'

// ** Reactstrap Imports
import { Form, Label, Input, Row, Col, Button, FormFeedback, InputGroup } from 'reactstrap'


const defaultValues = {
  email: '',
  username: '',
  password: '',
  confirmPassword: ''
}

const AccountDetails = ({ stepper }) => {
  const SignupSchema = yup.object().shape({
    username: yup.string().required(),
    email: yup.string().email().required(),
    password: yup.string().required(),
    confirmPassword: yup
      .string()
      .required()
      .oneOf([yup.ref(`password`), null], 'Passwords must match')
  })

  // ** Hooks

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    // defaultValues,
    // resolver: yupResolver(SignupSchema)
  })

  const onSubmit = data => {
    stepper.next()

    // if (Object.values(data).every(field => field.length > 0)) {
    //   stepper.next()
    // }
  }

  return (
    <Fragment>
      <div className='content-header mb-2'>
        <h2 className='fw-bolder mb-75'>회원정보 입력</h2>
        <span>플래닛 2536 운영센터 가입을 위해 회원정보를 입력해주세요.</span>
      </div>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row>
          <Col md='6' className='mb-1'>
            <Label className='form-label' for='성명'>
              성명
            </Label>
            <Controller
              id='username'
              name='성명'
              control={control}
              render={({ field }) => <Input placeholder='홍길동' {...field} />}
            />
            {/* {errors.username && <FormFeedback>{errors.username.message}</FormFeedback>} */}
          </Col>

        </Row>
        <Row>

          <Col md='6' className='mb-1'>
            <Label className='form-label' for={`이메일 확인`}>
              휴대폰번호
            </Label>
            <Row>
              <Col md='12' sm='12'>
                <InputGroup>
                  <Input placeholder='010-0000-0000' />
                  <Button color='primary' outline>
                    인증
                  </Button>
                </InputGroup>
              </Col>

            </Row>
          </Col>

          <Col md='6' className='mb-1'>
            <Label className='form-label' for={`이메일 확인`}>
              인증번호 입력
            </Label>
            <Controller
              control={control}
              id='emailCheck'
              name='인증번호 입력'
              render={({ field }) => (
                <Input type='email' placeholder='000000'  {...field} />
              )}
            />
            {/* {errors.email && <FormFeedback>{errors.email.message}</FormFeedback>} */}

          </Col>
        </Row>
        <Row>
          <Col md='6' className='mb-1'>
            <Label className='form-label' for={`이메일`}>
              이메일
            </Label>
            <Controller
              control={control}
              id='email'
              name='이메일'
              render={({ field }) => (
                <Input type='email' placeholder='example@email.com'  {...field} />
              )}
            />
            {/* {errors.email && <FormFeedback>{errors.email.message}</FormFeedback>} */}

          </Col>

          <Col md='6' className='mb-1'>
            <Label className='form-label' for={`이메일 확인`}>
              이메일 확인
            </Label>
            <Controller
              control={control}
              id='emailCheck'
              name='이메일 확인'
              render={({ field }) => (
                <Input type='email' placeholder='example@email.com'  {...field} />
              )}
            />
            {/* {errors.email && <FormFeedback>{errors.email.message}</FormFeedback>} */}

          </Col>
        </Row>

        <Row>
          <Col md='6' className='mb-1'>
            <Label className='form-label' for={`활동지역`}>
              활동지역
            </Label>
            <Controller
              control={control}
              id='email'
              name='활동지역'
              render={({ field }) => (
                <Select
                  className='react-select'
                  classNamePrefix='select'
                  defaultValue={{ value: 'blue', label: 'Blue' }}
                  options={[
                    { value: 'ocean', label: 'Ocean' },
                    { value: 'blue', label: 'Blue' },
                    { value: 'purple', label: 'Purple' },
                    { value: 'red', label: 'Red' },
                    { value: 'orange', label: 'Orange' }
                  ]
                  }
                  isClearable={false}
                />)}
            />
            {/* {errors.email && <FormFeedback>{errors.email.message}</FormFeedback>} */}

          </Col>

          <Col md='6' className='mb-1'>
            <Label className='form-label' for={`구분`}>
              구분
            </Label>
            <Controller
              control={control}
              id='emailCheck'
              name='구분'
              render={({ field }) => (
                <Select
                  className='react-select'
                  classNamePrefix='select'
                  defaultValue={{ value: 'blue', label: 'Blue' }}
                  options={[
                    { value: 'ocean', label: 'Ocean' },
                    { value: 'blue', label: 'Blue' },
                    { value: 'purple', label: 'Purple' },
                    { value: 'red', label: 'Red' },
                    { value: 'orange', label: 'Orange' }
                  ]
                  }
                  isClearable={false}
                />)}
            />
            {/* {errors.email && <FormFeedback>{errors.email.message}</FormFeedback>} */}

          </Col>
        </Row>

        <Row>
          <Col sm={12} className='mb-1'>
            <Label className='form-label' for='profile-link'>
              가입 경로
            </Label>
            <Controller
              control={control}
              id='emailCheck'
              name='구분'
              render={({ field }) => (
                <Select
                  className='react-select'
                  classNamePrefix='select'
                  defaultValue={{ value: 'blue', label: 'Blue' }}
                  options={[
                    { value: 'ocean', label: 'Ocean' },
                    { value: 'blue', label: 'Blue' },
                    { value: 'purple', label: 'Purple' },
                    { value: 'red', label: 'Red' },
                    { value: 'orange', label: 'Orange' }
                  ]
                  }
                  isClearable={false}
                />)}
            />
          </Col>

        </Row>
        <div className='d-flex justify-content-between mt-2'>
          <Button color='secondary' className='btn-prev' outline disabled>
            <ChevronLeft size={14} className='align-middle me-sm-25 me-0'></ChevronLeft>
            <span className='align-middle d-sm-inline-block d-none'>Previous</span>
          </Button>
          <Button type='submit' color='primary' className='btn-next'>
            <span className='align-middle d-sm-inline-block d-none'>Next</span>
            <ChevronRight size={14} className='align-middle ms-sm-25 ms-0'></ChevronRight>
          </Button>
        </div>
      </Form>
    </Fragment>
  )
}

export default AccountDetails
