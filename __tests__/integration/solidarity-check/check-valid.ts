import execa from 'execa'
import tempy from 'tempy'

const filesystem = require('fs-jetpack')
const SOLIDARITY = `${process.cwd()}/bin/solidarity`
const origCwd = process.cwd()
let originalTimeout

beforeAll(() => {
  // These can be slow on CI
  originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 90000
})

afterAll(function() {
  // Fix timeout change
  jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout
})

test('default looks for .solidarity file', async done => {
  const tempDir = tempy.directory()
  filesystem.copy('__tests__/sandbox/solidarity_json/.solidarity.json', `${tempDir}/.solidarity`)
  process.chdir(tempDir)
  try {
    await execa(SOLIDARITY)
    done()
  } catch (err) {
    done.fail()
  }
})

test('also looks for .solidarity.json file', async done => {
  const tempDir = tempy.directory()
  filesystem.copy('__tests__/sandbox/solidarity_json/.solidarity.json', `${tempDir}/.solidarity.json`)
  process.chdir(tempDir)
  try {
    await execa(SOLIDARITY)
    done()
  } catch (err) {
    done.fail()
  }
})

afterEach(() => {
  process.chdir(origCwd)
})
