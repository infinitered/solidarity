import test from 'ava'
import removeNonVersionCharacters from '../../dist/extensions/functions/removeNonVersionCharacters'

test('Verify removeNonVersionCharacters function', t => {
  t.is(typeof removeNonVersionCharacters, 'function')
})

test('it parses the result', t => {
  const line = "Homebrew 1.3.5"
  const rule = { binary: 'homebrew' }
  t.is(removeNonVersionCharacters(rule, line), '1.3.5')
})

test('throws an error when there is no version output', t => {
  const line = "Homebrew without versions"
  const rule = { binary: 'homebrew' }
  const errorMessage = ` No version was detected from the output of the binary '${rule.binary}'`
  const error = t.throws(() => {
    removeNonVersionCharacters(rule, line), '1.3.5'
  })
  t.is(error, errorMessage)
})