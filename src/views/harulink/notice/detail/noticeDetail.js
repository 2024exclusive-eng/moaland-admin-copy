import { useState, useEffect } from 'react'
import axios from 'axios'

// ** Reactstrap Imports
import { Card, CardHeader, CardTitle, CardBody, Input, Button } from 'reactstrap'
import { useParams } from 'react-router-dom'


const fetchData = async (id) => {
  try {
    const response = await axios.get(`/admin/notice/${id}`)
    return response.data
  } catch (error) {
    console.error('Error fetching data:', error)
    return []
  }
}

const TextareaDefault = () => {
  const { id } = useParams()
  const [data, setData] = useState({ title: "", contents: "" })

  useEffect(() => {
    if (id !== 'new') {
      const fetchInitialData = async () => {
        const result = await fetchData(id)
        setData(result)
      }
      fetchInitialData()
    }

  }, [])
  const handleChange = (e) => {
    const { name, value } = e.target
    setData((prevData) => ({
      ...prevData,
      [name]: value
    }))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle tag='h4'>공지사항</CardTitle>
      </CardHeader>

      <CardBody>
        <h5>제목</h5>
        <Input
          type='text'
          name='title'
          id='title'
          placeholder='제목을 입력하세요'
          value={data.title || ''}
          onChange={handleChange}
          className='mb-2'
        />

        <h5 className={"mt-1"}>콘텐츠</h5>
        <Input
          type='textarea'
          name='contents'
          id='contents'
          rows='3'
          placeholder='콘텐츠를 입력하세요'
          value={data.contents || ''}
          onChange={handleChange}
          className='mb-2'
        />
      </CardBody>
    </Card>
  )
}

export default TextareaDefault

