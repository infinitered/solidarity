const noConfigSolidarity = {
  checkRequirement: jest.fn(),
  getSolidaritySettings: jest.fn(() => ({})),
  printResults: jest.fn()
}

const mockContext = {
  outputMode: null,
  system: {
    startTimer: jest.fn(() => jest.fn())
  },
  print: {
    error: jest.fn(),
    success: jest.fn(),
    info: jest.fn(),
    spin: jest.fn(() => ({
      stop: jest.fn()
    })),
    table: jest.fn(),
    xmark: jest.fn(),
    checkmark: jest.fn(),
    color: {
      green: jest.fn(),
      red: jest.fn()
    }
  },
  printSeparator: jest.fn(),
  parameters: {
    options: {}
  },
  solidarity: noConfigSolidarity
}

module.exports = mockContext
