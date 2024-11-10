// ** React Imports
import { lazy } from 'react'
import { Navigate } from 'react-router-dom'

// 기능 설명 : 앱 라우트를 정의합니다.
const Intro = lazy(() => import('../../views/planet/auth/intro'))
const Join = lazy(() => import('../../views/planet/auth/join/index'))

const AppRoutes = [
  {
    path: '/planet/auth/intro',
    element: <Intro />,
    layout: 'BlankLayout',
    meta: {
      layout: 'blank',
      publicRoute: true
    }
  },
  {
    path: '/planet/auth/join',
    element: <Join />,
    meta: {
      layout: 'blank'
    }
  } 
]

export default AppRoutes
