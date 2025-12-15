import { useState, useEffect, useRef } from 'react'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import axios from 'axios'

import {
  ClassicEditor,
  AccessibilityHelp,
  Autoformat,
  AutoImage,
  Autosave,
  BlockQuote,
  Bold,
  Essentials,
  GeneralHtmlSupport,
  Heading,
  ImageBlock,
  ImageCaption,
  ImageInline,
  ImageInsert,
  ImageInsertViaUrl,
  ImageResize,
  ImageStyle,
  ImageTextAlternative,
  ImageToolbar,
  ImageUpload,
  Indent,
  IndentBlock,
  Italic,
  Link,
  LinkImage,
  List,
  ListProperties,
  Paragraph,
  SelectAll,
  SourceEditing,
  Table,
  TableCaption,
  TableCellProperties,
  TableColumnResize,
  TableProperties,
  TableToolbar,
  TextTransformation,
  TodoList,
  Underline,
  Undo,
  FontColor,
  FontBackgroundColor,
} from 'ckeditor5'
import translations from 'ckeditor5/translations/ko.js'
import 'ckeditor5/ckeditor5.css'
import './editor.css'

export default function App({ content, onChange }) {
  const editorContainerRef = useRef(null)
  const editorRef = useRef(null)
  const [isLayoutReady, setIsLayoutReady] = useState(false)
  const [mainContent, setMainContent] = useState('')

  useEffect(() => {
    setIsLayoutReady(true)
    return () => setIsLayoutReady(false)
  }, [])

  useEffect(() => {
    if (editorRef.current) {
      const editorInstance = editorRef.current.editorInstance
      if (editorInstance) {
        editorInstance.setData(content || '')
      }
    }
    setMainContent(content)
  }, [content])

  // Custom Upload Adapter
  function CustomUploadAdapter(loader) {
    this.loader = loader
  }

  CustomUploadAdapter.prototype.upload = function () {
    return this.loader.file.then((file) => {
      const formData = new FormData()
      formData.append('file', file)

      return axios
        .post('/admin/image', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then((response) => {
          // 서버에서 반환된 이미지 URL 사용
          return {
            default: response.data.uri,
          }
        })
        .catch((error) => {
          console.error('Image upload failed:', error)
          throw error
        })
    })
  }

  CustomUploadAdapter.prototype.abort = function () {
    // 업로드 취소 로직이 필요한 경우 구현
  }

  // Custom Adapter Plugin
  function CustomUploadAdapterPlugin(editor) {
    editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
      return new CustomUploadAdapter(loader)
    }
  }

  const editorConfig = {
    toolbar: {
      items: [
        'undo',
        'redo',
        '|',
        'sourceEditing',
        '|',
        'heading',
        '|',
        'bold',
        'italic',
        'underline',
        'fontColor',
        'fontBackgroundColor',
        '|',
        'link',
        'insertImage',
        'insertTable',
        'blockQuote',
        '|',
        'bulletedList',
        'numberedList',
        'todoList',
        'outdent',
        'indent',
      ],
      shouldNotGroupWhenFull: false,
    },
    plugins: [
      AccessibilityHelp,
      Autoformat,
      AutoImage,
      Autosave,
      BlockQuote,
      Bold,
      Essentials,
      GeneralHtmlSupport,
      Heading,
      ImageBlock,
      ImageCaption,
      ImageInline,
      ImageInsert,
      ImageInsertViaUrl,
      ImageResize,
      ImageStyle,
      ImageTextAlternative,
      ImageToolbar,
      ImageUpload,
      Indent,
      IndentBlock,
      Italic,
      Link,
      LinkImage,
      List,
      ListProperties,
      Paragraph,
      SelectAll,
      SourceEditing,
      Table,
      TableCaption,
      TableCellProperties,
      TableColumnResize,
      TableProperties,
      TableToolbar,
      TextTransformation,
      TodoList,
      Underline,
      Undo,
      FontColor,
      FontBackgroundColor,
    ],
    extraPlugins: [CustomUploadAdapterPlugin], // Custom Upload Adapter 추가
    image: {
      toolbar: [
        'imageStyle:alignLeft', // 왼쪽 정렬
        'imageStyle:alignCenter', // 가운데 정렬
        'imageStyle:alignRight', // 오른쪽 정렬
        '|',
        'toggleImageCaption',
        'imageTextAlternative',
        '|',
        'resizeImage', // 이미지 크기 조절
      ],
      styles: [
        'alignLeft', // 왼쪽 정렬 스타일
        'alignCenter', // 가운데 정렬 스타일
        'alignRight', // 오른쪽 정렬 스타일
      ],
    },
    language: 'ko',
    placeholder: '여기에 내용을 입력하세요',
  }

  return (
    <div>
      <div className="main-container">
        <div className="editor-container editor-container_classic-editor" ref={editorContainerRef}>
          <div className="editor-container__editor">
            <div ref={editorRef}>
              {isLayoutReady && (
                <CKEditor
                  editor={ClassicEditor}
                  config={editorConfig}
                  data={mainContent ?? ''}
                  onReady={(editor) => {
                    editorRef.current = editor
                  }}
                  onChange={(event, editor) => {
                    const data = editor.getData()
                    onChange(data)
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
