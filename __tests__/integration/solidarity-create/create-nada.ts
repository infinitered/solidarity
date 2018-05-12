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
})

afterAll(function() {
  // Fix timeout change
  jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout
})

test('solidarity create works and prompts for what to create', async done => {
  try {
    execa
      .shell(`${SOLIDARITY} create --compiled`)
      .then(result => {
        // check a few from the report
        expect(result.stdout.includes('Missing what to create')).toBeTruthy()
        expect(result.code).toBe(0)
        done()
      })
      .catch(err => {
        console.error(err)
        done.fail()
      })
  } catch (err) {
    console.error(err)
    done.fail()
  }
})

test('solidarity create is specific', async done => {
  try {
    execa
      .shell(`${SOLIDARITY} create idonotexist --compiled`)
      .then(result => {
        // check a few from the report
        expect(result.stdout.includes('Missing what to create')).toBeTruthy()
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
