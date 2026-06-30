import { getSelectionStatus } from './missionStatus'

describe('getSelectionStatus (머릿수 3단계)', () => {
  test('선정됨 0명 → 선정대기', () => {
    const r = getSelectionStatus({ selectedParticipantCount: 0, appliedParticipantCount: 8 })
    expect(r.status).toBe('waiting')
    expect(r.label).toBe('선정대기')
  })
  test('선정됨 3명 + 미선정 5명 → 선정중', () => {
    const r = getSelectionStatus({ selectedParticipantCount: 3, appliedParticipantCount: 5 })
    expect(r.status).toBe('in_selection')
    expect(r.label).toBe('선정중')
  })
  test('선정됨 8명 + 미선정 0명 → 선정완료', () => {
    const r = getSelectionStatus({ selectedParticipantCount: 8, appliedParticipantCount: 0 })
    expect(r.status).toBe('completed')
    expect(r.label).toBe('선정완료')
  })
  test('신청 0건 → 선정대기', () => {
    const r = getSelectionStatus({ selectedParticipantCount: 0, appliedParticipantCount: 0 })
    expect(r.status).toBe('waiting')
  })
})
