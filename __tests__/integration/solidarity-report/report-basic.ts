import execa from 'execa'
import tempy from 'tempy'

const path = require('path')
const filesystem = require('fs-jetpack')
const SOLIDARITY = `node ${process.cwd()}${path.sep}bin${path.sep}solidarity`
const origCwd = process.cwd()
let originalTimeout

beforeAll(() => {
  // These can be slow on CI
  originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 90000
  const tempDir = tempy.directory()
  filesystem.copy(
    `__tests__${path.sep}sandbox${path.sep}solidarity_json${path.sep}.solidarity.json`,
    `${tempDir}${path.sep}.solidarity`
  )
  process.chdir(tempDir)
  console.log(tempDir)
})

afterAll(function() {
  // Fix timeout change
  jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout
})

test('solidarity report works', async done => {
  try {
    execa
      .shell(`${SOLIDARITY} report --compiled`)
      .then(result => {
        // check a few from the report
        expect(result.stdout.includes('OS')).toBeTruthy()
        expect(result.stdout.includes('CPU')).toBeTruthy()
        expect(result.stdout.includes('Report Info')).toBeTruthy()
        expect(result.stdout.includes('node')).toBeTruthy()
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
