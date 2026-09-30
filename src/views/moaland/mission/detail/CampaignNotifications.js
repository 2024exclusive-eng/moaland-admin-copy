import {useState} from 'react'
import axios from 'axios'
import moment from 'moment'
import {Button, Input, Label, Alert, Table} from 'reactstrap'
const names = {application:'신청 완료', schedule:'일정 변경', approved:'승인', visit_3d:'방문 3일 전', visit_1d:'방문 1일 전', visit_1h:'방문 1시간 전', review:'리뷰 안내'}
const states = {pending:'예약', blocked:'설정/구독 필요', sent:'발송 완료', failed:'실패', uncertain:'결과 확인 필요', cancelled:'취소', expired:'기간 만료', sending:'발송 중'}
export default function CampaignNotifications({users}) {
  const [selected, setSelected] = useState('')
  const [date, setDate] = useState('')
  const [completed, setCompleted] = useState('')
  const [zone, setZone] = useState('Asia/Seoul')
  const [jobs, setJobs] = useState([])
  const [busy, setBusy] = useState(false)
  const [ready, setReady] = useState(false)
  const [message, setMessage] = useState('')
  async function load(id) {
    setSelected(id); setReady(false); setJobs([]); setMessage('')
    if (!id) return
    setBusy(true)
    try {
      const r = await axios.get(`/admin/notifications/visits/${id}`)
      const v = r.data.visit
      setZone(v.timezone)
      setDate(v.confirmed_visit_at ? moment(v.confirmed_visit_at).utcOffset(v.timezone === 'Asia/Shanghai' ? 480 : 540).format('YYYY-MM-DDTHH:mm') : '')
      setCompleted(v.completed_at ? moment(v.completed_at).utcOffset(v.timezone === 'Asia/Shanghai' ? 480 : 540).format('YYYY-MM-DDTHH:mm') : '')
      setJobs(r.data.jobs); setReady(true)
    } catch { setMessage('알림 설정이 아직 활성화되지 않았거나 조회할 수 없습니다.') } finally { setBusy(false) }
  }
  async function save() {
    setBusy(true); setMessage('')
    try {
      await axios.put(`/admin/notifications/visits/${selected}`, {confirmedVisitAt:date ? new Date(`${date}${zone === 'Asia/Shanghai' ? '+08:00' : '+09:00'}`).toISOString() : null, completedAt:completed ? new Date(`${completed}${zone === 'Asia/Shanghai' ? '+08:00' : '+09:00'}`).toISOString() : null, timezone:zone})
      await load(selected); setMessage('저장했습니다. 변경된 일정으로 알림을 다시 예약했습니다.')
    } catch { setMessage('저장하지 못했습니다. 방문 시각과 완료 시각을 확인해 주세요.') } finally { setBusy(false) }
  }
  return <section className="p-2 bg-white border rounded my-2" aria-label="위챗 알림 및 방문 일정">
    <h4>위챗 알림 · 방문 일정</h4>
    <p>알림은 위챗 구독 동의와 사용 가능한 템플릿이 있어야 발송됩니다. 리뷰 URL이 저장되면 남은 리뷰 알림이 중단됩니다.</p>
    <p>신청 완료·일정 변경은 기업위챗 그룹 봇으로 안내합니다. 발송 기능은 별도 활성화 전까지 꺼져 있습니다.</p>
    <Label for="notification-enrollment">신청자</Label>
    <Input id="notification-enrollment" type="select" value={selected} disabled={busy} onChange={e => load(e.target.value)}><option value="">신청자를 선택하세요</option>{users.map(u => <option key={u.missionEnrollId} value={u.missionEnrollId}>{u.name} · #{u.missionEnrollId}</option>)}</Input>
    {ready && <div className="mt-1">
      <Label for="visit-zone">방문 시간대</Label><Input id="visit-zone" type="select" value={zone} onChange={e => setZone(e.target.value)}><option value="Asia/Seoul">한국 (UTC+9)</option><option value="Asia/Shanghai">중국 (UTC+8)</option></Input>
      <Label for="visit-at" className="mt-1">확정 방문 시각</Label><Input id="visit-at" type="datetime-local" value={date} onChange={e => setDate(e.target.value)}/>
      <Label for="visit-completed" className="mt-1">실제 방문 완료 시각 (방문 후 입력)</Label><Input id="visit-completed" type="datetime-local" value={completed} onChange={e => setCompleted(e.target.value)}/>
      <Button className="my-1" color="primary" disabled={busy} onClick={save}>일정 저장</Button>
      <Table responsive><thead><tr><th>알림</th><th>예정 시각</th><th>상태</th></tr></thead><tbody>{jobs.map(j => <tr key={j.id}><td>{names[j.kind]}</td><td>{moment(j.due_at).utcOffset(zone === 'Asia/Shanghai' ? 480 : 540).format('YYYY-MM-DD HH:mm')}</td><td>{states[j.state] || j.state}</td></tr>)}</tbody></Table>
    </div>}
    {message && <Alert color="info" role="status">{message}</Alert>}
  </section>
}
