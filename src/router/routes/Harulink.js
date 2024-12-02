// ** React Imports
import { lazy } from 'react'
import { Navigate } from 'react-router-dom'

// 기능 설명 : 앱 라우트를 정의합니다.
const Intro = lazy(() => import('../../views/harulink/auth/intro'))
const ManageUser = lazy(() => import('../../views/harulink/manage/user'))
const ManageUserDetail = lazy(() => import('../../views/harulink/manage/userDetail'))
const ManageNotice = lazy(() => import('../../views/harulink/notice/list'))
const ManageNoticeDetail = lazy(() => import('../../views/harulink/notice/detail'))
const ManageMission = lazy(() => import('../../views/harulink/mission/list'))
const ManageMissionDetail = lazy(() => import('../../views/harulink/mission/detail/missionDetail'))
const ManageMissionModify = lazy(() => import('../../views/harulink/mission/detail/newMission'))

const AppRoutes = [
  {
    path: '/harulink/auth/intro',
    element: <Intro />,
    layout: 'BlankLayout',
    meta: {
      layout: 'blank',
      publicRoute: true
    }
  },
  {
    path: '/harulink/manage/mission',
    element: <ManageMission />
  },
  {
    path: '/harulink/manage/mission/:id',
    element: <ManageMissionDetail />
  },
  {
    path: '/harulink/manage/mission/modify/:id',
    element: <ManageMissionModify />
  },
  {
    path: '/harulink/manage/user',
    element: <ManageUser />
  },
  {
    path: '/harulink/manage/user/:id',
    element: <ManageUserDetail />
  },
  {
    path: '/harulink/manage/notice',
    element: <ManageNotice />
  },
  {
    path: '/harulink/manage/notice/:id',
    element: <ManageNoticeDetail />
  }
]

export default AppRoutes
