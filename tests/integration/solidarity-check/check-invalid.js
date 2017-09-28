const test = require('ava')
const execa = require('execa')
const tempy = require('tempy')

const SOLIDARITY = `${process.cwd()}/bin/solidarity`

test.before(t => {
  const tempDir = tempy.directory()
  process.chdir(tempDir)
})

test('default looks for .solidarity file', async t => {
  try {
    await execa(SOLIDARITY)
    t.fail()
  } catch (err) {
    t.is(err.code, 3)
  }
})

test('check looks for .solidarity file', async t => {
  try {
    await execa(SOLIDARITY, ['check'])
    t.fail()
  } catch (err) {
    t.is(err.code, 3)
  }
})
