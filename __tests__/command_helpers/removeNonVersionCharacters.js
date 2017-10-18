const removeNonVersionCharacters = require('../../dist/extensions/functions/removeNonVersionCharacters')

test('Verify removeNonVersionCharacters function', () => {
  expect(typeof removeNonVersionCharacters).toBe('function')
})

test('parse the result', () => {
  const line = 'Homebrew 1.3.5'
  const rule = { binary: 'homebrew' }
  expect(removeNonVersionCharacters(rule, line)).toBe('1.3.5')
})

test('throws an error when there is no version output', () => {
  const line = 'Homebrew without versions'
  const rule = { binary: 'ls' }
  const errorMessage = ` No version was detected from the output of the binary '${rule.binary}'`
  expect(() => {
    removeNonVersionCharacters(rule, line)
  }).toThrowError(errorMessage)
})

test('handle multiple versions by return first', () => {
  const line = 'Homebrew 1.3.5 and Awaybrew 2.1.0 and Witchesbrew 3.1.4'
  const rule = { binary: 'homebrew' }
  expect(removeNonVersionCharacters(rule, line)).toBe('1.3.5')
})

test('handle matchIndex property', () => {
  const line = 'Homebrew 1.3.5 and Awaybrew 2.1.0 and Witchesbrew 3.1.4'
  let rule = { binary: 'homebrew', matchIndex: 1 }
  expect(removeNonVersionCharacters(rule, line)).toBe('2.1.0')
  rule = { binary: 'homebrew', matchIndex: 2 }
  expect(removeNonVersionCharacters(rule, line)).toBe('3.1.4')
})
