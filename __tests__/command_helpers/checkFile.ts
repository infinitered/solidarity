import checkFile from '../../src/extensions/functions/checkFile'
import * as context from 'gluegun/toolbox'
import { FSRule } from '../../src/types'

test('checkFile detects an existing file', () => {
  // known file
  const location = 'package.json'
  // Use checkFile to make sure it exists
  expect(checkFile({ location } as FSRule, context)).toBe(undefined)
})

test('checkFile can fail', () => {
  // Use checkFile to make sure it does not exist
  expect(() => {
    checkFile({ location: 'DOES_NOT_EXIST' } as FSRule, context)
  }).toThrow()
})

test('checkFile throws false with no location', () => {
  expect(() => {
    checkFile({} as FSRule, context)
  }).toThrow()
})

test('checkFile does not throw for a local dir that exists', () => {
  // Use checkFile to make sure a known dir returns false since it's not a file
  expect(() => {
    checkFile({ location: './src' } as FSRule, context)
  }).toThrow()
})

test('checkFile does not throw for a local dir (in default) that exists', () => {
  // Use checkFile to make sure a known dir returns false since it's not a file
  expect(() => {
    checkFile({ location: 'src' } as FSRule, context)
  }).toThrow()
})

test('checkFile does not throw for a homedir that exists', () => {
  // Use checkFile to make sure a known dir returns false since it's not a file
  expect(() => {
    checkFile({ location: '~/.ssh/' } as FSRule, context)
  }).toThrow()
})
