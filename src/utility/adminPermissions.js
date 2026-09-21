export function currentAdmin() {
  try {
    return JSON.parse(localStorage.getItem('userData')) || {}
  } catch {
    return {}
  }
}
export const isSuperAdmin = () => currentAdmin().role === 'super_admin'
export const adminErrorMessage = (error) => error?.response?.data?.error?.msg ||
  error?.message ||
  '요청을 처리하지 못했습니다. 다시 시도해 주세요.'
export function filterAdminNavigation(items, role) {
  if (role === 'super_admin') return items
  return items
    .map((item) => ({
      ...item,
      children: item.children?.filter((child) => child.id === 'manageCampaign'),
    }))
    .filter((item) => item.children?.length)
}
