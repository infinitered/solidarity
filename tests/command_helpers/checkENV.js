import test from 'ava'
import checkENV from '../../dist/extensions/functions/checkENV'

test('checkENV detects set ENV', async t => {
  // get the first environment variable
  const environmentKeys = Object.keys(process.env)
  if (environmentKeys.length > 0) {
    const someRealEnvVar = environmentKeys[0]
    // Use checkENV to make sure it exists
    t.truthy(await checkENV({variable: someRealEnvVar}))
  } else {
    // This only happens in sub-run tests
    // don't worry when this happens
    t.pass()
  }
})

test('checkENV can fail', async t => {
  // Use checkENV to make sure it exists
  t.falsy(await checkENV({variable: 'THIS_SHOULD_NOT_EXIST_VERIFIER'}))
})
