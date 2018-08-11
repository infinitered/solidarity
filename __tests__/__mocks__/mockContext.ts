const realThing = require('gluegun/toolbox')
const realSolidarityContext = require('../../src/extensions/solidarity-extension')
realSolidarityContext(realThing)

const noConfigSolidarity = {
  checkRequirement: jest.fn(),
  getSolidaritySettings: jest.fn(() => Promise.resolve({})),
  printResults: jest.fn(),
  setSolidaritySettings: jest.fn(),
  updateRequirement: jest.fn(),
  updateVersions: jest.fn(() => Promise.resolve()),
  getLineWithVersion: jest.fn(),
  removeNonVersionCharacters: jest.fn(),
}

const mockContext = {
  ...realThing,
  outputMode: undefined,
  system: {
    startTimer: jest.fn(() => jest.fn()),
    run: jest.fn(() => '12'),
    which: jest.fn(name => 'usr/local/bin/${name}'),
  },
  template: {
    generate: jest.fn(),
  },
  print: {
    error: jest.fn(),
    success: jest.fn(),
    info: jest.fn(),
    spin: jest.fn(() => ({
      stop: jest.fn(),
      fail: jest.fn(),
      succeed: jest.fn(),
    })),
    table: jest.fn(),
    xmark: jest.fn(),
    checkmark: jest.fn(),
    color: {
      green: jest.fn(),
      red: jest.fn(),
      blue: jest.fn(),
      magenta: jest.fn(),
    },
    colors: {
      green: jest.fn(),
      red: jest.fn(),
      blue: jest.fn(),
      magenta: jest.fn(),
    },
  },
  printSeparator: jest.fn(),
  parameters: {
    options: {},
  },
  prompt: {
    ask: jest.fn(({ name }) => Promise.resolve({ [name]: 'taco', createFile: true })),
    confirm: jest.fn(() => true),
  },
  solidarity: noConfigSolidarity,
}

module.exports = mockContext
