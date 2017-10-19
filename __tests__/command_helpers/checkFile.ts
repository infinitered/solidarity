const checkFile = require('../../src/extensions/functions/checkFile')
const context = require('gluegun')

test('checkFile detects an existing file', async () => {
  // get the first environment variable
  const location = './package.json'
  // Use checkENV to make sure it exists
  expect(checkFile({location}, context)).toBeTruthy()
})

test('checkFile can fail', async () => {
  // Use checkENV to make sure it exists
  expect(checkFile({location: 'DOES_NOT_EXIST'}, context)).toBeFalsy()
})

test('checkFile returns false for a file that exists', async () => {
  // Use checkFile to make sure a known directory returns false since it's not a file
  expect(checkFile({location: './src'}, context)).toBeFalsy()
})
