import { platform } from 'os'
import { toPairs } from 'ramda'
const examplePlugin = require('examplePlugin')
const context = examplePlugin(require('mockContext'))

import updateRequirement from '../../src/extensions/functions/updateRequirement'

jest.mock('../../src/extensions/functions/checkCLIForUpdates')
const checkCLIForUpdates = require('../../src/extensions/functions/checkCLIForUpdates')

// Seems weird that this is not used from what I can tell
const settings = {}
let spinner

test('updateRequirement exists', () => expect(updateRequirement).toMatchSnapshot())

describe('updateRequirement', () => {
  beforeEach(() => {
    spinner = {
      succeed: jest.fn(),
      stop: jest.fn(),
    }

    context.print = {
      spin: jest.fn(() => spinner),
      error: jest.fn(),
    }
  })

  test('updateRequirement empty still spins', async () => {
    const theVoid = await updateRequirement([], {}, context)
    expect(theVoid).toMatchSnapshot()
    expect(context.print.spin.mock.calls.length).toBe(1)
  })

  describe('given skipRule returns true', () => {
    it('returns an empty []', async () => {
      const requirement = toPairs({
        Yarn: [
          {
            rule: 'cli',
            binary: 'yarn',
            version: '--version',
            platform: 'windows',
            semver: '6.1.0',
          },
        ],
      })[0]

      const result = await updateRequirement(requirement, settings, context)
      expect(result).toEqual([[]])
    })
  })

  describe('without a semver returns', () => {
    it('returns an empty []', async () => {
      const requirement = toPairs({
        Yarn: [
          {
            rule: 'cli',
            binary: 'yarn',
            version: '--version',
          },
        ],
      })[0]

      const result = await updateRequirement(requirement, settings, context)
      expect(result).toEqual([[]])
    })
  })

  describe('given a rule', () => {
    describe('rule: cli', () => {
      afterEach(() => {
        checkCLIForUpdates.mockClear()
      })

      describe('when checkCLIForUpdates => true', () => {
        beforeEach(() => {
          checkCLIForUpdates.mockImplementation(() => Promise.resolve('Updated'))
        })

        it('returns the missing binary', async () => {
          const requirement = toPairs({
            Yarn: [
              {
                rule: 'cli',
                binary: 'yarn',
                version: '--version',
                semver: '1.1.0',
              },
            ],
          })[0]

          const result = await updateRequirement(requirement, settings, context)
          expect(result).toEqual(['Updated'])
          expect(spinner.succeed.mock.calls).toEqual([['Updated']])
        })
      })

      describe('when checkCLIForUpdates => false', () => {
        beforeEach(() => {
          checkCLIForUpdates.mockImplementation(() => false)
        })

        it('should return an empty array', async () => {
          const requirement = toPairs({
            Yarn: [
              {
                rule: 'cli',
                binary: 'yarn',
                version: '--version',
                semver: '1.1.0',
              },
            ],
          })[0]

          const result = await updateRequirement(requirement, settings, context)
          expect(result).toEqual([[]])
          expect(spinner.succeed.mock.calls).toEqual([['Keep yarn 1.1.0']])
        })
      })
    })

    describe('rule is custom', () => {
      it('returns stuff', async () => {
        const requirement = toPairs({
          TestRequirement: [{ rule: 'custom', plugin: 'Example Plugin', name: 'checkThing' }],
        })[0]

        const result = await updateRequirement(requirement, settings, context)
        expect(result).toEqual([["Setting checkThing 'semver' to '12.0.0'"]])
        expect(spinner.stop.mock.calls.length).toEqual(1)
      })
    })

    describe('rule: !== cli || custom', () => {
      it('returns an empty array', async () => {
        const requirement = toPairs({
          Yarn: [
            {
              rule: 'dir',
              location: './src',
            },
          ],
        })[0]

        const result = await updateRequirement(requirement, settings, context)
        expect(result).toEqual([[]])
        expect(spinner.stop.mock.calls.length).toEqual(1)
      })
    })
  })
})
