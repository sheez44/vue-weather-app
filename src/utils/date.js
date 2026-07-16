export const getWeekday = (timestamp) => {
  const date = new Date(timestamp * 1000)

  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)

  // Compare just the date, not the time
  if (date.toDateString() === tomorrow.toDateString()) {
    return 'Tomorrow'
  }

  return date.toLocaleDateString('en-GB', {
    weekday: 'long',
  })
}
