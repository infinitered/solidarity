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
  const tempDir = tempy.directory()
  process.chdir(tempDir)
})

afterAll(function() {
  // Fix timeout change
  jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout
})

test('solidarity report works', async done => {
  try {
    execa
      .shell(`echo n | ${SOLIDARITY} snapshot --compiled`)
      .then(result => {
        // do not snapshot stdout bc windows bitches
        expect(result.stdout.includes('Nothing to do')).toBeTruthy()
        expect(result.code).toBe(0)
        done()
      })
      .catch(err => {
        console.error(err)
        done.fail()
      })
  } catch (err) {
    done.fail()
  }
})

afterEach(() => {
  process.chdir(origCwd)
})
