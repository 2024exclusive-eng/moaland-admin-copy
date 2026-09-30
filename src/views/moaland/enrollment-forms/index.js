import {useEffect, useState} from 'react'
import axios from 'axios'
import {Alert, Button, Card, CardBody, Input, Label} from 'reactstrap'
import {getCategoryOptions} from '../mission/constants'
import {isSuperAdmin} from '../../../utility/adminPermissions'
const types = {text:'한 줄 입력', textarea:'여러 줄 입력', number:'숫자', date:'날짜', url:'URL', select:'단일 선택', multi:'복수 선택'}
const key = prefix => `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
export default function EnrollmentForms() {
 const [channel, setChannel] = useState('web')
 const [category, setCategory] = useState('restaurant')
 const [fields, setFields] = useState([])
 const [version, setVersion] = useState(0)
 const [busy, setBusy] = useState(false)
 const [ready, setReady] = useState(false)
 const [dirty, setDirty] = useState(false)
 const [message, setMessage] = useState('')
 useEffect(() => {
  let current = true
  setBusy(true); setReady(false); setMessage('')
  if (!isSuperAdmin()) { setBusy(false); return () => { current = false } }
  axios.get(`/admin/enrollment-forms/${channel}/${category}`).then(r => {
   if (!current) return
   setFields(r.data?.fields || []); setVersion(r.data?.version || 0); setDirty(false); setReady(r.enabled === true)
   if (!r.enabled) setMessage('신청서 설정 기능이 아직 활성화되지 않았습니다.')
  }).catch(() => { if (current) setMessage('신청서 설정을 불러오지 못했습니다. 페이지를 다시 열어 주세요.') }).finally(() => { if (current) setBusy(false) })
  return () => { current = false }
 }, [channel, category])
 function update(id, value) { setFields(rows => rows.map(f => (f.id === id ? {...f, ...value} : f))); setDirty(true) }
 function change(setter, value) { if (!dirty || window.confirm('저장하지 않은 변경을 버리고 이동할까요?')) setter(value) }
 function move(index, direction) { const rows = [...fields]; const target = index + direction; if (target < 0 || target >= rows.length) return; [rows[index], rows[target]] = [rows[target], rows[index]]; setFields(rows); setDirty(true) }
 async function save() {
  setBusy(true); setMessage('')
  try { const r = await axios.put(`/admin/enrollment-forms/${channel}/${category}`, {version, fields}); setVersion(r.data.version); setFields(r.data.fields); setDirty(false); setMessage('저장했습니다. 이후 신청부터 적용되며 기존 답변은 유지됩니다.') } catch (e) { setMessage(e.response?.status === 409 ? '다른 관리자가 수정했습니다. 페이지를 다시 열어 최신 설정을 확인해 주세요.' : '저장하지 못했습니다. 한국어·중국어 항목명과 선택지를 모두 입력해 주세요.') } finally { setBusy(false) }
 }
 if (!isSuperAdmin()) return <Alert color="warning">슈퍼관리자만 신청 항목을 설정할 수 있습니다.</Alert>
 return <Card><CardBody>
  <h2>신청 항목 설정</h2><p>카테고리와 신청 경로별로 서로 다른 신청서를 만듭니다. 개인정보 동의는 별도로 유지됩니다.</p>
  <div className="d-flex gap-2 mb-2"><div><Label for="form-channel">신청 경로</Label><Input id="form-channel" type="select" value={channel} disabled={busy} onChange={e => change(setChannel, e.target.value)}><option value="web">국내 웹</option><option value="wechat_mp">위챗 미니프로그램</option></Input></div><div><Label for="form-category">카테고리</Label><Input id="form-category" type="select" value={category} disabled={busy} onChange={e => change(setCategory, e.target.value)}>{getCategoryOptions().map(o => <option key={o.value} value={o.value}>{o.label}</option>)}</Input></div></div>
  {message && <Alert color="info" role="status">{message}</Alert>}
  {ready && <><p>{version ? `저장 버전 ${version}` : '아직 설정이 없습니다. 저장 전까지 기존 신청서를 사용합니다.'} · 항목 {fields.length}/30</p>
  {fields.map((f, index) => <fieldset key={f.id} className="border rounded p-2 mb-2" disabled={busy}>
   <legend className="fs-5">항목 {index + 1}</legend>
   <div className="d-flex flex-wrap gap-2"><Label>입력 형식<Input type="select" value={f.type} onChange={e => update(f.id, {type:e.target.value, options:['select', 'multi'].includes(e.target.value) ? (f.options || [{id:key('o'), labelKo:'', labelZh:''}]) : undefined})}>{Object.entries(types).map(([id, label]) => <option key={id} value={id}>{label}</option>)}</Input></Label><Label>한국어 항목명<Input value={f.labelKo} maxLength={100} onChange={e => update(f.id, {labelKo:e.target.value})}/></Label><Label>중국어 항목명<Input value={f.labelZh} maxLength={100} onChange={e => update(f.id, {labelZh:e.target.value})}/></Label><Label check className="mt-2"><Input type="checkbox" checked={f.required} onChange={e => update(f.id, {required:e.target.checked})}/> 필수 입력</Label></div>
   {['select', 'multi'].includes(f.type) && <div className="mt-1">{(f.options || []).map((o, i) => <div className="d-flex gap-1 mb-1" key={o.id}><Input aria-label={`선택지 ${i + 1} 한국어`} placeholder="한국어 선택지" value={o.labelKo} onChange={e => update(f.id, {options:f.options.map(x => (x.id === o.id ? {...x, labelKo:e.target.value} : x))})}/><Input aria-label={`선택지 ${i + 1} 중국어`} placeholder="중국어 선택지" value={o.labelZh} onChange={e => update(f.id, {options:f.options.map(x => (x.id === o.id ? {...x, labelZh:e.target.value} : x))})}/><Button outline className="flex-shrink-0 text-nowrap" onClick={() => update(f.id, {options:f.options.filter(x => x.id !== o.id)})}>선택지 삭제</Button></div>)}<Button outline disabled={f.options?.length >= 30} onClick={() => update(f.id, {options:[...(f.options || []), {id:key('o'), labelKo:'', labelZh:''}]})}>선택지 추가</Button></div>}
   <div className="d-flex gap-1 mt-1"><Button outline disabled={!index} onClick={() => move(index, -1)}>위로</Button><Button outline disabled={index === fields.length - 1} onClick={() => move(index, 1)}>아래로</Button><Button outline color="danger" onClick={() => { setFields(rows => rows.filter(x => x.id !== f.id)); setDirty(true) }}>항목 삭제</Button></div>
  </fieldset>)}
  <div className="d-flex gap-1"><Button outline disabled={busy || fields.length >= 30} onClick={() => { setFields(rows => [...rows, {id:key('f'), type:'text', labelKo:'', labelZh:'', required:false}]); setDirty(true) }}>항목 추가</Button><Button color="primary" disabled={busy || !dirty} onClick={save}>신청 항목 저장</Button></div>
  {!fields.length && <p className="mt-1">빈 신청서를 저장하면 추가 질문 없이 동의 절차만 표시됩니다.</p>}
  <hr/><h4>한국어 / 중국어 미리보기</h4><div className="row">{['Ko', 'Zh'].map(lang => <div className="col-md-6" key={lang}>{fields.map(f => <div className="mb-1" key={f.id}><strong>{f[`label${lang}`] || '—'}{f.required ? ' *' : ''}</strong><div>{f.options?.map(o => o[`label${lang}`]).join(' / ') || types[f.type]}</div></div>)}</div>)}</div></>
  }
 </CardBody></Card>
}
