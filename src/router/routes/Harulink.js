// ** React Imports
import { lazy } from 'react'
import { Navigate } from 'react-router-dom'

// 기능 설명 : 앱 라우트를 정의합니다.
const Intro = lazy(() => import('../../views/planet/auth/intro'))
const Join = lazy(() => import('../../views/planet/auth/join/index'))
const DashboardMaster = lazy(() => import('../../views/planet/dashboard/master'))
const DashboardHost = lazy(() => import('../../views/planet/dashboard/host'))
const ManageUser = lazy(() => import('../../views/planet/manage/user'))
const ManageUserDetail = lazy(() => import('../../views/planet/manage/userDetail'))
const ManageSettlement = lazy(() => import('../../views/planet/manage/settlement'))

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
      layout: 'blank',
      publicRoute: true
    }
  },
  {
    path: '/planet/dashboard/master',
    element: <DashboardMaster />,
    meta: {
      publicRoute: true
    }
  },
  {
    path: '/planet/dashboard/host',
    element: <DashboardHost />,
    meta: {
      publicRoute: true
    }
  },
  {
    path: '/harulink/manage/user',
    element: <ManageUser />,
    meta: {
      publicRoute: true
    }
  },
  {
    path: '/planet/manage/user/:id',
    element: <ManageUserDetail />,
    meta: {
      publicRoute: true
    }
  },
  {
    path: '/planet/manage/settlement',
    element: <ManageSettlement />,
    meta: {
      publicRoute: true
    }
  }
]

export default AppRoutes
