import {useSelector} from 'react-redux'
import {filterAdminNavigation} from '../utility/adminPermissions'
// ** React Imports
import { Outlet } from 'react-router-dom'

// ** Core Layout Import
// !Do not remove the Layout import
import Layout from '@layouts/VerticalLayout'

// ** Menu Items Array
import navigation from '@src/navigation/vertical'

const VerticalLayout = props => {
  const role = useSelector(state => state.auth.userData?.role)

  // const [menuData, setMenuData] = useState([])

  // ** For ServerSide navigation
  // useEffect(() => {
  //   axios.get(URL).then(response => setMenuData(response.data))
  // }, [])

  return (
    <Layout menuData={filterAdminNavigation(navigation, role)} {...props}>
      <Outlet />
    </Layout>
  )
}

export default VerticalLayout
