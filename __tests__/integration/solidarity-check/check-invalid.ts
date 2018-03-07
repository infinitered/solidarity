import execa from 'execa'
import tempy from 'tempy'

const path = require('path')
const SOLIDARITY = `node ${process.cwd()}${path.sep}bin${path.sep}solidarity`
const origCwd = process.cwd()
let originalTimeout

beforeAll(() => {
  // These can be slow on CI
  originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 90000
  // Tempy!
  const tempDir = tempy.directory()
  process.chdir(tempDir)
})

afterAll(function() {
  // Fix timeout change
  jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout
})

test('default looks for .solidarity file', async done => {
  try {
    await execa.shellSync(`${SOLIDARITY} --compiled`)
    done.fail()
  } catch (err) {
    expect(err.code).not.toBe(0)
    done()
  }
})

afterAll(() => {
  process.chdir(origCwd)
})
