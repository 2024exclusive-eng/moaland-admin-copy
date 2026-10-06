import {applicantValue, channelLabel} from './applicantFields'
import AnswerText from './AnswerText'

export function ApplicantHeaders({columns}) {
 return <><th>No</th><th>가입 메일주소</th><th>신청 경로</th>{columns.map(column => <th key={column.key}>{column.label}{column.labelZh && column.labelZh !== column.label && <small className="d-block mt-25">{column.labelZh}</small>}</th>)}</>
}
export function ApplicantCells({user, index, columns}) {
 return <><td>{index + 1}</td><td>{user.email || '-'}</td><td className="text-nowrap">{channelLabel(user.channel)}</td>{columns.map(column => {
  const value = applicantValue(user, column)
  return <td key={column.key} style={{whiteSpace:'pre-wrap', minWidth:140, maxWidth:320, overflowWrap:'anywhere'}}><AnswerText value={value}/></td>
 })}</>
}
