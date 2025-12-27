import { DefaultRoute } from '../router/routes'

// ** Checks if an object is empty (returns boolean)
export const isObjEmpty = obj => Object.keys(obj).length === 0

// ** Returns K format from a number
export const kFormatter = num => (num > 999 ? `${(num / 1000).toFixed(1)}k` : num)

// ** Converts HTML to string
export const htmlToString = html => html.replace(/<\/?[^>]+(>|$)/g, '')

// ** Checks if the passed date is today
const isToday = date => {
  const today = new Date()
  return (
    /* eslint-disable operator-linebreak */
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
    /* eslint-enable */
  )
}

/**
 ** Format and return date in Humanize format
 ** Intl docs: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/format
 ** Intl Constructor: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat
 * @param {String} value date to format
 * @param {Object} formatting Intl object to format with
 */
export const formatDate = (value, formatting = { month: 'short', day: 'numeric', year: 'numeric' }) => {
  if (!value) return value
  return new Intl.DateTimeFormat('en-US', formatting).format(new Date(value))
}

// ** Returns short month of passed date
export const formatDateToMonthShort = (value, toTimeForCurrentDay = true) => {
  const date = new Date(value)
  let formatting = { month: 'short', day: 'numeric' }

  if (toTimeForCurrentDay && isToday(date)) {
    formatting = { hour: 'numeric', minute: 'numeric' }
  }

  return new Intl.DateTimeFormat('en-US', formatting).format(new Date(value))
}

/**
 ** Return if user is logged in
 ** This is completely up to you and how you want to store the token in your frontend application
 *  ? e.g. If you are using cookies to store the application please update this function
 */
export const isUserLoggedIn = () => localStorage.getItem('userData')
export const getUserData = () => JSON.parse(localStorage.getItem('userData'))

/**
 ** This function is used for demo purpose route navigation
 ** In real app you won't need this function because your app will navigate to same route for each users regardless of ability
 ** Please note role field is just for showing purpose it's not used by anything in frontend
 ** We are checking role just for ease
 * ? NOTE: If you have different pages to navigate based on user ability then this function can be useful. However, you need to update it.
 * @param {String} userRole Role of user
 */
export const getHomeRouteForLoggedInUser = userRole => {
  if (userRole === 'admin') return DefaultRoute
  if (userRole === 'client') return '/access-control'
  return '/harulink/auth/intro'
}

// ** React Select Theme Colors
export const selectThemeColors = theme => ({
  ...theme,
  colors: {
    ...theme.colors,
    primary25: '#F057831a', // for option hover bg-color
    primary: '#F05783', // for selected option bg-color
    neutral10: '#F05783', // for tags bg-color
    neutral20: '#ededed', // for input border-color
    neutral30: '#ededed' // for input hover border-color
  }
})

/**
 ** Normalizes URL by adding protocol if missing and removing www prefix
 ** Handles various URL formats like:
 * @param {String} url URL to normalize
 * @returns {String} Normalized URL with protocol and without www
 */
export const normalizeUrl = (url) => {
  if (!url || typeof url !== 'string') return ''

  let trimmedUrl = url.trim()
  if (!trimmedUrl) return ''

  // Check if URL already has a protocol
  if (/^https?:\/\//i.test(trimmedUrl)) {
    // Remove www. from the domain part
    return trimmedUrl.replace(/^(https?:\/\/)www\./i, '$1')
  }

  // Check if URL starts with '//' (protocol-relative URL)
  if (trimmedUrl.startsWith('//')) {
    trimmedUrl = `https:${trimmedUrl}`
    return trimmedUrl.replace(/^(https:\/\/)www\./i, '$1')
  }

  // Remove www. prefix if present
  trimmedUrl = trimmedUrl.replace(/^www\./i, '')

  console.log(trimmedUrl)

  // Add https:// for all other cases
  return `https://${trimmedUrl}`
}

/**
 ** Validates if a string is a valid URL
 * @param {String} url URL to validate
 * @returns {Boolean} True if valid URL
 */
export const isValidUrl = (url) => {
  if (!url || typeof url !== 'string') return false

  try {
    const normalizedUrl = normalizeUrl(url)
    const urlObject = new URL(normalizedUrl)
    return urlObject.protocol === 'http:' || urlObject.protocol === 'https:'
  } catch {
    return false
  }
}

/**
 ** Opens URL in new tab with security best practices
 ** Prevents tabnabbing attacks by setting opener to null
 * @param {String} url URL to open
 */
export const openUrlInNewTab = (url) => {
  if (!url) return

  console.log(url)
  const normalizedUrl = normalizeUrl(url)
  if (!isValidUrl(normalizedUrl)) {
    console.warn('Invalid URL:', url)
    return
  }


  const newWindow = window.open(normalizedUrl, '_blank', 'noopener,noreferrer')
  if (newWindow) newWindow.opener = null
}
