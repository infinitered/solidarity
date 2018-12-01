import skipRule from '../../src/extensions/functions/skipRule'

const currentPlatform = process.platform
const makeMockRulePlatform = platform => ({ platform })
const mockRuleBasic = makeMockRulePlatform(currentPlatform)
const mockRuleUppercase = makeMockRulePlatform(currentPlatform.toUpperCase())

test('skipRule takes a string', () => {
  expect(skipRule(mockRuleBasic)).toBe(false)
  expect(skipRule(mockRuleUppercase)).toBe(false)
  if (currentPlatform === 'darwin') {
    expect(skipRule(makeMockRulePlatform('macos'))).toBe(false)
  } else if (currentPlatform === 'win32') {
    expect(skipRule(makeMockRulePlatform('windows'))).toBe(false)
  }
})

test('skipRule takes an array', () => {
  const arrayOfOne = [currentPlatform]
  expect(skipRule(makeMockRulePlatform(arrayOfOne))).toBe(false)
  const arrayOfMore = [currentPlatform, 'nachos', 'tacos']
  expect(skipRule(makeMockRulePlatform(arrayOfMore))).toBe(false)
  if (currentPlatform === 'darwin') {
    expect(skipRule(makeMockRulePlatform(['macos', 'nachos', 'tacos']))).toBe(false)
  } else if (currentPlatform === 'win32') {
    expect(skipRule(makeMockRulePlatform(['windows', 'nachos', 'tacos']))).toBe(false)
  }
})

test('skipRule false on unknown', () => {
  expect(skipRule({})).toBe(false)
})

test('skips on platform miss', () => {
  expect(skipRule(makeMockRulePlatform('nachos'))).toBe(true)
  expect(skipRule(makeMockRulePlatform(['nachos']))).toBe(true)
  expect(skipRule(makeMockRulePlatform(['nachos', 'tacos']))).toBe(true)
})

test('skips CI when flagged', () => {
  const onCI = !!process.env.CI
  expect(skipRule({ ci: true })).toBe(false)
  expect(skipRule({})).toBe(false)
  expect(skipRule({ ci: false })).toBe(onCI)
})
