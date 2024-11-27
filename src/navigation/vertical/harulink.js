// ** Icons Import
import { Home, Circle, Grid, Calendar, Youtube, User, Star, FileText } from 'react-feather'

// 가능 성명 : 사이드바를 렌더링하는 주요 네비게이션 객체입니다.
export default [
  {
    header: 'Harulink'
  },
  {
    id: 'manageUser',
    title: '회원 관리',
    icon: <User size={20} />,
    navLink: '/harulink/manage/user'
  },
  {
    id: 'manageMission',
    title: '미션 관리',
    icon: <Star size={20} />,
    navLink: '/harulink/manage/mission'
  },
  {
    id: 'manageNotice',
    title: '공지사항 관리',
    icon: <FileText size={20} />,
    navLink: '/harulink/manage/notice'
  }
]