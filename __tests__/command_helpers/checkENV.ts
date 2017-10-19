const checkENV = require('../../dist/extensions/functions/checkENV')

test('checkENV detects set ENV', async () => {
  // get the first environment variable
  const environmentKeys = Object.keys(process.env)
  if (environmentKeys.length > 0) {
    let someRealEnvVar
    let i = 0
    // some environment vars aren't truthy
    while (someRealEnvVar === undefined) {
      if (process.env[environmentKeys[i]]) {
        someRealEnvVar = environmentKeys[i]
      }
      i++
    }
    // Use checkENV to make sure it exists
    expect(await checkENV({variable: someRealEnvVar})).toBeTruthy()
  } else {}
})

test('checkENV can fail', async () => {
  // Use checkENV to make sure it exists
  expect(await checkENV({variable: 'THIS_SHOULD_NOT_EXIST_VERIFIER'})).toBeFalsy()
})
