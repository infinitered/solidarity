import test from 'ava'
import checkENV from '../../src/extensions/functions/checkENV'

test('checkENV detects set ENV', async t => {
  // get the first environment variable
  const someRealEnvVar = Object.keys(process.env)[0]
  // Use checkENV to make sure it exists
  t.truthy(await checkENV({variable: someRealEnvVar}))
})

test('checkENV can fail', async t => {
  // Use checkENV to make sure it exists
  t.falsy(await checkENV({variable: 'THIS_SHOULD_NOT_EXIST_VERIFIER'}))
})
