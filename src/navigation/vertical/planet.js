// ** Icons Import
import { Home, Circle, Grid, Calendar, Youtube } from 'react-feather'

// 가능 성명 : 사이드바를 렌더링하는 주요 네비게이션 객체입니다.
export default [
  {
    header: '플래닛 2365'
  },
  {
    id: 'dashboards',
    title: '홈',
    icon: <Home size={20} />,
    navLink: '/planet/dashboard'
  },
  {
    id: 'manage',
    title: '입점 & 정산관리',
    icon: <Grid size={20} />,
    children: [
      {
        id: 'manageUser',
        title: '회원 관리',
        icon: <Circle size={12} />,
        navLink: '/planet/manage/user'
      },
      {
        id: 'manageSettlement',
        title: '정산 관리',
        icon: <Circle size={12} />,
        navLink: '/planet/manage/settlement'
      }
    ]
  },
  {
    id: 'operation',
    title: '운영 관리',
    icon: <Calendar size={20} />,
    children: [
      {
        id: 'operationClass',
        title: '클래스 운영관리',
        icon: <Circle size={12} />,
        navLink: '/planet/opeartion/class'
      },
      {
        id: 'operationOrder',
        title: '주문 관리',
        icon: <Circle size={12} />,
        navLink: '/planet/operation/order'
      },
      {
        id: 'operationCrm',
        title: 'CRM 관리',
        icon: <Circle size={12} />,
        navLink: '/planet/operation/crm'
      },
      {
        id: 'operationBoard',
        title: '통합 게시판',
        icon: <Circle size={12} />,
        navLink: '/planet/operation/board'
      }
    ]
  },
  {
    id: 'advertisement',
    title: '광고 관리',
    icon: <Youtube size={20} />,
    children: [
      {
        id: 'advertisementPromotion',
        title: '프로모션 관리',
        icon: <Circle size={12} />,
        navLink: '/planet/advertisement/promotion'
      },
      {
        id: 'advertisementBanner',
        title: '배너 관리',
        icon: <Circle size={12} />,
        navLink: '/planet/advertisement/banner'
      }
    ]
  }
]
