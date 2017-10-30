import tempy from 'tempy'

import snapshotCommand from '../../src/commands/snapshot'
import solidarityExtension from '../../src/extensions/solidarity-extension'

const context = require('gluegun')

beforeAll(() => {
  context.prompt = {
    ask: jest.fn(
      () => Promise.resolve({ createFile: true })
    )
  },
  context.solidarity = {
    updateVersions: jest.fn(() => Promise.resolve())
  }

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

  it('should prompt the user', async() => {
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
})

