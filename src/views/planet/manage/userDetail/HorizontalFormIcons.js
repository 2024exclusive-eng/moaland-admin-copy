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
        <CardTitle tag='h4'>기본 정보</CardTitle>
      </CardHeader>
      <CardBody>
        <Form>
          <Row className='mb-1'>
            <Col>
              <Row>
                <Label sm='3' for='EmailIcons'>
                  아이디
                </Label>
                <Col sm='9'>
                  <InputGroup className='input-group-merge'>
                    <InputGroupText>
                      <User size={15} />
                    </InputGroupText>
                    <Input type='text' name='name' id='nameIcons' placeholder='First Name' />
                  </InputGroup>
                </Col>
              </Row>
            </Col>
            <Col>
              <Row>
                <Label sm='3' for='nameIcons'>
                  이름
                </Label>
                <Col sm='9'>
                  <InputGroup className='input-group-merge'>
                    <InputGroupText>
                      <User size={15} />
                    </InputGroupText>
                    <Input type='text' name='name' id='nameIcons' placeholder='First Name' />
                  </InputGroup>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row className='mb-1'>
            <Col>
              <Row>
                <Label sm='3' for='mobileIcons'>
                  연락처
                </Label>
                <Col sm='9'>
                  <InputGroup className='input-group-merge'>
                    <InputGroupText>
                      <Smartphone size={15} />
                    </InputGroupText>
                    <Input type='number' name='mobile' id='mobileIcons' placeholder='Mobile' />
                  </InputGroup>
                </Col>
              </Row>
            </Col>
            <Col>
              <Row>
                <Label sm='3' for='nameIcons'>
                  이메일
                </Label>
                <Col sm='9'>
                  <InputGroup className='input-group-merge'>
                    <InputGroupText>
                      <User size={15} />
                    </InputGroupText>
                    <Input type='text' name='name' id='nameIcons' placeholder='First Name' />
                  </InputGroup>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row className='mb-1'>
            <Col>
              <Row>
                <Label sm='3' for='mobileIcons'>
                  지역
                </Label>
                <Col sm='9'>
                  <Input className="full-width" value={"대전"} type='select' style={{ width: '10rem' }} onChange={() => { }}>
                    <option value='대전'>대전</option>
                    <option value='Host'>Host</option>
                  </Input>
                </Col>
              </Row>
            </Col>
            <Col>
              <Row>
                <Label sm='3' for='nameIcons'>
                  구분
                </Label>
                <Col sm='9'>
                  <Input className="full-width" value={"리더"} type='select' style={{ width: '10rem' }} onChange={() => { }}>
                    <option value='리더'>리더</option>
                    <option value='Host'>Host</option>
                  </Input>
                </Col>
              </Row>
            </Col>
          </Row>

          <Row className='mb-1'>
            <Col>
              <Row>
                <Label sm='3' for='mobileIcons'>
                  계약 수수료
                </Label>
                <Col sm='9'>
                  <Input type='text' name='name' id='name' placeholder='50%' />
                </Col>
              </Row>
            </Col>
            <Col>
            </Col>
          </Row>

          <Row className='mb-1'>
            <Col>
              <Row >
                <Label sm='3' for='mobileIcons'>
                  인스타그램 링크
                </Label>
                <Col className='m-auto' sm='9'>
                  <span>https://www.instagram.com/</span>
                </Col>
              </Row>
            </Col>
            <Col>
              <Row>
                <Label sm='3' for='nameIcons'>
                  미션 수행일
                </Label>
                <Col sm='9'>
                  <Input type='date' name='name' id='name' placeholder='50%' />
                </Col>
              </Row>
            </Col>
          </Row>

          <Row className='mb-1'>
            <Col>
              <Row >
                <Label className="text-bold" sm='3' for='mobileIcons'>
                  최종 방문일
                </Label>
                <Col className='m-auto' sm='9'>
                  <span>2024-07-17</span>
                </Col>
              </Row>
            </Col>
            <Col>
              <Row >
                <Label sm='3' for='nameIcons'>
                  계약 만료일
                </Label>
                <Col className='m-auto' sm='9'>
                  <span>2024-07-17</span>
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
