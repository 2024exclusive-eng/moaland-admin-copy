import moment from 'moment'

export const getMissionEnrollmentStatus = (mission) => {
  const now = moment()
  const enrollStart = mission.enrollStartDate ? moment(mission.enrollStartDate) : null
  const enrollEnd = mission.enrollEndDate ? moment(mission.enrollEndDate) : null
  const selectDate = mission.selectDate ? moment(mission.selectDate) : null
  const missionStart = mission.missionStartDate ? moment(mission.missionStartDate) : null
  const missionEnd = mission.missionEndDate ? moment(mission.missionEndDate) : null
  const contentStart = mission.contentStartDate ? moment(mission.contentStartDate) : null
  const contentEnd = mission.contentEndDate ? moment(mission.contentEndDate) : null
 
  if (enrollStart && now.isBefore(enrollStart, 'day')) {
    return { label: '오픈예정', color: '#6C757D' }
  }

  if (enrollStart && enrollEnd &&
      now.isSameOrAfter(enrollStart, 'day') && now.isSameOrBefore(enrollEnd, 'day')) {
    return { label: '신청중', color: '#4CAF50' }
  }

  if (selectDate && now.isSame(selectDate, 'day')) {
    return { label: '신청마감', color: '#FF6B6B' }
  }

  if (missionStart && missionEnd &&
      now.isSameOrAfter(missionStart, 'day') && now.isSameOrBefore(missionEnd, 'day')) {
    return { label: '진행중', color: '#2196F3' }
  }

  if (contentStart && contentEnd &&
      now.isSameOrAfter(contentStart, 'day') && now.isSameOrBefore(contentEnd, 'day')) {
    return { label: '등록마감', color: '#FF9800' }
  }

  if ((contentEnd && now.isAfter(contentEnd, 'day')) || now.isAfter(enrollEnd, 'day')) {
    return { label: '종료', color: '#9E9E9E' }
  }

  return { label: '오픈예정', color: '#6C757D' }
}

export const getSelectionStatus = (mission) => {
  const now = moment()
  const selectDate = mission.selectDate ? moment(mission.selectDate) : null
  const selectedCount = mission.selectedParticipantCount || 0
  const enrollEnd = mission.enrollEndDate ? moment(mission.enrollEndDate) : null
  const contentEnd = mission.contentEndDate ? moment(mission.contentEndDate) : null

  if (now.isBefore(selectDate, 'day')) {
    return { label: '선정대기', color: '#111827' }
  }

  if (now.isSame(selectDate, 'day')) {
    return { label: '선정일', color: '#509594' }
  }

  if (now.isAfter(selectDate, 'day')) {
    if (selectedCount === 0) {
      return { label: '선정지연', color: '#ea3a50' }
    }

    if (now.isAfter(contentEnd, 'day') || now.isAfter(enrollEnd)) {
      return { label: '선정완료', color: '#a5a5a5' }
    }

    return { label: '완전한', color: '#a5a5a5' }
  }

  return { label: '선정일', color: '#111827' }
}

export const getStatusBadgeConfig = (status) => {
  const statusConfig = {
    opening_soon: { color: 'light-warning', text: '오픈예정' },
    applying: { color: 'light-primary', text: '신청중' },
    application_deadline: { color: 'light-info', text: '선정대기' },
    in_progress: { color: 'light-success', text: '선정완료' },
    registration_deadline: { color: 'light-success', text: '진행중' },
    end: { color: 'light-secondary', text: '종료' }
  }
  return statusConfig[status] || { color: 'light-secondary', text: status }
}
