export const config = {
  apiPort: process.env.API_PORT || '',
  apiUrl: process.env.API_URL || '',
}

if (!config.apiUrl) {
  const protocol = window.location.protocol
  const hostname = window.location.hostname
  const port = config.apiPort || window.location.port === '1234' ? '3001' : window.location.port
  config.apiUrl = `${protocol}//${hostname}:${port}`
}
