import { useEffect, useState } from 'react'
import axios from 'axios'
import { Button, Input, Label, Alert } from 'reactstrap'
import {
  isSuperAdmin,
  adminErrorMessage,
} from '../../../../utility/adminPermissions'
export default function CampaignOwner({ missionId, ownerAdminId }) {
  const [rows, setRows] = useState([]),
    [owner, setOwner] = useState(String(ownerAdminId ?? '')),
    [search, setSearch] = useState(''),
    [query, setQuery] = useState(''),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(''),
    [saved, setSaved] = useState(false)
  const allowed = isSuperAdmin()
  useEffect(() => {
    setOwner(String(ownerAdminId ?? ''))
  }, [ownerAdminId])
  useEffect(() => {
    if (!allowed) return
    const c = new AbortController()
    axios
      .get('/admin/accounts', { params: { search: query }, signal: c.signal })
      .then((r) => setRows(r.data || []))
      .catch((e) => {
        if (!axios.isCancel(e)) setError(adminErrorMessage(e))
      })
    return () => c.abort()
  }, [query, allowed])
  if (!allowed) return null
  async function save() {
    setBusy(true)
    setError('')
    setSaved(false)
    try {
      const r = await axios.put(`/admin/mission/${missionId}/owner`, {
        ownerAdminId: owner ? Number(owner) : null,
      })
      if (!r.success) throw new Error('담당자를 저장하지 못했습니다.')
      setSaved(true)
    } catch (e) {
      setError(adminErrorMessage(e))
    } finally {
      setBusy(false)
    }
  }
  return (
    <section
      className="p-2 bg-white rounded border"
      aria-label="캠페인 담당 관리자"
    >
      <Label for="campaign-owner">담당 관리자</Label>
      <div className="d-flex flex-wrap gap-1">
        <Input
          aria-label="관리자 검색어"
          style={{ maxWidth: 240 }}
          placeholder="업체명 또는 아이디 검색"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button outline onClick={() => setQuery(search)}>
          검색
        </Button>
        <Input
          id="campaign-owner"
          style={{ maxWidth: 350 }}
          type="select"
          value={owner}
          disabled={busy}
          onChange={(e) => {
            setOwner(e.target.value)
            setSaved(false)
          }}
        >
          <option value="">미배정 (슈퍼관리자만 관리)</option>
          {owner && !rows.some((row) => String(row.id) === owner) && (
            <option value={owner}>현재 담당 관리자 #{owner}</option>
          )}
          {rows
            .filter((row) => Number(row.isActive) || String(row.id) === owner)
            .map((row) => (
              <option key={row.id} value={row.id}>
                {row.companyName || row.name} · {row.admin}
              </option>
            ))}
        </Input>
        <Button color="primary" disabled={busy} onClick={save}>
          {busy ? '저장 중…' : '담당자 저장'}
        </Button>
      </div>
      <small className="d-block mt-1 text-muted">
        담당자 변경은 월 등록 횟수를 차감하지 않습니다. 광고주에게 해당 캠페인과
        신청자 정보 접근 권한을 부여합니다.
      </small>
      {error && (
        <Alert color="danger" className="mt-1">
          {error}
        </Alert>
      )}
      {saved && (
        <p role="status" className="text-success mt-1 mb-0">
          담당자를 저장했습니다.
        </p>
      )}
    </section>
  )
}
