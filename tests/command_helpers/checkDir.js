import test from 'ava'
import checkDir from '../../src/extensions/functions/checkDir'

test('checkFile detects an existing file', async t => {
  // get the first environment variable
  const location = './src'
  // Use checkENV to make sure it exists
  t.truthy(checkDir({location}))
})

test('checkFile can fail', async t => {
  // Use checkENV to make sure it exists
  t.falsy(checkDir({location: 'DOES_NOT_EXIST'}))
})
