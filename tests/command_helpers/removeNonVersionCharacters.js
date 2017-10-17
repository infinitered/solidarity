const test = require('ava')
const removeNonVersionCharacters = require('../../dist/extensions/functions/removeNonVersionCharacters')

test('Verify removeNonVersionCharacters function', t => {
  t.is(typeof removeNonVersionCharacters, 'function')
})

test('parse the result', t => {
  const line = 'Homebrew 1.3.5'
  const rule = { binary: 'homebrew' }
  t.is(removeNonVersionCharacters(rule, line), '1.3.5')
})

test('throws an error when there is no version output', t => {
  const line = 'Homebrew without versions'
  const rule = { binary: 'homebrew' }
  const errorMessage = ` No version was detected from the output of the binary '${rule.binary}'`
  const error = t.throws(() => {
    removeNonVersionCharacters(rule, line)
  })
  t.is(error, errorMessage)
})

test('handle multiple versions by return first', t => {
  const line = 'Homebrew 1.3.5 and Awaybrew 2.1.0 and Witchesbrew 3.1.4'
  const rule = { binary: 'homebrew' }
  t.is(removeNonVersionCharacters(rule, line), '1.3.5')
})

test('handle matchIndex property', t => {
  const line = 'Homebrew 1.3.5 and Awaybrew 2.1.0 and Witchesbrew 3.1.4'
  let rule = { binary: 'homebrew', matchIndex: 1 }
  t.is(removeNonVersionCharacters(rule, line), '2.1.0')
  rule = { binary: 'homebrew', matchIndex: 2 }
  t.is(removeNonVersionCharacters(rule, line), '3.1.4')
})
