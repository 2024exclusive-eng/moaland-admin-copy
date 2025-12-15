// 화면 정의 : 로그인 화면
import { useContext } from 'react'

// ** React Imports
import { Link, useNavigate } from 'react-router-dom'

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
  const ability = useContext(AbilityContext)
  const {
    control,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm({ admin: "", pw: "" })

  const onSubmit = data => {
    if (Object.values(data).every(field => field?.length > 0)) {
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
              <svg width="84" height="20" viewBox="0 0 84 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clip-path="url(#clip0_807_11918)">
                  <path d="M56.7556 7.75018C54.9085 0.78092 61.3648 0 61.3648 0L61.6688 1.65134L63.3129 1.63954C63.3129 1.63954 62.2566 6.92697 56.7556 7.7492" fill="#F05783" />
                  <path d="M56.7798 9.14656V19.9998H59.8891V8.88494C59.8891 8.60759 59.8506 8.37154 59.7785 8.16992C58.9357 8.62234 57.9448 8.97051 56.7798 9.14558V9.14656Z" fill="#F05783" />
                  <path d="M5.68665 9.85926C3.86069 9.85926 3.0747 11.4191 3.0747 13.3331V19.7368H0V3.66797H1.54889C2.56577 3.66797 3.0747 4.21186 3.0747 5.25145V8.98491C4.64668 7.14178 6.565 6.6215 8.8537 7.44864C10.5642 8.08695 11.3733 9.76485 11.2809 12.4823V19.7368H8.22933V13.3331C8.22933 11.2303 7.44334 9.85926 5.68665 9.85926Z" fill="#F05783" />
                  <path d="M16.0188 10.4971H12.9441C13.3136 8.18088 14.9086 7.04688 17.7293 7.04688C21.1042 7.04688 22.8147 8.18088 22.884 10.4971V14.7508C22.884 18.201 20.8502 19.7373 17.5446 19.9734C14.6094 20.2094 12.5747 18.8157 12.5747 16.0501C12.644 13.0493 14.7711 12.2458 17.8679 11.9379C19.1849 11.7727 19.8555 11.3705 19.8555 10.6859C19.7862 9.9768 19.1387 9.62273 17.8679 9.62273C16.7817 9.62273 16.1805 9.90598 16.0188 10.4971ZM19.9026 14.6092V13.4516C19.1859 13.7585 18.3537 14.0191 17.4523 14.2079C16.2276 14.444 15.6032 15.0351 15.6032 15.9566C15.6725 16.949 16.1814 17.4221 17.1521 17.4221C18.8626 17.4221 19.9026 16.3825 19.9026 14.6102V14.6092Z" fill="#F05783" />
                  <path d="M24.3638 13.286C24.4561 9.24469 26.5601 7.23633 30.6507 7.23633H31.0904V10.4977H30.0504C28.3399 10.4977 27.4846 11.4193 27.4846 13.2388V19.7369H24.3638V13.286Z" fill="#F05783" />
                  <path d="M42.8091 14.7505C42.8091 16.9005 42.2771 18.3187 41.191 19.0042C40.1048 19.6425 38.9023 19.973 37.5852 19.973C36.2682 19.973 35.1811 19.6189 34.118 18.9098C33.055 18.2243 32.5229 16.8542 32.5229 14.7505V7.23536H35.5976V15.3878C35.5976 16.7824 36.2913 17.467 37.6776 17.467C39.0639 17.467 39.7575 16.7815 39.7575 15.3878V8.79425C39.7344 7.75466 40.2193 7.23438 41.2372 7.23438H42.8091V14.7495V14.7505Z" fill="#F05783" />
                  <path d="M54.5747 5.20424V19.7378H51.5V3.66797H53.0951C53.9042 3.66797 54.5747 4.37709 54.5747 5.20424Z" fill="#F05783" />
                  <path d="M70.4313 19.7363C69.4145 19.6655 68.9055 19.1688 68.9055 18.1765V11.7491C68.8363 10.4499 68.1426 9.81157 66.7785 9.81157C65.4143 9.81157 64.7216 10.4499 64.6985 11.7491V19.7363H61.5776V12.3874C61.5776 8.81919 63.3343 7.04688 66.8246 7.04688C70.3149 7.04688 72.0254 8.81919 72.0024 12.3874V19.7363H70.4304H70.4313Z" fill="#F05783" />
                  <path d="M76.4643 5.20424V12.1283L80.2548 7.68567H83.9529L79.7228 12.3171L83.9991 19.7368H80.301L78.1277 15.6247C77.7352 14.9156 77.3417 14.5615 76.9492 14.5615C76.6259 14.6323 76.4634 14.8448 76.4634 15.1762V19.7368H73.3887V3.66797H74.9837C75.7928 3.66797 76.4634 4.37709 76.4634 5.20424H76.4643Z" fill="#F05783" />
                </g>
                <defs>
                  <clipPath id="clip0_807_11918">
                    <rect width="84" height="20" fill="white" />
                  </clipPath>
                </defs>
              </svg>

            </Link>
            <CardTitle tag='h5' className='text-center text-black mb-1'>
              하루링크 운영센터
            </CardTitle>
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
              <Button type='submit' color='primary' className='mt-2' block>
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
