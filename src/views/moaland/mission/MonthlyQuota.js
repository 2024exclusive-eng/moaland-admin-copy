import { useEffect, useState } from 'react'
import axios from 'axios'
import { Alert, Button } from 'reactstrap'
import { adminErrorMessage } from '../../../utility/adminPermissions'
export default function MonthlyQuota({ onLoaded }) {
  const [data, setData] = useState(null),
    [error, setError] = useState(''),
    [version, setVersion] = useState(0)
  useEffect(() => {
    let active = true
    axios
      .get('/admin/accounts/me')
      .then((r) => {
        if (!r.success) throw new Error('등록 한도를 확인하지 못했습니다.')
        if (active) {
          setData(r.data)
          setError('')
          onLoaded?.(r.data)
        }
      })
      .catch((e) => {
        if (active) setError(adminErrorMessage(e))
      })
    return () => {
      active = false
    }
  }, [version, onLoaded])
  if (error) return (
      <Alert color="danger">
        {error}{' '}
        <Button size="sm" onClick={() => setVersion((v) => v + 1)}>
          다시 확인
        </Button>
      </Alert>
    )
  if (!data) return <p className="text-muted">이번 달 등록 한도를 확인하고 있습니다…</p>
  if (data.role === 'super_admin') return null
  const u = data.usage
  return (
    <Alert color={u.remaining === 0 ? 'warning' : 'light'}>
      <strong>
        {u.month} 캠페인 등록 {u.used} /{' '}
        {u.limit === null ? '무제한' : `${u.limit}회`}
      </strong>
      {u.remaining !== null && (
        <span className="ms-2">남은 등록 {u.remaining}회</span>
      )}
      <div className="mt-1">
        매월 1일 한국 시간 기준 · 수정은 차감되지 않으며 삭제해도 등록 횟수는
        복구되지 않습니다.
      </div>
    </Alert>
  )
}
