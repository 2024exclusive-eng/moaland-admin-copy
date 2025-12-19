// 화면 정의 : 로그인 화면
import { useContext, useState } from 'react'

// ** React Imports
import { Link, useNavigate } from 'react-router-dom'

import Logo from "@assets/images/logo.png"
// ** Reactstrap Imports
import { Card, CardBody, CardTitle, CardText, Form, Label, Input, Button } from 'reactstrap'
import InputPasswordToggle from '@components/input-password-toggle'

import { useDispatch } from 'react-redux'
import { handleLogin } from '@store/authentication'
import useJwt from '@src/auth/jwt/useJwt'
import { useForm, Controller } from 'react-hook-form'

// ** Context
import { AbilityContext } from '@src/utility/context/Can'

// ** Styles
import '@styles/react/pages/page-authentication.scss'

const ForgotPasswordBasic = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const ability = useContext(AbilityContext)
  const {
    control,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm({ admin: "", pw: "" })

  const onSubmit = data => {
    if (Object.values(data).every(field => field?.length > 0)) {
      setLoading(true)
      useJwt
        .login({ admin: data.admin, pw: data.pw })
        .then(res => {
          if (res.success) {
            const data = {
              ...res.userInfo,
              ability: [
                {
                  action: 'manage',
                  subject: 'all'
                }
              ],
              accessToken: res.accessToken,
              role: "admin"
            }
            dispatch(handleLogin(data))
            ability.update(data.ability)
            navigate("/")
          }
        })
        .catch(err => console.log(err))
        .finally(() => {
          setLoading(false)
        })
    } else {
      for (const key in data) {
        if (!data[key] || data[key].length === 0) {
          setError(key, {
            type: 'manual'
          })
        }
      }
    }
  }
  return (
    <div className='auth-wrapper auth-basic px-2'>
      <div className='auth-inner my-2'>
        <Card className='mb-0'>
          <CardBody>
            <Link className='brand-logo' to='/' onClick={e => e.preventDefault()}>
              <img src={Logo} width={78} height={16} alt="logo" />
            </Link>
            <Form onSubmit={handleSubmit(onSubmit)} className='auth-login-form mt-2'>
              <div className='mb-1'>
                <Label className='form-label' for='id'>
                  아이디
                </Label>
                <Controller
                  id='admin'
                  name='admin'
                  control={control}
                  render={({ field }) => (
                    <Input
                      autoFocus
                      type='text'
                      placeholder='admin'
                      invalid={errors.admin && true}
                      {...field}
                    />
                  )}
                />
              </div>
              <div className='mb-1'>
                <div className='d-flex justify-content-between'>
                  <Label className='form-label' for='login-password'>
                    비밀번호
                  </Label>
                </div>
                <Controller
                  id='pw'
                  name='pw'
                  control={control}
                  render={({ field }) => (
                    <InputPasswordToggle className='input-group-merge' invalid={errors.pw && true} {...field} />
                  )}
                />
              </div>
              <Button type='submit' disabled={loading} color='primary' className='mt-2' block>
                로그인
              </Button>
            </Form>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}

export default ForgotPasswordBasic
