import checkCLI from '../../src/extensions/functions/checkCLI'
import solidarityExtension from '../../src/extensions/solidarity-extension'

const doesNotExistCLI = {
  binary: 'no_way_this_should_be_real',
}

const alwaysExistCLI = {
  binary: 'node',
}

const outOfDateCLI = {
  binary: 'node',
  semver: '10.99',
}

const context = require('gluegun')

test('error on missing binary', async () => {
  expect(await checkCLI(doesNotExistCLI, context)).toBe(`Binary '${doesNotExistCLI.binary}' not found`)
})

test('fine on existing binary', async () => {
  expect(await checkCLI(alwaysExistCLI, context)).toBe(undefined)
})

test('returns message on improper version', async () => {
  solidarityExtension(context)
  context.solidarity.getVersion = () => '1'
  const message = `${outOfDateCLI.binary}: you have '1', but the project requires '${outOfDateCLI.semver}'`

  expect(await checkCLI(outOfDateCLI, context)).toBe(message)
})
