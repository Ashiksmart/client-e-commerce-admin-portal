// production
// const currentDomain = 'bas-mart.com'
// // const currentDomain = extractDomainWithoutSubdomains(window.location.hostname);
// const BASE_URL = `https://service.${currentDomain}`
// const BASE_URL_WOP = `https://${window.location.hostname}/accountimg`
// const AUTH_BASE_URL = `https://service.${currentDomain}`


//development
// const currentDomain = 'bas-mart.com'
// const BASE_URL = `https://service.${currentDomain}`
// const BASE_URL_WOP = `https://${currentDomain}/accountimg`
// const AUTH_BASE_URL = `https://service.${currentDomain}`

//local 
// const currentDomain = 'localhost'
// const BASE_URL = 'http://174.138.123.234:7004'
// const BASE_URL_WOP = 'http://174.138.123.234'
// const AUTH_BASE_URL = 'http://174.138.123.234:7004'

const currentDomain = 'localhost'
const BASE_URL = 'http://localhost:8001'
const BASE_URL_WOP = 'http://localhost'
const AUTH_BASE_URL = 'http://localhost:8000'

const Constants = {
  DOMAIN: currentDomain,
  BASE_URL: BASE_URL,
  AUTH_BASE_URL: AUTH_BASE_URL,
  BASE_URL_WOP: BASE_URL_WOP,
  CREATE_MODE: 'create',
  UPDATE_MODE: 'update',
  DELETE_MODE: 'delete',
  ACCOUNT_ID: "",
  OTP_EMAIL: 'email',
  OTP_PHONE: 'phone'
}

function extractDomainWithoutSubdomains(domains) {
  // Split the domain by dots and return the last part
  const parts = domains.split('.');
  return parts[parts.length - 2] + '.' + parts[parts.length - 1];
}

export default Constants;