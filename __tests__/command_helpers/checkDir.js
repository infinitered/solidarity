const checkDir = require('../../dist/extensions/functions/checkDir')
const context = require('gluegun')

test('checkDir detects an existing file', async () => {
  // Check for a known directory
  const location = './src'
  // Use checkDir to make sure it exists
  expect(checkDir({location}, context)).toBeTruthy()
})

test('checkDir can fail', async () => {
  // Use checkDir to make sure a non-existant directory returns false
  expect(checkDir({location: 'DOES_NOT_EXIST'}, context)).toBeFalsy()
})

test('checkDir returns false for a file that exists', async () => {
  // Use checkDir to make sure a known file returns false since it's not a directory
  expect(checkDir({location: './package.json'}, context)).toBeFalsy()
})
