import { useEffect, useState } from 'react'
import axios from 'axios'
import { Input, Label } from 'reactstrap'
export default function WechatVisibility({ missionId, mission }) {
  const [enabled, setEnabled] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  useEffect(() => { setEnabled(!!Number(mission?.isWechatPublic)) }, [mission])
  const blocked = !missionId || missionId === 'new' || !mission || ['Hospital', 'Massage'].includes(mission.category)
  async function change(e) {
    const next = e.target.checked
    setBusy(true); setError('')
    try {
      const result = await axios.put(`/admin/mission/${missionId}/wechat`, { enabled: next })
      if (!result.success) throw new Error(result.error?.code || '저장 실패')
      setEnabled(next)
    } catch (e) {
      setError('위챗 노출 설정 실패: 콘텐츠 검사 또는 저장 상태를 확인해 주세요.')
    } finally {
      setBusy(false)
    }
  }
  return <div className='mb-2'>
    <Label check><Input type='switch' checked={enabled && !blocked} disabled={blocked || busy} onChange={change} /> 위챗 미니프로그램 노출</Label>
    <p className='text-muted mt-1'>저장된 중국어 제목·제공 내역을 검사한 뒤 노출합니다. 병원·마사지 카테고리는 제외됩니다.</p>
    {error && <p role='alert' className='text-danger'>{error}</p>}
  </div>
}
