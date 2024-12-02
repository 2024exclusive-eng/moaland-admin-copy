import moment from 'moment/moment'
import { Fragment, useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
// ** Reactstrap Imports
import {
  Row,
  Button,
  Col,
  Card,
  Form,
  Input,
  Label,
  CardBody,
  CardTitle,
  CardImg,
  CardHeader
} from 'reactstrap'
import img1 from '@src/assets/images/slider/06.jpg'
import Editor from '@src/@core/components/editor/editor.js'
import axios from 'axios'
const formatDate = (date) => moment(date).format('YYYY-MM-DD')

const HorizontalFormIcons = ({ missionData }) => {
  const { id } = useParams()

  const [formData, setFormData] = useState(missionData ?? {})

  useEffect(() => {
    if (missionData) setFormData(missionData)
    else setFormData({})
  }, [missionData])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const [image, setImage] = useState(missionData?.thumbnailImg || img1)

  useEffect(() => {
    setImage(missionData?.thumbnailImg || img1)
  }, [missionData])

  const handleImageUpload = (event) => {
    const file = event.target.files[0]

    const formData = new FormData()
    formData.append('file', file)

    axios
      .post('/admin/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => {
        // 서버에서 반환된 이미지 URL 사용
        setImage(response.data.uri)
      })
      .catch((error) => {
        console.error('Image upload error:', error)
        alert('이미지 업로드 중 오류가 발생했습니다.')
      })

  }

  const handleEditorChange = (name, content) => {
    console.log(name, content)
    setFormData({
      ...formData,
      [name]: content
    })
  }

  const handleSave = () => {
    // Check if all required fields are filled
    if (!formData.title || !formData.category || !formData.brand || !formData.maxEnroll || !formData.selectDate || !formData.enrollStartDate || !formData.enrollEndDate || !formData.missionStartDate || !formData.missionEndDate) {
      return alert('모든 필수 항목을 입력해주세요.')
    }
    // Check if thumbnail image is uploaded
    if (!image) {
      return alert('대표 이미지를 업로드해주세요.')
    }
    // Prepare data to be sent to the server
    const dataToSave = {
      ...formData,
      thumbnailImg: image
    }

    console.log(dataToSave)
    axios.post(`/admin/mission/${id ? id : 'new'}`, dataToSave, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        if (response.success) {
          alert('저장되었습니다.')
          window.location.reload()
        }
      })
      .catch(error => {
        console.error('Error:', error)
        alert('저장 중 오류가 발생했습니다.')
      })
  }

  return (
    <Fragment>
      <Card>
        <CardHeader>
          <CardTitle tag='h4'>기본 정보</CardTitle>
          <Button color='primary' onClick={handleSave}>저장</Button>
        </CardHeader>
        <CardBody>
          <Form>
            <div className='mb-1'>
              <h5>대표 이미지</h5>
              <Button style={{ padding: 0, border: 0 }} onClick={() => document.getElementById('imageUpload').click()}>
                <CardImg style={{ width: '150px', height: "150px" }} src={image} />
              </Button>
              <Input type='file' id='imageUpload' style={{ display: 'none' }} onChange={handleImageUpload} />
            </div>

            <Row className='mb-1'>
              <Col>
                <div className='mb-1'>
                  <h5>카테고리</h5>
                  <Input type='select' name='category' id='category' value={formData?.category} onChange={handleChange}>
                    <option value='beauty'>Beauty</option>
                    <option value='fashion'>Fashion</option>
                    <option value='food'>Food</option>
                    <option value='lifestyle'>Lifestyle</option>
                    <option value='kids'>Kids</option>
                    <option value='digital'>Digital</option>
                    <option value='books'>Books</option>
                    <option value='pets'>Pets</option>
                    <option value='sports'>Sports</option>
                    <option value='etc'>Etc</option>
                  </Input>
                </div>
              </Col>
              <Col>
                <div className='mb-1'>
                  <h5>타이틀</h5>
                  <Input type='text' name='title' id='title' value={formData?.title} onChange={handleChange} />
                </div>
              </Col>
              <Col>
                <div className='mb-1'>
                  <h5>브랜드</h5>
                  <Input type='text' name='brand' id='brand' value={formData?.brand} onChange={handleChange} />
                </div>
              </Col>
            </Row>
            <Row className='mb-1'>
              <Col>
                <div className='mb-1'>
                  <h5>제공 상세 정보</h5>
                  <Editor key="goodsContents" content={formData?.goodsContents} onChange={(content) => handleEditorChange('goodsContents', content)} />
                </div>
              </Col>
            </Row>

          </Form>
        </CardBody>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle tag='h4'>미션 정보</CardTitle>
        </CardHeader>
        <CardBody>
          <Form>
            <Row className='mb-1'>
              <Col>
                <div className='mb-1'>
                  <h5>SNS 유형</h5>
                  <div>
                    <Input className='me-1' type='radio' name='social' id='instagram' value='instagram' checked={formData?.social === 'instagram'} onChange={handleChange} />
                    <Label for='instagram' className='me-2'>인스타그램</Label>
                    <Input className='me-1' type='radio' name='social' id='tiktok' value='tiktok' checked={formData?.social === 'tiktok'} onChange={handleChange} />
                    <Label for='tiktok' className='me-2'>틱톡</Label>
                    <Input className='me-1' type='radio' name='social' id='youtube' value='youtube' checked={formData?.social === 'youtube'} onChange={handleChange} />
                    <Label for='youtube'>유튜브</Label>
                  </div>
                </div>
              </Col>
              <Col>
              </Col>
            </Row>

            <Row className='mb-1'>
              <Col>
                <div className='mb-1'>
                  <h5>최대 신청자 수</h5>
                  <div>
                    <Input type='number' name='maxEnroll' id='maxEnroll' value={formData?.maxEnroll} onChange={handleChange} />
                  </div>
                </div>
              </Col>
              <Col>
                <h5>선정 일자</h5>
                <Input type='date' name='selectDate' id='selectDate' value={formatDate(formData?.selectDate)} onChange={handleChange} />
              </Col>
            </Row>

            <Row className='mb-1'>
              <Col>
                <div className='mb-1'>
                  <h5>신청가능 일자</h5>
                  <Row>
                    <Col>
                      <Input type='date' name='enrollStartDate' id='enrollStartDate' value={formatDate(formData?.enrollStartDate)} onChange={handleChange} />
                    </Col>
                    <Col>
                      <Input type='date' name='enrollEndDate' id='enrollEndDate' value={formatDate(formData?.enrollEndDate)} onChange={handleChange} />
                    </Col>
                  </Row>
                </div>
              </Col>
              <Col>
                <div className='mb-1'>
                  <h5>미션수행 일자</h5>
                  <Row>
                    <Col>
                      <Input type='date' name='missionStartDate' id='missionStartDate' value={formatDate(formData?.missionStartDate)} onChange={handleChange} />
                    </Col>
                    <Col>
                      <Input type='date' name='missionEndDate' id='missionEndDate' value={formatDate(formData?.missionEndDate)} onChange={handleChange} />
                    </Col>
                  </Row>
                </div>
              </Col>
            </Row>

            <Row className='mb-1'>
              <Col>
                <div className='mb-1'>
                  <h5>미션 방법</h5>
                  <Editor key="missionContents" content={formData?.missionContents} onChange={(content) => handleEditorChange('missionContents', content)} />
                </div>
              </Col>
            </Row>

            <Row className='mb-1'>
              <Col>
                <div className='mb-1'>
                  <h5>주의 사항</h5>
                  <Editor key="caution" content={formData?.caution} onChange={(content) => handleEditorChange('caution', content)} />
                </div>
              </Col>
            </Row>

          </Form>
        </CardBody>
      </Card>
    </Fragment >
  )
}
export default HorizontalFormIcons
