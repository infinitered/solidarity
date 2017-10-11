import test from 'ava'
import checkDir from '../../src/extensions/functions/checkDir'
import context from 'gluegun'

test('checkDir detects an existing file', async t => {
  // Check for a known directory
  const location = './src'
  // Use checkDir to make sure it exists
  t.truthy(checkDir({location}, context))
})

test('checkDir can fail', async t => {
  // Use checkDir to make sure a non-existant directory returns false
  t.falsy(checkDir({location: 'DOES_NOT_EXIST'}, context))
})

test('checkDir returns false for a file that exists', async t => {
  // Use checkDir to make sure a known file returns false since it's not a directory
  t.falsy(checkDir({location: './package.json'}, context))
})
