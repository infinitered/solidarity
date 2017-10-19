import skipRule from '../../src/extensions/functions/skipRule'

const currentPlatform = process.platform

test('skipRule takes a string', () => {
  expect(skipRule(currentPlatform)).toBe(false)
})

test('skipRule takes an array', () => {
  const arrayOfOne = [currentPlatform]
  expect(skipRule(arrayOfOne)).toBe(false)
  const arrayOfMore = [currentPlatform, 'nachos', 'tacos']
  expect(skipRule(arrayOfMore)).toBe(false)
})

test('skipRule false on unknown', () => {
  expect(skipRule({})).toBe(false)
})

test('skips on platform miss', () => {
  expect(skipRule('nachos')).toBe(true)
  expect(skipRule(['nachos'])).toBe(true)
  expect(skipRule(['nachos', 'tacos'])).toBe(true)
})
