import checkCommand from '../../src/commands/solidarity'
import { SolidarityOutputMode } from '../../src/types'

const noConfigSolidarity = {
  checkRequirement: jest.fn(),
  getSolidaritySettings: jest.fn(() => ({})),
}

const verboseConfigSolidarity = {
  ...noConfigSolidarity,
  getSolidaritySettings: jest.fn(() => ({
    config: {
      output: 'verbose',
    },
  })),
}

const configNoOutput = {
  ...noConfigSolidarity,
  getSolidaritySettings: jest.fn(() => ({
    config: {},
  })),
}

const mockContext = {
  outputMode: null,
  print: {
    error: jest.fn(),
    success: jest.fn(),
  },
  parameters: {
    options: {},
  },
  solidarity: noConfigSolidarity,
}

const verboseMockContext = {
  ...mockContext,
  solidarity: verboseConfigSolidarity,
}

const noConfigMockContext = {
  ...mockContext,
  solidarity: configNoOutput,
}

test('Snapshot check default command', () => {
  expect(checkCommand).toMatchSnapshot()
})

test('Enforce required properties', () => {
  expect(checkCommand.description).toBeTruthy()
  expect(checkCommand.run).toBeTruthy()
  expect(typeof checkCommand.run).toBe('function')
})

test('check base solidarity run', async () => {
  const result = await checkCommand.run(mockContext)
  expect(result).toMatchSnapshot()
  expect(mockContext.outputMode).toBe(SolidarityOutputMode.MODERATE)
  expect(mockContext.solidarity.getSolidaritySettings.mock.calls.length).toBe(1)
  expect(mockContext.print.success.mock.calls.length).toBe(2)
})

test('check solidarity verbose run', async () => {
  await checkCommand.run(verboseMockContext)
  expect(verboseMockContext.outputMode).toBe(SolidarityOutputMode.VERBOSE)
})

test('check solidarity config no output run', async () => {
  await checkCommand.run(noConfigMockContext)
  expect(noConfigMockContext.outputMode).toBe(SolidarityOutputMode.MODERATE)
})
