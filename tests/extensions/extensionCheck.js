import test from 'ava'
import path from 'path'
import solidarityExtension from '../../dist/extensions/solidarity-extension'

const newContext = {}
solidarityExtension(newContext)

test('Assure solidarity object', t => {
  t.is(typeof newContext.solidarity, 'object')
})

test('Assure addPlugin function', t => {
  t.is(typeof newContext.addPlugin, 'function')
})

test('Verify addPlugin function', t => {
  // plugin list is empty
  t.is(newContext._pluginsList.length, 0)
  newContext.addPlugin({})
  t.is(newContext._pluginsList.length, 1)
  t.is(
    newContext._pluginsList[0].templateDirectory,
    path.join(__dirname, '../templates/')
  )
})

test('Assure printSeparator function', t => {
  t.is(typeof newContext.printSeparator, 'function')
})

test('Snapshot of solidarity extension', t => {
  t.snapshot(newContext.solidarity)
})
