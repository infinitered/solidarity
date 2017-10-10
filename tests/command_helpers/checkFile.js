import test from 'ava'
import checkFile from '../../src/extensions/functions/checkFile'

test('checkFile detects an existing file', async t => {
  // get the first environment variable
  const location = './package.json'
  // Use checkENV to make sure it exists
  t.truthy(checkFile({location}))
})

test('checkFile can fail', async t => {
  // Use checkENV to make sure it exists
  t.falsy(checkFile({location: 'DOES_NOT_EXIST'}))
})
