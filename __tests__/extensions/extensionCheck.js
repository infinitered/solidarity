const path = require('path')
const solidarityExtension = require('../../dist/extensions/solidarity-extension')

const newContext = {}
solidarityExtension(newContext)

test('Assure solidarity object', () => {
  expect(typeof newContext.solidarity).toBe('object')
})

test('Assure addPlugin function', () => {
  expect(typeof newContext.addPlugin).toBe('function')
})

test('Verify addPlugin function', () => {
  // plugin list is empty
  expect(newContext._pluginsList.length).toBe(0)
  newContext.addPlugin({})
  expect(newContext._pluginsList.length).toBe(1)
  expect(newContext._pluginsList[0].templateDirectory).toBe(path.join(__dirname, '../templates/'))
})

test('Assure printSeparator function', () => {
  expect(typeof newContext.printSeparator).toBe('function')
})

test('Snapshot of solidarity extension', () => {
  expect(newContext.solidarity).toMatchSnapshot()
})
