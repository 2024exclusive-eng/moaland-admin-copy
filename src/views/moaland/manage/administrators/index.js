import { useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import {
  Button,
  Input,
  Label,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Alert,
  Table,
  Badge,
  Spinner,
} from 'reactstrap'
import {
  adminErrorMessage,
  currentAdmin,
} from '../../../../utility/adminPermissions'
import './style.scss'
const empty = () => ({
  admin: '',
  name: '',
  companyName: '',
  contactEmail: '',
  role: 'advertiser',
  isActive: true,
  monthlyLimit: 3,
  password: '',
})
const kstOffset = 9 * 3600000
const thisMonth = () => new Date(Date.now() + kstOffset).toISOString().slice(0, 7)
export default function Administrators() {
  const [rows, setRows] = useState([]),
    [paging, setPaging] = useState({
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
    })
  const [page, setPage] = useState(1),
    [search, setSearch] = useState(''),
    [query, setQuery] = useState(''),
    [month, setMonth] = useState(thisMonth())
  const [loading, setLoading] = useState(true),
    [error, setError] = useState(''),
    [version, setVersion] = useState(0)
  const [form, setForm] = useState(null),
    [saving, setSaving] = useState(false),
    [formError, setFormError] = useState('')
  const load = useCallback(
    async (signal) => {
      setLoading(true)
      setError('')
      try {
        const result = await axios.get('/admin/accounts', {
          params: { page, search: query, month },
          signal,
        })
        if (!result.success) throw new Error(result.error?.msg || '목록을 불러오지 못했습니다.')
        setRows(result.data)
        setPaging(result.paging)
      } catch (e) {
        if (!axios.isCancel(e)) setError(adminErrorMessage(e))
      } finally {
        if (!signal.aborted) setLoading(false)
      }
    },
    [page, query, month, version]
  )
  useEffect(() => {
    const controller = new AbortController()
    load(controller.signal)
    return () => controller.abort()
  }, [load])
  const edit = (row) => {
    setForm(
      row ? {
            ...row,
            isActive: !!Number(row.isActive),
            monthlyLimit:
              row.monthlyLimit === null ? null : Number(row.monthlyLimit),
            password: '',
          } : empty()
    )
    setFormError('')
  }
  const change = (key, value) => setForm((prev) => ({ ...prev, [key]: value }))
  async function save(e) {
    e.preventDefault()
    setSaving(true)
    setFormError('')
    try {
      const payload = {
        ...form,
        monthlyLimit:
          form.monthlyLimit === null ? null : Number(form.monthlyLimit),
      }
      if (!payload.password) delete payload.password
      const result = form.id ? await axios.put(`/admin/accounts/${form.id}`, payload) : await axios.post('/admin/accounts', payload)
      if (!result.success) throw new Error(result.error?.msg || '저장하지 못했습니다.')
      setForm(null)
      setVersion((v) => v + 1)
    } catch (err) {
      setFormError(adminErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }
  const self = form?.id === currentAdmin().id
  return (
    <div className="administrator-management">
      <header className="administrator-header">
        <div>
          <h1>
            관리자 관리 <span>{paging.totalItems}명</span>
          </h1>
          <p>광고주 계정, 관리 권한과 월별 캠페인 등록 한도를 설정합니다.</p>
        </div>
        <Button color="primary" onClick={() => edit(null)}>
          관리자 등록
        </Button>
      </header>
      <div className="administrator-policy">
        <strong>월 등록 한도 안내</strong>
        <p>
          매월 1일 00:00 (한국 시간)부터 새 캠페인 등록 건수를 계산합니다.
          수정·담당자 변경은 차감하지 않으며, 삭제한 캠페인도 사용 건수에
          포함됩니다. 0회는 신규 등록 불가, 무제한은 횟수 제한 없음입니다.
        </p>
      </div>
      <section className="administrator-list" aria-label="관리자 목록">
        <form
          className="administrator-filters"
          onSubmit={(e) => {
            e.preventDefault()
            setPage(1)
            setQuery(search)
          }}
        >
          <div>
            <Label for="admin-search">관리자 검색</Label>
            <div className="d-flex gap-1">
              <Input
                id="admin-search"
                placeholder="아이디, 이름, 업체명"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button type="submit" color="secondary" outline>
                검색
              </Button>
            </div>
          </div>
          <div>
            <Label for="admin-month">등록 건수 조회 월</Label>
            <Input
              id="admin-month"
              type="month"
              value={month}
              onChange={(e) => {
                if (e.target.value) {
                  setMonth(e.target.value)
                  setPage(1)
                }
              }}
            />
          </div>
        </form>
        {error ? (
          <Alert color="danger">
            {error}{' '}
            <Button size="sm" onClick={() => setVersion((v) => v + 1)}>
              다시 시도
            </Button>
          </Alert>
        ) : loading ? (
          <div className="administrator-empty">
            <Spinner size="sm" /> 관리자 목록을 불러오는 중입니다.
          </div>
        ) : (
          <>
            <Table responsive>
              <thead>
                <tr>
                  <th>관리자 / 아이디</th>
                  <th>업체명</th>
                  <th>권한</th>
                  <th>상태</th>
                  <th>{month} 등록</th>
                  <th>현재 월 한도</th>
                  <th>관리</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id}>
                    <td>
                      <strong>{row.name}</strong>
                      <small>{row.admin}</small>
                    </td>
                    <td>{row.companyName || '—'}</td>
                    <td>
                      {row.role === 'super_admin' ? '슈퍼관리자' : '관리자 (광고주)'}
                    </td>
                    <td>
                      <Badge
                        color={
                          Number(row.isActive) ? 'light-success' : 'light-secondary'
                        }
                      >
                        {Number(row.isActive) ? '활성' : '이용 정지'}
                      </Badge>
                    </td>
                    <td>
                      <strong>{Number(row.used)}회</strong>
                    </td>
                    <td>
                      {row.monthlyLimit === null ? '무제한' : `${row.monthlyLimit}회`}
                    </td>
                    <td>
                      <Button
                        size="sm"
                        color="secondary"
                        outline
                        onClick={() => edit(row)}
                      >
                        수정
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            {!rows.length && (
              <div className="administrator-empty">
                검색 조건에 맞는 관리자가 없습니다.
              </div>
            )}
            <div className="administrator-pagination">
              <Button
                outline
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                이전
              </Button>
              <span>
                {page} / {paging.totalPages}
              </span>
              <Button
                outline
                disabled={page >= paging.totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                다음
              </Button>
            </div>
          </>
        )}
      </section>
      <Modal
        isOpen={!!form}
        toggle={() => {
          if (!saving) setForm(null)
        }}
        size="lg"
      >
        <form onSubmit={save}>
          <ModalHeader
            toggle={() => {
              if (!saving) setForm(null)
            }}
          >
            {form?.id ? '관리자 정보 수정' : '관리자 등록'}
          </ModalHeader>
          <ModalBody>
            {form && (
              <>
                <div className="administrator-form">
                  <div>
                    <Label for="account-login">로그인 아이디</Label>
                    <Input
                      id="account-login"
                      required
                      pattern="[a-zA-Z0-9._@-]{4,80}"
                      maxLength={80}
                      disabled={!!form.id || saving}
                      value={form.admin}
                      onChange={(e) => change('admin', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label for="account-name">담당자 이름</Label>
                    <Input
                      id="account-name"
                      required
                      maxLength={80}
                      disabled={saving}
                      value={form.name}
                      onChange={(e) => change('name', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label for="account-company">업체명</Label>
                    <Input
                      id="account-company"
                      maxLength={120}
                      disabled={saving}
                      value={form.companyName}
                      onChange={(e) => change('companyName', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label for="account-email">연락 이메일</Label>
                    <Input
                      id="account-email"
                      type="email"
                      maxLength={254}
                      disabled={saving}
                      value={form.contactEmail}
                      onChange={(e) => change('contactEmail', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label for="account-role">권한</Label>
                    <Input
                      id="account-role"
                      type="select"
                      disabled={self || saving}
                      value={form.role}
                      onChange={(e) => change('role', e.target.value)}
                    >
                      <option value="advertiser">관리자 (광고주)</option>
                      <option value="super_admin">슈퍼관리자</option>
                    </Input>
                  </div>
                  <div>
                    <Label for="account-status">계정 상태</Label>
                    <Input
                      id="account-status"
                      type="select"
                      disabled={self || saving}
                      value={form.isActive ? '1' : '0'}
                      onChange={(e) => change('isActive', e.target.value === '1')
                      }
                    >
                      <option value="1">활성</option>
                      <option value="0">이용 정지</option>
                    </Input>
                  </div>
                  {form.role === 'advertiser' && (
                    <div>
                      <Label for="account-limit">월 캠페인 등록 한도</Label>
                      <Input
                        id="account-limit"
                        type="number"
                        min="0"
                        max="100000"
                        step="1"
                        required={form.monthlyLimit !== null}
                        disabled={form.monthlyLimit === null || saving}
                        value={form.monthlyLimit ?? ''}
                        onChange={(e) => change('monthlyLimit', e.target.value)}
                      />
                      <Label check className="mt-1">
                        <Input
                          type="checkbox"
                          checked={form.monthlyLimit === null}
                          disabled={saving}
                          onChange={(e) => change('monthlyLimit', e.target.checked ? null : 3)
                          }
                        />{' '}
                        무제한
                      </Label>
                    </div>
                  )}
                  <div>
                    <Label for="account-password">
                      {form.id ? '비밀번호 재설정 (변경할 때만 입력)' : '초기 비밀번호'}
                    </Label>
                    <Input
                      id="account-password"
                      type="password"
                      autoComplete="new-password"
                      minLength={12}
                      maxLength={72}
                      required={!form.id}
                      disabled={saving}
                      value={form.password}
                      onChange={(e) => change('password', e.target.value)}
                    />
                    <small>12자 이상 입력해 주세요.</small>
                  </div>
                </div>
                <p className="mt-2 text-muted">
                  {form.role === 'super_admin' ? '슈퍼관리자는 전체 캠페인, 회원 정보 및 관리자 설정에 접근할 수 있습니다.' : '광고주 관리자는 본인 캠페인과 해당 신청자·선정자만 관리합니다.'}{' '}
                  권한·상태·비밀번호 변경 시 기존 로그인은 해제됩니다.
                </p>
                {form.id && (
                  <p className="text-muted">
                    한도 변경은 이번 달부터 적용되며, 이미 사용한 등록 횟수는
                    유지됩니다.
                  </p>
                )}
                {formError && (
                  <Alert color="danger" role="alert">
                    {formError}
                  </Alert>
                )}
              </>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              type="button"
              outline
              disabled={saving}
              onClick={() => setForm(null)}
            >
              취소
            </Button>
            <Button type="submit" color="primary" disabled={saving}>
              {saving ? '저장 중…' : '저장'}
            </Button>
          </ModalFooter>
        </form>
      </Modal>
    </div>
  )
}
