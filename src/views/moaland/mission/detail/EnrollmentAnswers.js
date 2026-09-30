import {useRef, useState} from 'react'
import axios from 'axios'
import {Alert, Input, Label, Table} from 'reactstrap'
export default function EnrollmentAnswers({users}) {
 const [value, setValue] = useState('')
 const [answer, setAnswer] = useState(null)
 const [message, setMessage] = useState('')
 const sequence = useRef(0)
 async function load(id) { const current = ++sequence.current; setValue(id); setAnswer(null); setMessage(''); if (!id) return; try { const r = await axios.get(`/admin/enrollment-forms/answers/${id}`); if (sequence.current !== current) return; setAnswer(r.data); if (!r.data) setMessage('이 신청은 기존 고정 신청서로 접수되어 추가 답변이 없습니다.') } catch { if (sequence.current === current) setMessage('답변을 불러오지 못했습니다.') } }
 function display(f) { const v = answer.answers[f.id]; if (v === undefined) return '—'; const items = Array.isArray(v) ? v : [v]; return items.map(x => { const o = f.options?.find(option => option.id === x); return o ? `${o.labelKo} / ${o.labelZh}` : x }).join(', ') }
 return <section className="p-2 border rounded my-2" aria-label="신청 항목 답변"><h4>신청 항목 답변</h4><Label for="answer-enrollment">신청자</Label><Input id="answer-enrollment" type="select" value={value} onChange={e => load(e.target.value)}><option value="">신청자를 선택하세요</option>{users.map(u => <option key={u.missionEnrollId} value={u.missionEnrollId}>{u.name || '신청자'} · #{u.missionEnrollId}</option>)}</Input>{message && <Alert className="mt-1">{message}</Alert>}{answer && <><p className="mt-1">접수 당시 신청서 · {answer.channel === 'web' ? '국내 웹' : '위챗 미니프로그램'} · 버전 {answer.version}</p><Table responsive><thead><tr><th>항목 (한국어 / 중국어)</th><th>답변</th></tr></thead><tbody>{answer.snapshot.map(f => <tr key={f.id}><td>{f.labelKo} / {f.labelZh}</td><td style={{whiteSpace:'pre-wrap'}}>{display(f)}</td></tr>)}</tbody></Table></>}</section>
}
