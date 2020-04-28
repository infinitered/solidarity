import checkCLI from '../../src/extensions/functions/checkCLI'
import solidarityExtension from '../../src/extensions/solidarity-extension'

const doesNotExistCLI = {
  binary: 'no_way_this_should_be_real',
}

const alwaysExistCLI = {
  binary: 'node',
}

const badSemver = {
  binary: 'node',
  semver: 'wtfbbq!!!11',
}

const outOfDateCLI = {
  binary: 'node',
  semver: '10.99',
}

const injectVersion = {
  binary: 'node',
  semver: '~7.6',
  error: "Wanted: '{{wantedVersion}}', Installed: '{{installedVersion}}'. Update with `nvm install {{wantedVersion}}`",
}

const context = require('gluegun/toolbox')

test('error on missing binary', async () => {
  await expect(checkCLI(doesNotExistCLI, context)).rejects.toThrow()
})

test('fine on existing binary', async () => {
  expect(await checkCLI(alwaysExistCLI, context)).toBe(undefined)
})

test('errors with message when an improper semver is sent', async () => {
  await expect(checkCLI(badSemver, context)).rejects.toThrow()
})

test('returns message on improper version', async () => {
  solidarityExtension(context)
  context.solidarity.getVersion = () => '1'
  const message = `${outOfDateCLI.binary}: you have '1', but the project requires '${outOfDateCLI.semver}'`

  await expect(checkCLI(outOfDateCLI, context)).rejects.toThrowError(message)
})

test('returns message with injected versions', async () => {
  const message = `Wanted: '7.6', Installed: '7.5'. Update with \`nvm install 7.6\``
  solidarityExtension(context)
  context.solidarity.getVersion = () => '7.5'

  await expect(checkCLI(injectVersion, context)).rejects.toThrowError(message)
})
