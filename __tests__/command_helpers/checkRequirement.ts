import { SolidarityRequirement } from '../../dist/types';
import { platform } from 'os';
import { read } from 'fs';
import { tail, pipe, head, flatten, toPairs } from 'ramda';

import checkRequirement from '../../src/extensions/functions/checkRequirement'
import solidarityExtension from '../../src/extensions/solidarity-extension'

const context = require('gluegun')

const badRule = toPairs({ 
  "YARN": [{ "rule": "knope", "binary": "yarn" }] 
})[0]

describe('checkRequirement', () => {
  beforeAll(() => {
    const fail = jest.fn()
    const stop = jest.fn()
    
    const spinner = {
      fail: jest.fn(),
      stop: jest.fn()
    }

    solidarityExtension(context)
    context.print = {
      spin: jest.fn(() => spinner),
      error: jest.fn()
    }
  })

  test('there is a spinner message', async () => {
    const result = await checkRequirement(badRule, context)
    expect(context.print.spin.mock.calls).toEqual([
      ["Verifying YARN"]
    ])    
  })

  test('when an invalid rule is given', async () => {
    const result = await checkRequirement(badRule, context)
    expect(result).toEqual(['Encountered unknown rule \'knope\''])
    })
  })

  // test('when rule: cli', () => {

  // })

  // test('when rule: dir', () => {

  // })

  // test('when rule: env', () => {

  // })

  // test('when rule: file', () => {

  // })
});