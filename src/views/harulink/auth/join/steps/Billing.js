// ** React Imports
import { Fragment, useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'

// ** Third Party Components
import classnames from 'classnames'
import Cleave from 'cleave.js/react'
import { useForm, Controller } from 'react-hook-form'
import { ChevronLeft, Check } from 'react-feather'
import { useDispatch } from 'react-redux'

// ** Reactstrap Imports
import { Form, Label, Input, Row, Col, Button, InputGroup, InputGroupText, FormFeedback } from 'reactstrap'

// ** Card Images
import jcbCC from '@src/assets/images/icons/payments/jcb-cc.png'
import amexCC from '@src/assets/images/icons/payments/amex-cc.png'
import uatpCC from '@src/assets/images/icons/payments/uatp-cc.png'
import visaCC from '@src/assets/images/icons/payments/visa-cc.png'
import dinersCC from '@src/assets/images/icons/payments/diners-cc.png'
import maestroCC from '@src/assets/images/icons/payments/maestro-cc.png'
import discoverCC from '@src/assets/images/icons/payments/discover-cc.png'
import mastercardCC from '@src/assets/images/icons/payments/mastercard-cc.png'
import useJwt from '@src/auth/jwt/useJwt'

// ** Actions
import { handleLogin } from '@store/authentication'

// ** Context
import { AbilityContext } from '@src/utility/context/Can'
import { getHomeRouteForLoggedInUser } from '@utils'


const defaultValues = {
  password: 'admin',
  loginEmail: 'admin@demo.com'
}


const Billing = ({ stepper }) => {
  // ** States
  const [cardType, setCardType] = useState('')

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const ability = useContext(AbilityContext)
  const {
    control,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm({ defaultValues })


  const onSubmit = data => {
    if (Object.values(data).every(field => field.length > 0)) {
      useJwt
        .login({ email: data.loginEmail, password: data.password })
        .then(res => {
          const data = { ...res.data.userData, accessToken: res.data.accessToken, refreshToken: res.data.refreshToken }
          dispatch(handleLogin(data))
          ability.update(res.data.userData.ability)
          navigate(getHomeRouteForLoggedInUser(data.role))
          toast(t => (
            <ToastContent t={t} role={data.role || 'admin'} name={data.fullName || data.username || 'John Doe'} />
          ))
        })
        .catch(err => console.log(err))
    } else {
      for (const key in data) {
        if (data[key].length === 0) {
          setError(key, {
            type: 'manual'
          })
        }
      }
    }
  }

  return (
    <Fragment>
      <div className='content-header mb-2'>
        <h2 className='fw-bolder mb-75'>🎉가입 완료</h2>
        <p className='mt-3'>플래닛2536 운영센터 가입이 완료되었습니다.</p>
        <p>로그인 후 운영센터 사용이 가능합니다.</p>

      </div>
      <Form onSubmit={handleSubmit(onSubmit)}>

        <div className='d-flex justify-content-between mt-5'>
          <Button type="submit" color='success' className='btn-next'>
            {/* <Button
            type="button"
            color="success"
            className="btn-next"
            onClick={() => alert('관리자의 심사를 기다리는 중입니다')}
          > */}
            <span className='align-middle d-sm-inline-block d-none'>로그인</span>
            <Check size={14} className='align-middle ms-sm-25 ms-0'></Check>
          </Button>
        </div>
      </Form>
    </Fragment>
  )
}

export default Billing
