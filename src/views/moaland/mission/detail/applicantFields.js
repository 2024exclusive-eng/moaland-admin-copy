import moment from 'moment'

export const channelLabel = channel => {
 if (channel === 'wechat_mp') return '위챗 미니프로그램'
 if (channel === 'web') return '국내 웹'
 return '확인 불가'
}
export const visitLabel = value => (value && moment.utc(value).isValid() ? moment.utc(value).format('YYYY.MM.DD HH:mm') : '-')
const fieldKey = field => JSON.stringify([field.id, field.type, field.labelKo, field.labelZh])
const legacy = [
 {id:'name', label:'이름'}, {id:'instagram_link', label:'SNS 링크'},
 {id:'wechat_id', label:'위챗 아이디'}, {id:'visit_datetime_start', label:'방문 날짜 시간'}, {id:'memo', label:'메모'}
]
// Use saved submission snapshots so later edits/deletions never relabel old answers.
export function applicantColumns(users) {
 const columns = []
 const keys = new Set()
 users.forEach(user => (user.enrollmentForm?.fields || []).forEach(field => {
  const key = fieldKey(field)
  if (!keys.has(key)) { keys.add(key); columns.push({key, label:field.labelKo || field.labelZh, labelZh:field.labelZh, type:field.type}) }
 }))
 if (!users.length || users.some(user => !user.enrollmentForm)) {
  const mixed = users.some(user => user.enrollmentForm)
  legacy.forEach(field => columns.push({key:`legacy:${field.id}`, legacy:field.id, label:field.label + (mixed ? ' (기존)' : '')}))
 }
 return columns
}
export function applicantValue(user, column) {
 if (column.legacy) {
  if (user.enrollmentForm) return '-'
  return column.legacy === 'visit_datetime_start' ? visitLabel(user[column.legacy]) : (user[column.legacy] || '-')
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
