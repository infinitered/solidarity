import checkFile from '../../src/extensions/functions/checkFile'
import context from 'gluegun'

test('checkFile detects an existing file', () => {
  // known file
  const location = './package.json'
  // Use checkFile to make sure it exists
  expect(checkFile({location}, context)).toBeTruthy()
})

test('checkFile can fail', () => {
  // Use checkFile to make sure it does not exist
  expect(checkFile({location: 'DOES_NOT_EXIST'}, context)).toBeFalsy()
})

test('checkFile returns false for a file that exists', () => {
  // Use checkFile to make sure a known dir returns false since it's not a file
  expect(checkFile({location: './src'}, context)).toBeFalsy()
})
