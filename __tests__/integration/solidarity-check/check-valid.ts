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
})

afterAll(function() {
  // Fix timeout change
  jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout
})

test('default looks for .solidarity file', async done => {
  const tempDir = tempy.directory()
  filesystem.copy(
    `__tests__${path.sep}sandbox${path.sep}solidarity_json${path.sep}.solidarity.json`,
    `${tempDir}${path.sep}.solidarity`
  )
  process.chdir(tempDir)
  try {
    await execa.shell(SOLIDARITY).then(result => {

      expect(result.stdout).toContain('checks valid')
      done()
    })
  } catch (err) {
    console.error(err)
    done.fail()
  }
})

test('also looks for .solidarity.json file', async done => {
  const tempDir = tempy.directory()
  filesystem.copy(
    `__tests__${path.sep}sandbox${path.sep}solidarity_json${path.sep}.solidarity.json`,
    `${tempDir}${path.sep}.solidarity.json`
  )
  process.chdir(tempDir)
  try {
    await execa.shell(SOLIDARITY).then(result => {
      expect(result.stdout).toContain('checks valid')
      done()
    })
  } catch (err) {
    done.fail()
  }
})

test('verbose flag works', async done => {
  const tempDir = tempy.directory()
  filesystem.copy(
    `__tests__${path.sep}sandbox${path.sep}solidarity_json${path.sep}.solidarity.json`,
    `${tempDir}${path.sep}.solidarity`
  )
  process.chdir(tempDir)
  try {
    await execa.shell(`${SOLIDARITY} --verbose`).then(result => {
      expect(result.stdout).toContain('checks valid')
      done()
    })
  } catch (err) {
    done.fail()
  }
})

test('silent flag works', async done => {
  const tempDir = tempy.directory()
  filesystem.copy(
    `__tests__${path.sep}sandbox${path.sep}solidarity_json${path.sep}.solidarity.json`,
    `${tempDir}${path.sep}.solidarity`
  )
  process.chdir(tempDir)
  try {
    await execa.shell(`${SOLIDARITY} --silent`).then(result => {
      expect(result.stdout.trim()).toBe('')
      done()
    })
  } catch (err) {
    done.fail()
  }
})

afterEach(() => {
  process.chdir(origCwd)
})
