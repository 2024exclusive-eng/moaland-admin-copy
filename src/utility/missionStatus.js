import moment from 'moment'

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
    // Use Korea timezone (UTC+9) for all date comparisons
    const now = moment().utcOffset(540) // 540 minutes = 9 hours
    const selectDate = mission.selectDate ? moment(mission.selectDate).utcOffset(540) : null
    const selectedCount = mission.selectedParticipantCount || 0
    const contentEnd = mission.contentEndDate ? moment(mission.contentEndDate).utcOffset(540) : null

    // CASE 1: waiting - when select_date is NULL OR current date < select_date
    if (!selectDate || now.isBefore(selectDate, 'day')) {
      return { label: '선정대기', color: '#111827', status: 'waiting' }
    }

    // CASE 2: selection_date - when select_date is NOT NULL AND current date = select_date
    if (selectDate && now.isSame(selectDate, 'day')) {
      return { label: '선정일', color: '#509594', status: 'selection_date' }
    }

    // CASE 3: completed - when select_date is NOT NULL AND content_end_date is NOT NULL
    // AND current date > select_date AND current date <= content_end_date
    // AND selected participants count > 0
    if (selectDate && contentEnd &&
        now.isAfter(selectDate, 'day') && now.isSameOrBefore(contentEnd, 'day') &&
        selectedCount > 0) {
      return { label: '선정완료', color: '#4CAF50', status: 'completed' }
    }

    // CASE 4: delayed - when select_date is NOT NULL AND content_end_date is NOT NULL
    // AND current date > select_date AND current date <= content_end_date
    // AND selected participants count = 0
    if (selectDate && contentEnd &&
        now.isAfter(selectDate, 'day') && now.isSameOrBefore(contentEnd, 'day') &&
        selectedCount === 0) {
      return { label: '선정지연', color: '#ea3a50', status: 'delayed' }
    }

    // CASE 5: selection_deadline - when content_end_date is NOT NULL AND current date > content_end_date
    if (contentEnd && now.isAfter(contentEnd, 'day')) {
      return { label: '선정마감', color: '#a5a5a5', status: 'selection_deadline' }
    }

    // Default: waiting
    return { label: '선정대기', color: '#111827', status: 'waiting' }
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
