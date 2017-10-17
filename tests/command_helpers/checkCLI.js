const test = require('ava')
const checkCLI = require('../../dist/extensions/functions/checkCLI')
const solidarityExtension = require('../../dist/extensions/solidarity-extension')

const doesNotExistCLI = {
  binary: 'no_way_this_should_be_real'
}

const alwaysExistCLI = {
  binary: 'node'
}

const outOfDateCLI = {
  binary: 'node',
  semver: '10.99'
}

const context = require('gluegun')

test('error on missing binary', async t => {
  t.is(await checkCLI(doesNotExistCLI, context), `Binary '${doesNotExistCLI.binary}' not found`)
})

test('fine on existing binary', async t => {
  t.is(await checkCLI(alwaysExistCLI, context), undefined)
})

test('returns message on improper version', async t => {
  solidarityExtension(context)
  context.solidarity.getVersion = () => '1'
  const message = `This system has an improper version for ${outOfDateCLI.binary}:
        Rule='${outOfDateCLI.semver}'
        Actual='1'`

  t.is(await checkCLI(outOfDateCLI, context), message)
})
