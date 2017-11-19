import tempy from 'tempy'

import snapshotCommand from '../../src/commands/snapshot'
import setSolidaritySettings from '../../src/extensions/functions/setSolidaritySettings'
import solidarityExtension from '../../src/extensions/solidarity-extension'


import context from 'gluegun'

const requirements = () => {
  return JSON.parse(context.filesystem.read('.solidarity')).requirements
}

beforeAll(() => {
  context.prompt = {
    ask: jest.fn(
      () => Promise.resolve({ createFile: true })
    )
  }

  context.solidarity = {
    updateVersions: jest.fn(() => Promise.resolve())
  }
  context.parameters = {}
  context.printSeparator = jest.fn()
  context._pluginsList = []
})

test('Snapshot check snapshot command', () => {
  expect(snapshotCommand).toMatchSnapshot()
})

it('enforces required properties', () => {
  expect(snapshotCommand.description).toBeTruthy()
  expect(snapshotCommand.run).toBeTruthy()
  expect(typeof snapshotCommand.run).toBe('function')
})

describe('without a .solidarity file', () => {
  const origCwd = process.cwd()

  beforeEach(() => {
    const tempDir = tempy.directory()
    process.chdir(tempDir)
  })

  afterAll(() => {
    process.chdir(origCwd)
  })

  it('should prompt the user', async () => {
    await snapshotCommand.run(context)
    expect(context.prompt.ask.mock.calls).toEqual(
      [[{
        message: "No `.solidarity` file found for this project.  Would you like to create one?",
        name: "createFile",
        type: "confirm"
      }]]
    )
  })
})

describe('with a .solidarity file', () => {
  it('should attempt to update existing .snapshot file', async () => {
    const restult = await snapshotCommand.run(context)
    expect(context.solidarity.updateVersions.mock.calls.length).toEqual(1)
    expect(context.solidarity.updateVersions.mock.calls).toEqual([[context]])
  })

  describe('given a new rule to add', () => {
    const origCwd = process.cwd();
    const settings = {
      requirements: {

      }
    }

    beforeAll(() => {
      const tempDir = tempy.directory()
      process.chdir(tempDir)
      setSolidaritySettings(settings, context)
      console.log(tempDir);
    })

    afterAll(() => {
      process.chdir(origCwd)
    })

    describe('give a cli rule', () => {
      beforeEach(() => {
        solidarityExtension(context);

        context.parameters = {
          plugin: 'solidarity',
          command: 'snapshot',
          first: 'cli',
          second: 'yarn',
          third: undefined,
          raw: 'cli yarn',
          string: 'cli yarn',
          array: [ 'cli', 'yarn' ],
          options: {},
          argv: [ 'snapshot', 'cli', 'yarn' ]
        }

        context.prompt = {
          ask: jest.fn(
            () => Promise.resolve({ addNewRule: true })
          )
        }
      })

      it('handles a binary without a version', async () => {
        expect(requirements()).toEqual({})

        const result = await snapshotCommand.run(context);
        expect(context.prompt.ask.mock.calls).toEqual([
          [{
            message: "Would you like to add the binary 'yarn' to your Solidarity file?",
            name: "addNewRule",
            type: "confirm"
          }],
          [{
            message: "Would you like to enforce a version requirement?",
            name: "enforceVersion",
            type: "confirm"
          }]
        ])
        expect(requirements().yarn).toBeTruthy()
      })

      // it('handles a binary with a version', () => {

      // })
    })
  })
})

