// ** React Imports
import { Fragment } from 'react'

// ** Reactstrap Imports
import { Row, Col } from 'reactstrap'

// ** Custom Components
import Breadcrumbs from '@components/breadcrumbs'

// ** Demo Components
import HorizontalFormIcons from './HorizontalFormIcons'
import Class from './Class'
import Settlement from './Settlement'

const FormLayouts = () => {
  return (
    <Fragment>
      <Breadcrumbs title='회원 정보' data={[{ title: '입정 & 정산관리' }, { title: '회원관리' }]} />
      <Row>
        <Col md='12' sm='12'>
          <HorizontalFormIcons />
        </Col>
        <Col md='12' sm='12'>
          <Class />
        </Col>
        <Col md='12' sm='12'>
          <Settlement />
        </Col>
      </Row>
    </Fragment>
  )
}
export default FormLayouts
