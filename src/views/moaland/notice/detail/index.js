// ** React Imports
import { Fragment, useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'

// ** Reactstrap Imports
import { Row, Col, Button, Card, CardHeader, CardTitle, CardBody, Input } from 'reactstrap'

const fetchData = async (id) => {
  try {
    const response = await axios.get(`/admin/notice/${id}`)
    return response.data
  } catch (error) {
    console.error('Error fetching data:', error)
    return []
  }
}

const FormLayouts = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [data, setData] = useState({ title: '', titleCn: '', contents: '', contentsCn: '' })

  useEffect(() => {
    if (id !== 'new') {
      const fetchInitialData = async () => {
        const result = await fetchData(id)
        setData({
          title: result?.title || '',
          titleCn: result?.titleCn || '',
          contents: result?.contents || '',
          contentsCn: result?.contentsCn || ''
        })
      }
      fetchInitialData()
    }
  }, [id])

  const handleChange = (e) => {
    const { name, value } = e.target
    setData((prevData) => ({
      ...prevData,
      [name]: value
    }))
  }

  const handleSave = async () => {
    if (!data.title || !data.contents) {
      alert('제목과 콘텐츠를 모두 입력하세요.')
      return
    }

    try {
      await axios.post('/admin/notice', {
        title: data.title,
        titleCn: data.titleCn,
        contents: data.contents,
        contentsCn: data.contentsCn,
        id: id === 'new' ? null : id
      })
      alert('공지사항이 저장되었습니다.')
      navigate('/moaland/manage/community')
    } catch (error) {
      console.error('Error saving data:', error)
      alert('저장 중 오류가 발생했습니다.')
    }
  }

  const handleCancel = () => {
    navigate('/moaland/manage/community')
  }

  return (
    <Fragment>
      <div
        className="title-wrapper"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}
      >
        <h1 className="page-title">공지사항 등록</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Button
            color="light"
            onClick={handleCancel}
            style={{
              border: '1px solid #E5E7EB',
              background: 'white',
              borderRadius: '6px',
              height: '40px',
              whiteSpace: 'nowrap'
            }}
          >
            <span style={{ color: '#374151' }}>취소</span>
          </Button>
          <Button color="primary" onClick={handleSave}>
            등록 하기
          </Button>
        </div>
      </div>
      <Row>
        <Col md="12" sm="12">
          <Card>
            <CardHeader>
              <CardTitle tag='h4'>공지사항</CardTitle>
            </CardHeader>

            <CardBody>
              <Row className='mb-2'>
                <Col md={6}>
                  <h5>제목 (한국어)</h5>
                  <Input
                    type='text'
                    name='title'
                    id='title'
                    placeholder='제목을 입력하세요'
                    value={data?.title || ''}
                    onChange={handleChange}
                  />
                </Col>
                <Col md={6}>
                  <h5>제목 (중국어)</h5>
                  <Input
                    type='text'
                    name='titleCn'
                    id='titleCn'
                    placeholder='请输入标题'
                    value={data?.titleCn || ''}
                    onChange={handleChange}
                  />
                </Col>
              </Row>

              <Row className='mb-2'>
                <Col md={6}>
                  <h5>콘텐츠 (한국어)</h5>
                  <Input
                    type='textarea'
                    name='contents'
                    id='contents'
                    rows='5'
                    placeholder='콘텐츠를 입력하세요'
                    value={data?.contents || ''}
                    onChange={handleChange}
                  />
                </Col>
                <Col md={6}>
                  <h5>콘텐츠 (중국어)</h5>
                  <Input
                    type='textarea'
                    name='contentsCn'
                    id='contentsCn'
                    rows='5'
                    placeholder='请输入内容'
                    value={data?.contentsCn || ''}
                    onChange={handleChange}
                  />
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Fragment>
  )
}

export default FormLayouts
