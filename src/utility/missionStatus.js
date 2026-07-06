import moment from 'moment'

/**
 * @deprecated 클라이언트 재계산 금지. 선정대기(application_deadline) 기준이 backend
 * computed_status(window 기반, 선정지연 예외 포함)와 어긋남. 상태 표시는 API가 내려주는
 * col.computed_status + getStatusBadgeConfig() 를 사용할 것.
 */
export const getMissionEnrollmentStatus = (mission) => {
    // Use Korea timezone (UTC+9) for all date comparisons
    const now = moment().utcOffset(540) // 540 minutes = 9 hours
    const enrollStart = mission.enrollStartDate ? moment(mission.enrollStartDate).utcOffset(540) : null
    const enrollEnd = mission.enrollEndDate ? moment(mission.enrollEndDate).utcOffset(540) : null
    const selectDate = mission.selectDate ? moment(mission.selectDate).utcOffset(540) : null
    const missionStart = mission.missionStartDate ? moment(mission.missionStartDate).utcOffset(540) : null
    const missionEnd = mission.missionEndDate ? moment(mission.missionEndDate).utcOffset(540) : null
    const contentStart = mission.contentStartDate ? moment(mission.contentStartDate).utcOffset(540) : null
    const contentEnd = mission.contentEndDate ? moment(mission.contentEndDate).utcOffset(540) : null

    // CASE 1: opening_soon - when current date is before enroll_start_date
    if (enrollStart && now.isBefore(enrollStart, 'day')) {
      return { label: '오픈예정', color: '#6C757D', status: 'opening_soon' }
    }

    // CASE 2: applying - when current date is between enroll_start_date and enroll_end_date
    if (enrollStart && enrollEnd &&
        now.isSameOrAfter(enrollStart, 'day') && now.isSameOrBefore(enrollEnd, 'day')) {
      return { label: '신청중', color: '#4CAF50', status: 'applying' }
    }

    const isProgress = missionStart && missionEnd &&
        now.isSameOrAfter(missionStart, 'day') && now.isSameOrBefore(missionEnd, 'day')

    // CASE 3: application_deadline - when current date equals select_date
    if (selectDate && now.isSame(selectDate, 'day') && !isProgress) {
      return { label: '선정대기', color: '#FF9800', status: 'application_deadline' }
    }

    // CASE 4: in_progress - when current date is between mission_start_date and mission_end_date
    if (isProgress) {
      return { label: '진행중', color: '#2196F3', status: 'in_progress' }
    }

    // CASE 5: registration_deadline - when current date is between content_start_date and content_end_date
    if (contentStart && contentEnd &&
        now.isSameOrAfter(contentStart, 'day') && now.isSameOrBefore(contentEnd, 'day')) {
      return { label: '선정완료', color: '#4CAF50', status: 'registration_deadline' }
    }

    // CASE 6: end - when current date is after both content_end_date and enroll_end_date
    if (contentEnd && enrollEnd && now.isAfter(contentEnd, 'day') && now.isAfter(enrollEnd, 'day')) {
      return { label: '종료', color: '#9E9E9E', status: 'end' }
    }

    // Default: opening_soon
    return { label: '오픈예정', color: '#6C757D', status: 'opening_soon' }
  }

  export const getSelectionStatus = (mission) => {
    const selectedCount = mission.selectedParticipantCount || 0
    const appliedCount = mission.appliedParticipantCount || 0

    // 선정대기: 아무도 선정 안 함
    if (selectedCount === 0) {
      return { label: '선정대기', color: '#111827', status: 'waiting' }
    }
    // 선정완료: 미선정(대기) 신청자 없음 = 전원 선정/처리
    if (appliedCount === 0) {
      return { label: '선정완료', color: '#4CAF50', status: 'completed' }
    }
    // 선정중: 일부 선정
    return { label: '선정중', color: '#2196F3', status: 'in_selection' }
  }

export const getStatusBadgeConfig = (status) => {
  const statusConfig = {
    opening_soon: { color: 'light-warning', text: '오픈예정' },
    applying: { color: 'light-primary', text: '신청중' },
    application_deadline: { color: 'light-info', text: '선정대기' },
    in_progress: { color: 'light-success', text: '진행중' },
    registration_deadline: { color: 'light-success', text: '선정완료' },
    end: { color: 'light-secondary', text: '종료' }
  }
  return statusConfig[status] || { color: 'light-secondary', text: status }
}
