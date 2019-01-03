let mockListr = jest.genMockFromModule('listr')

class ComplexListr extends mockListr {
  constructor(taskObj) {
    super(taskObj)
    this.storedInit = taskObj
  }
  run = jest.fn(() => Promise.resolve())
}

module.exports = ComplexListr
