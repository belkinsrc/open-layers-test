function setItem(key: string, value: string): void {
  try {
    window.sessionStorage.setItem(key, value)
  } catch (err) {
    console.error('Failed to write the data: ' + err)
  }
}

function getItem(key: string): string | null {
  try {
    return window.sessionStorage.getItem(key)
  } catch (err) {
    console.error('Failed to recieve the data: ' + err)
    return null
  }
}

export default {
  setItem,
  getItem
}