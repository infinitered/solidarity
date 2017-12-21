import tempy from 'tempy'

import snapshotCommand from '../../src/commands/snapshot'
import setSolidaritySettings from '../../src/extensions/functions/setSolidaritySettings'
import solidarityExtension from '../../src/extensions/solidarity-extension'

const context = require('mockContext')

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

    beforeEach(() => {
      // enhance
      solidarityExtension(context)

      // setup .solidarity file in temp directory
      const tempDir = tempy.directory()
      process.chdir(tempDir)
      setSolidaritySettings(settings, context)
    })

    afterAll(() => {
      process.chdir(origCwd)
    })

    it('should work if given an incomplete rule ', async () => {
      expect(requirements()).toEqual({})

      const mockedPrompt = jest.fn()
        .mockImplementationOnce(() => Promise.resolve({ whatRule: 'ruby' }))
        .mockImplementationOnce(() => Promise.resolve({ addNewRule: true }))
        .mockImplementationOnce(() => Promise.resolve({ makeNewRequirement: true }))
        .mockImplementationOnce(() => Promise.resolve({
          newRequirement: 'Testorson'
        }))
        .mockImplementationOnce(() => Promise.resolve({ enforceVersion: false }))

      context.prompt = {
        ask: mockedPrompt
      }

      context.print = {
        error: jest.fn(),
        info: jest.fn()
      }

      context.parameters = {
        plugin: 'solidarity',
        command: 'snapshot',
        first: 'cli',
        raw: 'cli',
        string: 'cli',
        array: [ 'cli'],
        options: {},
        argv: [ 'snapshot', 'cli']
      }

      const result = await snapshotCommand.run(context)
      expect(context.prompt.ask.mock.calls).toMatchSnapshot()
      expect(requirements().Testorson).toBeTruthy()
    })

    describe('given an cli rule', () => {
      beforeEach(() => {
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

        const mockedPrompt = jest.fn()
          .mockImplementationOnce(() => Promise.resolve({ addNewRule: true }))
          .mockImplementationOnce(() => Promise.resolve({ makeNewRequirement: true }))
          .mockImplementationOnce(() => Promise.resolve({
            newRequirement: 'Testorson'
          }))
          .mockImplementationOnce(() => Promise.resolve({ enforceVersion: false }))

        context.prompt = {
          ask: mockedPrompt
        }

        context.print = {
          error: jest.fn(),
          info: jest.fn()
        }
      })

      it('handles a binary enforceVersion: false', async () => {
        expect(requirements()).toEqual({})

        const result = await snapshotCommand.run(context)
        expect(context.prompt.ask.mock.calls).toMatchSnapshot()
        expect(requirements().Testorson).toBeTruthy()
        expect(requirements().Testorson.semver).toBeFalsy()
      })

      it('handles a binary with enforceVersion: true', async () => {
        const mockedPrompt = jest.fn()
          .mockImplementationOnce(() => Promise.resolve({ addNewRule: true }))
          .mockImplementationOnce(() => Promise.resolve({ makeNewRequirement: true }))
          .mockImplementationOnce(() => Promise.resolve({
            newRequirement: 'Testorson'
          }))
          .mockImplementationOnce(() => Promise.resolve({ enforceVersion: true }))

        context.prompt = {
          ask: mockedPrompt
        }

        context.system = {
          run: jest.fn(() => Promise.resolve('1.3.2'))
        }

        expect(requirements()).toEqual({})

        const result = await snapshotCommand.run(context)

        expect(context.prompt.ask.mock.calls).toMatchSnapshot()
        expect(requirements().Testorson).toBeTruthy()
        expect(requirements().Testorson[0].semver).toBeTruthy()
      })
    })

    describe('given an env rule', () => {
      it('adds the rule', async () => {
        context.parameters = {
          plugin: 'solidarity',
          command: 'snapshot',
          first: 'env',
          second: 'PATH',
          raw: 'env PATH',
          string: 'env PATH',
          array: [ 'env', 'PATH' ],
          options: {},
          argv: [ 'snapshot', 'env', 'PATH' ]
        }

        const mockedPrompt = jest.fn()
          .mockImplementationOnce(() => Promise.resolve({ addNewRule: true }))
          .mockImplementationOnce(() => Promise.resolve({ makeNewRequirement: true }))
          .mockImplementationOnce(() => Promise.resolve({
            newRequirement: 'Testorson'
          }))

        context.prompt = {
          ask: mockedPrompt
        }

        expect(requirements()).toEqual({})
        const result = await snapshotCommand.run(context);

        expect(context.prompt.ask.mock.calls).toMatchSnapshot()
        expect(requirements().Testorson).toBeTruthy()
      })
    })

    describe('given a file rule', () => {
      it('adds the rule', async () => {
        context.parameters = {
          plugin: 'solidarity',
          command: 'snapshot',
          first: 'file',
          second: './nachos',
          third: undefined,
          raw: 'file ./nachos',
          string: 'file ./nachos',
          array: [ 'file', './nachos' ],
          options: {},
          argv: [ 'snapshot', 'file', './nachos' ]
        }

        const mockedPrompt = jest.fn()
          .mockImplementationOnce(() => Promise.resolve({ addNewRule: true }))
          .mockImplementationOnce(() => Promise.resolve({ makeNewRequirement: true }))
          .mockImplementationOnce(() => Promise.resolve({
            newRequirement: 'Testorson'
          }))

        context.prompt = {
          ask: mockedPrompt
        }

        expect(requirements()).toEqual({})
        const result = await snapshotCommand.run(context);

        expect(context.prompt.ask.mock.calls).toMatchSnapshot()
        expect(requirements().Testorson).toBeTruthy()
      })
    })

    describe('given a dir rule', () => {
      it('adds the rule', async () => {
        context.parameters = {
          plugin: 'solidarity',
          command: 'snapshot',
          first: 'dir',
          second: './config',
          third: undefined,
          raw: 'dir ./config',
          string: 'dir ./config',
          array: [ 'dir', './config' ],
          options: {},
          argv: [ 'snapshot', 'dir', './config' ]
        }

        const mockedPrompt = jest.fn()
          .mockImplementationOnce(() => Promise.resolve({ addNewRule: true }))
          .mockImplementationOnce(() => Promise.resolve({ makeNewRequirement: true }))
          .mockImplementationOnce(() => Promise.resolve({
            newRequirement: 'Testorson'
          }))

        context.prompt = {
          ask: mockedPrompt
        }

        expect(requirements()).toEqual({})
        const result = await snapshotCommand.run(context);

        expect(context.prompt.ask.mock.calls).toMatchSnapshot()
        expect(requirements().Testorson).toBeTruthy()
      })
    })

    describe('given a shell rule', () => {
      beforeEach(() => {
        context.parameters = {
          plugin: 'solidarity',
          command: 'snapshot',
          first: 'shell',
          raw: 'shell',
          string: 'shell',
          array: [ 'shell' ],
          options: {},
          argv: [ 'snapshot', 'shell']
        }

        const mockedPrompt = jest.fn()
          .mockImplementationOnce(() => Promise.resolve({ whatRule: 'git config user.email' }))
          .mockImplementationOnce(() => Promise.resolve({ addNewRule: true }))
          .mockImplementationOnce(() => Promise.resolve({ makeNewRequirement: true }))
          .mockImplementationOnce(() => Promise.resolve({
            newRequirement: 'Git Email'
          }))
          .mockImplementationOnce(() => Promise.resolve({ shellMatch: '.+@.+' }))

        context.prompt = {
          ask: mockedPrompt
        }

        context.print = {
          error: jest.fn(),
          info: jest.fn()
        }
      })

      it('should add the new shell rule', async () => {
        expect(requirements()).toEqual({})

        const result = await snapshotCommand.run(context)
        expect(context.prompt.ask.mock.calls).toMatchSnapshot()
        expect(requirements()['Git Email']).toBeTruthy()
        expect(requirements()['Git Email'].length).toEqual(1)
      })
    })
  })
})
