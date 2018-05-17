import solidarityExtension from '../../src/extensions/solidarity-extension'
const context = require('mockContext')

const newContext = context
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
  // No existing path means empty template directory
  expect(newContext._pluginsList[0].templateDirectory).toBe(null)
  // TODO:  Create temporary templates folder and make sure it works
  // newContext.addPlugin({})
  // expect(newContext._pluginsList[0].templateDirectory).toBe(path.join(__dirname, '../templates/'))
})

test('Assure printSeparator function', () => {
  expect(typeof newContext.printSeparator).toBe('function')
})

test('Snapshot of solidarity extension', () => {
  expect(newContext.solidarity).toMatchSnapshot()
})
