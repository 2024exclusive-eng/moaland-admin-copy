// ** React Imports
import { Link } from 'react-router-dom'
import { useRef, useState } from 'react'

// ** Custom Components
import Wizard from '@components/wizard'

// ** Reactstrap Imports
import { Row, Col } from 'reactstrap'

// ** Third Party Components
import { Home, User, CreditCard } from 'react-feather'

// ** Steps
import Billing from './steps/Billing'
import PersonalInfo from './steps/PersonalInfo'
import AccountDetails from './steps/AccountDetails'

// ** Styles
import '@styles/react/pages/page-authentication.scss'

// ** Config
import themeConfig from '@configs/themeConfig'

import sideImg from '@src/assets/images/planet/health.png'

const RegisterMultiSteps = () => {
  // ** Ref
  const ref = useRef(null)

  // ** State
  const [stepper, setStepper] = useState(null)

  const steps = [
    {
      id: 'account-details',
      title: 'STEP 01',
      subtitle: '회원정보 입력',
      icon: <Home size={18} />,
      content: <AccountDetails stepper={stepper} />
    },
    {
      id: 'personal-info',
      title: 'STEP 02',
      subtitle: '이용약관 동의',
      icon: <User size={18} />,
      content: <PersonalInfo stepper={stepper} />
    },
    {
      title: 'STEP 03',
      id: 'step-billing',
      subtitle: '가입 완료',
      icon: <CreditCard size={18} />,
      content: <Billing stepper={stepper} />
    }
  ]

  const source = require('@src/assets/images/pages/create-account.svg').default

  return (
    <div className='auth-wrapper auth-cover'>
      <Row className='auth-inner m-0'>
        <Link className='brand-logo' to='/'>
          <img src={themeConfig.app.appLogoImage} alt='logo' />

          <h2 style={{ marginTop: '8px' }} className='justify-content-center text-black brand-text text-primary ms-1'>하루링크 운영센터</h2>
        </Link>
        <Col lg='3' className='d-none d-lg-flex align-items-center p-0'>
          <div className='w-100 d-lg-flex align-items-center justify-content-center' style={{ height: '100%' }}>
            <img className='img-fluid w-100 h-100' src={sideImg} alt='Login Cover' style={{ objectFit: 'cover' }} />
          </div>
        </Col>
        <Col lg='9' className='d-flex align-items-center auth-bg px-2 px-sm-3 px-lg-5 pt-3'>
          <div className='width-700 mx-auto'>
            <Wizard
              ref={ref}
              steps={steps}
              instance={el => setStepper(el)}
              headerClassName='px-0'
              contentWrapperClassName='px-0 mt-4'
              className='register-multi-steps-wizard shadow-none'
            />
          </div>
        </Col>
      </Row>
    </div>
  )
}

export default RegisterMultiSteps
