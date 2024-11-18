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
        <CardTitle tag='h4'>클래스 운영정보</CardTitle>
      </CardHeader>
      <CardBody>
        <Form>

          <Row className='mb-1'>
            <Col>
              <Row >
                <Label className="text-bold" sm='3' for='mobileIcons'>
                  등록된 클래스
                </Label>
                <Col className='m-auto' sm='9'>
                  <a style={{ textDecoration: "underline" }}>2건</a>
                </Col>
              </Row>
            </Col>
            <Col>
              <Row >
                <Label sm='3' for='nameIcons'>
                  등록된 커리큘럼
                </Label>
                <Col className='m-auto' sm='9'>
                  <a style={{ textDecoration: "underline" }}>2건</a>
                </Col>
              </Row>
            </Col>
          </Row>


          <Row className='mb-1'>
            <Col>
              <Row >
                <Label sm='3' for='nameIcons'>
                  프로모션 신청
                </Label>
                <Col className='m-auto' sm='9'>
                  <a style={{ textDecoration: "underline" }}>2건</a>
                </Col>
              </Row>
            </Col>
            <Col>
              <Row >
                <Label sm='3' for='nameIcons'>
                  정산 요청
                </Label>
                <Col className='m-auto' sm='9'>
                  <a style={{ textDecoration: "underline" }}>2건</a>
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
