import test from 'ava'
import checkFile from '../../src/extensions/functions/checkFile'
import context from 'gluegun'

test('checkFile detects an existing file', async t => {
  // get the first environment variable
  const location = './package.json'
  // Use checkENV to make sure it exists
  t.truthy(checkFile({location}, context))
})

test('checkFile can fail', async t => {
  // Use checkENV to make sure it exists
  t.falsy(checkFile({location: 'DOES_NOT_EXIST'}, context))
})

test('checkFile returns false for a file that exists', async t => {
  // Use checkFile to make sure a known directory returns false since it's not a file
  t.falsy(checkFile({location: './src'}, context))
})
