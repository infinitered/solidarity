import { ShellRule, SolidarityRunContext } from '../../src/types'
import { strings } from 'gluegun/toolbox'
const checkShell: any = require('../../src/extensions/functions/checkShell')

/**
 * Creates a mock gluegun environment in which `checkShell` runs.
 *
 * @param stdout The stdout to mock return
 * @param status The exit code to mock return (default: 0)
 */
const createContext = (stdout: string, status: number = 0) => ({
  system: {
    spawn: jest.fn().mockReturnValue(Promise.resolve({ stdout, status })),
  },
  strings,
})

let originalTimeout

describe('match', () => {
  beforeAll(() => {
    // These can be slow on CI
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 90000
  })

  afterAll(function() {
    // Fix timeout change
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout
  })

  describe('seamingly just a string', () => {
    const context = createContext('hi')
    it('matches exact', async () => {
      expect(await checkShell({ match: 'hi' }, context)).toBe(true)
    })

    it('detects no matches', async () => {
      expect(await checkShell({ match: 'bye' }, context)).toBe(false)
    })
  })

  describe('regexp basics', () => {
    const context = createContext("Wow, you don't look a day over 100!")

    it('finds matches', async () => {
      expect(await checkShell({ match: '100!$' }, context)).toBe(true)
    })

    it('detects no matches', async () => {
      expect(await checkShell({ match: '200!$' }, context)).toBe(false)
    })

    it('works with capture groups', async () => {
      expect(await checkShell({ match: '.*(look).*(100).*' }, context)).toBe(true)
    })
  })

  describe('capture group', () => {
    const context = createContext("Wow, you don't look a day over 100!")
    it('capture groups with ', async () => {
      expect(await checkShell({ match: '.*(look).*' }, context)).toBe(true)
    })
  })

  describe('crazy inputs', () => {
    const context = createContext('hi')
    const expectBadMatch = (input: any) => async () => {
      expect(await checkShell({ match: input }, context)).toBe(false)
    }

    test('null', expectBadMatch(null))
    test('undefined', expectBadMatch(undefined))
    test('number', expectBadMatch(69))
    test('boolean', expectBadMatch(true))
    test('object', expectBadMatch({ omg: 'lol' }))
    test('array', expectBadMatch([1, 2, 3]))
    test('function', expectBadMatch(() => '💩'))
  })
})
