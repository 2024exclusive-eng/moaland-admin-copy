// Shared constants for mission-related components

export const getRegionOptions = (counts = {}) => [
  { value: 'Seoul', label: '서울', count: counts.Seoul || 0 },
  { value: 'Busan', label: '부산', count: counts.Busan || 0 },
  { value: 'Jeju', label: '제주', count: counts.Jeju || 0 },
  { value: 'Other', label: '기타', count: counts.Other || 0 }
]

export const getCategoryOptions = (counts = {}) => [
  { value: 'restaurant', label: '맛집', count: counts.restaurant || 0 },
  { value: 'Hospital', label: '병원', count: counts.Hospital || 0 },
  { value: 'Beauty', label: '뷰티', count: counts.Beauty || 0 },
  { value: 'Culture', label: '문화', count: counts.Culture || 0 },
  { value: 'Stay', label: '숙박', count: counts.Stay || 0 },
  { value: 'Massage', label: '마사지', count: counts.Massage || 0 },
  { value: 'Others', label: '기타', count: counts.Others || 0 }
]

export const getMediaTypeOptions = (counts = {}) => [
  { value: 'Xiaohongshu', label: '샤오홍슈', count: counts.Xiaohongshu || 0 },
  { value: 'Douyin', label: '도우인', count: counts.Douyin || 0 },
  { value: 'Dajongdienping', label: '따종디엔핑', count: counts.Dajongdienping || 0 },
  { value: 'Instagram', label: '인스타', count: counts.Instagram || 0 },
  { value: 'YouTube', label: '유튜브', count: counts.YouTube || 0 }
]

// Helper functions to get label from value
export const getRegionLabel = (value) => {
  const option = getRegionOptions().find(opt => opt.value === value)
  return option ? option.label : value
}

export const getCategoryLabel = (value) => {
  const option = getCategoryOptions().find(opt => opt.value === value)
  return option ? option.label : value
}

export const getMediaTypeLabel = (value) => {
  const option = getMediaTypeOptions().find(opt => opt.value === value)
  return option ? option.label : value
}
