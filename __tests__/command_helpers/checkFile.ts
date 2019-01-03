import checkFile from '../../src/extensions/functions/checkFile'
import * as context from 'gluegun/toolbox'

test('checkFile detects an existing file', () => {
  // known file
  const location = 'package.json'
  // Use checkFile to make sure it exists
  expect(checkFile({ location }, context)).toBe(undefined)
})

test('checkFile can fail', () => {
  // Use checkFile to make sure it does not exist
  expect(() => {
    checkFile({ location: 'DOES_NOT_EXIST' }, context)
  }).toThrow()
})

test('checkFile does not throw for a dir that exists', () => {
  // Use checkFile to make sure a known dir returns false since it's not a file
  expect(() => {
    checkFile({ location: './src' }, context)
  }).toThrow()
})

test('checkFile throws false with no location', () => {
  expect(() => {
    checkFile({}, context)
  }).toThrow()
})
