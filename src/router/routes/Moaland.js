// ** React Imports
import { lazy } from 'react'
import { Navigate } from 'react-router-dom'

// 기능 설명 : 앱 라우트를 정의합니다.
const Intro = lazy(() => import('../../views/moaland/auth/intro'))
const ManageUser = lazy(() => import('../../views/moaland/manage/user'))
const ManageUserDetail = lazy(() => import('../../views/moaland/manage/userDetail'))
const ManageNotice = lazy(() => import('../../views/moaland/notice/list'))
const ManageNoticeDetail = lazy(() => import('../../views/moaland/notice/detail'))
const ManageMission = lazy(() => import('../../views/moaland/mission/list'))
const ManageMissionDetail = lazy(() => import('../../views/moaland/mission/detail/missionDetail'))
const ManageMissionModify = lazy(() => import('../../views/moaland/mission/detail/newMission'))
const RecommendedCampaign = lazy(() => import('../../views/moaland/recommended-campaign'))
const BannerManagement = lazy(() => import('../../views/moaland/banner'))
const CommunityManagement = lazy(() => import('../../views/moaland/community'))
const CustomerServiceManagement = lazy(() => import('../../views/moaland/customer-service'))

const AppRoutes = [
  {
    path: '/moaland/auth/intro',
    element: <Intro />,
    layout: 'BlankLayout',
    meta: {
      layout: 'blank',
      publicRoute: true
    }
  },
  {
    path: '/moaland/manage/campaign',
    element: <ManageMission />
  },
  {
    path: '/moaland/manage/campaign/:id',
    element: <ManageMissionDetail />
  },
  {
    path: '/moaland/manage/campaign/modify/:id',
    element: <ManageMissionModify />
  },
  {
    path: '/moaland/manage/user',
    element: <ManageUser />
  },
  {
    path: '/moaland/manage/user/:id',
    element: <ManageUserDetail />
  },
  {
    path: '/moaland/manage/notice',
    element: <ManageNotice />
  },
  {
    path: '/moaland/manage/community/new',
    element: <ManageNoticeDetail />
  },
  {
    path: '/moaland/manage/community/:id',
    element: <ManageNoticeDetail />
  },
  {
    path: '/moaland/manage/recommended-campaign',
    element: <RecommendedCampaign />
  },
  {
    path: '/moaland/manage/banner',
    element: <BannerManagement />
  },
  {
    path: '/moaland/manage/community',
    element: <CommunityManagement />
  },
  {
    path: '/moaland/manage/customer-service',
    element: <CustomerServiceManagement />
  }
]

export default AppRoutes
