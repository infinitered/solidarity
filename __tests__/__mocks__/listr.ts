let mockListr = jest.genMockFromModule('listr')

mockListr.run = jest.fn(() => Promise.resolve())

module.exports = mockListr
