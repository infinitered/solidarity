import getInLineWithVersion from '../../src/extensions/functions/getLineWithVersion'

describe('getLineWithVersion', () => {
  test('line: number', () => {
    const rule = {
      rule: 'cli',
      binary: 'node',
      semver: '>=7.6.0',
      error: 'Upgrade to latest node >= 7.6 please.',
      number: 'this',
      line: 2,
    }

    const versionOutput = `Node js \n 7.6.0`
    const result = getInLineWithVersion(rule, versionOutput)

    expect(result).toEqual(' 7.6.0')
  })

  test('line: string', () => {
    const rule = {
      rule: 'cli',
      binary: 'node',
      semver: '>=7.6.0',
      error: 'Upgrade to latest node >= 7.6 please.',
      number: 'this',
      line: 'version:',
    }

    const versionOutput = `Node js \n version: 7.6.0`
    const result = getInLineWithVersion(rule, versionOutput)

    expect(result).toEqual(' version: 7.6.0')
  })

  test('no line', () => {
    const rule = {
      rule: 'cli',
      binary: 'node',
      semver: '>=7.6.0',
      error: 'Upgrade to latest node >= 7.6 please.',
      number: 'this',
    }

    const versionOutput = `Node js \n 7.6.0`
    const result = getInLineWithVersion(rule, versionOutput)

    expect(result).toEqual(versionOutput)
  })
})
