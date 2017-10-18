const execa = require('execa')
const tempy = require('tempy')

const SOLIDARITY = `${process.cwd()}/bin/solidarity`

beforeAll(() => {
  const tempDir = tempy.directory()
  process.chdir(tempDir)
})

test('default looks for .solidarity file', async done => {
  try {
    await execa(SOLIDARITY)
    done.fail()
  } catch (err) {
    expect(err.code).toBe(3)
    done()
  }
})

test('check looks for .solidarity file', async done => {
  try {
    await execa(SOLIDARITY, ['check'])
    done.fail()
  } catch (err) {
    expect(err.code).toBe(3)
    done()
  }
})
