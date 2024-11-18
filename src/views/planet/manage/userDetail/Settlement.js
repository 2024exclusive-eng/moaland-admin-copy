// ** Reactstrap Imports
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Label,
  Button,
  CardBody,
  CardTitle,
  CardHeader,
  InputGroup,
  InputGroupText
} from 'reactstrap'

// ** Icons Imports
import { User, Mail, Smartphone, Lock } from 'react-feather'

const HorizontalFormIcons = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle tag='h4'>정산 정보</CardTitle>
      </CardHeader>
      <CardBody>
        <Form>

          <Row className='mb-1'>
            <Col>
              <Row >
                <Label sm='3' for='mobileIcons'>
                  예금주명
                </Label>
                <Col className='m-auto' sm='9'>
                  <span>홍길동</span>
                </Col>
              </Row>
            </Col>
            <Col>
              <Row >
                <Label sm='3' for='nameIcons'>
                  등록된 커리큘럼
                </Label>
                <Col className='m-auto' sm='9'>
                  <Input type='date' name='name' id='name' placeholder='50%' />
                </Col>
              </Row>
            </Col>
          </Row>


          <Row className='mb-1'>
            <Col>
              <Row >
                <Label sm='3' for='nameIcons'>
                  은행명
                </Label>
                <Col className='m-auto' sm='9'>
                  <Input type='date' name='name' id='name' placeholder='50%' />
                </Col>
              </Row>
            </Col>
            <Col>
              <Row >
                <Label sm='3' for='nameIcons'>
                  계좌번호
                </Label>
                <Col className='m-auto' sm='9'>
                  <Input type='date' name='name' id='name' placeholder='50%' />
                </Col>
              </Row>
            </Col>
          </Row>


        </Form>
      </CardBody>
    </Card>
  )
}
export default HorizontalFormIcons
