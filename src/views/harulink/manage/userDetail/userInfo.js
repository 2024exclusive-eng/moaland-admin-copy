import moment from 'moment/moment'

// ** Reactstrap Imports
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Label,
  CardBody,
  CardTitle,
  CardHeader
} from 'reactstrap'

const HorizontalFormIcons = ({ data }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle tag='h4'>기본 정보</CardTitle>
      </CardHeader>
      <CardBody>
        <Form>
          <Row className='mb-1'>
            <Col>
              <Row>
                <Label sm='3' for='id'>
                  ID
                </Label>
                <Col sm='9'>
                  <Input type='text' name='id' id='id' value={data?.id} disabled />
                </Col>
              </Row>
            </Col>
            <Col>
              <Row>
                <Label sm='3' for='email'>
                  이메일
                </Label>
                <Col sm='9'>
                  <Input type='text' name='email' id='email' value={data?.email} disabled />
                </Col>
              </Row>
            </Col>
          </Row>
          <Row className='mb-1'>
            <Col>
              <Row>
                <Label sm='3' for='oauthType'>
                  가입타입
                </Label>
                <Col sm='9'>
                  <Input type='text' name='oauthType' id='oauthType' value={!data?.oauthType ? "일반가입" : "라인가입"} disabled />
                </Col>
              </Row>
            </Col>
            <Col>
            </Col>
          </Row>
          <Row className='mb-1'>
            <Col>
              <Row>
                <Label sm='3' for='account'>
                  계좌번호
                </Label>
                <Col sm='9'>
                  <Input type='text' name='account' id='account' value={data?.account} disabled />
                </Col>
              </Row>
            </Col>
            <Col>
              <Row>
                <Label sm='3' for='depositor'>
                  예금주
                </Label>
                <Col sm='9'>
                  <Input type='text' name='depositor' id='depositor' value={data?.depositor} disabled />
                </Col>
              </Row>
            </Col>
          </Row>


          <Row className='mb-1'>
            <Col>
              <Row >
                <Label sm='3' for='mobileIcons'>
                  하루 링크
                </Label>
                <Col className='m-auto' sm='9'>
                  <span>{`harulink.com/${data?.link}`}</span>
                </Col>
              </Row>
            </Col>
            <Col>
              <Row>
                <Label sm='3' for='created'>
                  가입일
                </Label>
                <Col sm='9'>
                  <Input type='text' name='created' id='created' value={data?.created ? moment(data?.created).format("YY.MM.DD") : ""} disabled />
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
