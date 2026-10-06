import moment from 'moment'

export const channelLabel = channel => {
 if (channel === 'wechat_mp') return '위챗 미니프로그램'
 if (channel === 'web') return '국내 웹'
 return '확인 불가'
}
export const visitLabel = value => (value && moment.utc(value).isValid() ? moment.utc(value).format('YYYY.MM.DD HH:mm') : '-')
const fieldKey = field => JSON.stringify([field.id, field.type])
const legacy = [
 {id:'name', label:'이름'}, {id:'instagram_link', label:'SNS 링크'},
 {id:'wechat_id', label:'위챗 아이디'}, {id:'visit_datetime_start', label:'방문 날짜 시간'}, {id:'memo', label:'메모'}
]
const normalized = value => (value || '').toLowerCase().replace(/\([^)]*\)|（[^）]*）/g, '').replace(/[\s_·/]/g, '')
export function legacyField(field, social = '') {
 const labels = [normalized(field.labelKo), normalized(field.labelZh)]
 const aliases = {
  name:['성함', '이름', '성명', '姓名', '名字', 'name'],
  wechat_id:['위챗아이디', '위쳇아이디', '위챗id', '微信号', '微信id', 'wechatid'],
  visit_datetime_start:['방문날짜시간', '방문일및시간', '방문일시', '방문희망일시', '到访时间', '访问时间'],
  visit_date:['방문날짜', '방문일', '探店日期'],
  visit_time:['방문시간', '探店时间'],
  memo:['메모', '비고', '备注'],
  instagram_link:['sns링크', 'snslink', '社交媒体链接']
 }
 for (const [key, values] of Object.entries(aliases)) if (labels.some(label => values.includes(label))) return key
 const platforms = {Xiaohongshu:['샤오홍슈링크', '小红书链接'], Instagram:['인스타그램링크', '인스타링크', 'instagram链接'], Douyin:['도우인링크', '抖音链接']}
 const active = social.split(',').map(x => x.trim())
 if (active.length === 1 && labels.some(label => platforms[active[0]]?.includes(label))) return 'instagram_link'
 return null
}
export function applicantName(user) {
 const field = user.enrollmentForm?.fields.find(item => legacyField(item) === 'name')
 const value = field && user.enrollmentForm.answers[field.id]
 return (typeof value === 'string' && value.trim()) || user.name || '성함 미기재'
}
// Use saved submission snapshots so later edits/deletions never relabel old answers.
export function applicantColumns(users, currentFields = [], social = '') {
 const columns = []
 const keys = new Set()
 const add = field => {
  const key = fieldKey(field)
  if (!keys.has(key)) { keys.add(key); columns.push({key, label:field.labelKo || field.labelZh, labelZh:field.labelZh, type:field.type}) }
 }
 currentFields.forEach(add)
 users.forEach(user => (user.enrollmentForm?.fields || []).forEach(add))
 const candidates = [...currentFields, ...users.flatMap(user => user.enrollmentForm?.fields || [])]
 // Map a legacy column only when its meaning has one unambiguous matching question.
 const mapped = new Set()
 const sources = [...legacy, {id:'visit_date'}, {id:'visit_time'}]
 sources.forEach(old => {
  const matches = columns.filter(column => candidates.some(field => fieldKey(field) === column.key && legacyField(field, social) === old.id))
  if (matches.length === 1) { matches[0].legacyFallback = old.id; mapped.add(old.id) }
 })
 if (mapped.has('visit_date') && mapped.has('visit_time')) mapped.add('visit_datetime_start')
 if (!users.length || users.some(user => !user.enrollmentForm)) {
  legacy.filter(field => !mapped.has(field.id)).forEach(field => columns.push({key:`legacy:${field.id}`, legacy:field.id, label:field.label}))
 }
 return columns
}
export function applicantValue(user, column) {
 const legacyKey = column.legacy || (!user.enrollmentForm && column.legacyFallback)
 if (legacyKey) {
  if (user.enrollmentForm) return '-'
  if (legacyKey === 'visit_date' || legacyKey === 'visit_time') {
   const value = user.visit_datetime_start
   return value && moment.utc(value).isValid() ? moment.utc(value).format(legacyKey === 'visit_date' ? 'YYYY.MM.DD' : 'HH:mm') : '-'
  }
  return legacyKey === 'visit_datetime_start' ? visitLabel(user[legacyKey]) : (user[legacyKey] || '-')
 }
 const form = user.enrollmentForm
 const field = form?.fields.find(item => fieldKey(item) === column.key)
 if (!field) return '-'
 const value = form.answers[field.id]
 if (value === null || value === undefined || value === '' || (Array.isArray(value) && !value.length)) return '-'
 return (Array.isArray(value) ? value : [value]).map(item => {
  const option = field.options?.find(choice => choice.id === item)
  return option ? (option.labelKo || option.labelZh) : String(item)
 }).join(', ')
}
export function applicantExcel(users, columns, extra) {
 // Unique headers prevent duplicate question titles from overwriting answers.
 const used = new Set(['No', '가입 메일주소', '신청 경로', '상태', '등록한 콘텐츠', '검수상태'])
 const headers = columns.map(column => {
  let header = column.label
  let suffix = 2
  while (used.has(header)) header = `${column.label} (${suffix++})`
  used.add(header)
  return header
 })
 return users.map((user, index) => ({No:index + 1, '가입 메일주소':user.email || '-', '신청 경로':channelLabel(user.channel), ...Object.fromEntries(columns.map((column, i) => [headers[i], applicantValue(user, column)])), ...extra(user)}))
}
