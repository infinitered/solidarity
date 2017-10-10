import test from 'ava'
import skipRule from '../../dist/extensions/functions/skipRule'

const currentPlatform = process.platform

test('skipRule takes a string', t => {
  t.false(skipRule(currentPlatform))
})

test('skipRule takes an array', t => {
  const arrayOfOne = [currentPlatform]
  t.false(skipRule(arrayOfOne))
  const arrayOfMore = [currentPlatform, 'nachos', 'tacos']
  t.false(skipRule(arrayOfMore))
})

test('skipRule false on unknown', t => {
  t.false(skipRule({}))
})

test('skips on platform miss', t => {
  t.true(skipRule('nachos'))
  t.true(skipRule(['nachos']))
  t.true(skipRule(['nachos', 'tacos']))
})
