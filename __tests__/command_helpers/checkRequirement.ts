import { SolidarityRequirement } from '../../dist/types';
import { platform } from 'os';
import { read } from 'fs';
import { tail, pipe, head, flatten, toPairs } from 'ramda';

import checkRequirement from '../../src/extensions/functions/checkRequirement'
import solidarityExtension from '../../src/extensions/solidarity-extension'


// Setup checkCLI
jest.mock('../../src/extensions/functions/checkCLI')
const checkCLI = require('../../src/extensions/functions/checkCLI')
checkCLI.mockImplementation(async () => "It worked!")

// Setup checkDir
jest.mock('../../src/extensions/functions/checkDir')
const checkDir = require('../../src/extensions/functions/checkDir')
checkDir.mockImplementation(async () => "It worked!")

// Setup checkENV
jest.mock('../../src/extensions/functions/checkENV')
const checkENV = require('../../src/extensions/functions/checkENV')
checkENV.mockImplementation(async () => "It worked!")

// Setup checkENV
jest.mock('../../src/extensions/functions/checkFile')
const checkFile = require('../../src/extensions/functions/checkFile')
checkFile.mockImplementation(async () => "It worked!")

const context = require('gluegun')

const badRule = toPairs({
  "YARN": [{ "rule": "knope", "binary": "yarn" }] 
})[0]

let fail
let stop
let succeed

describe('checkRequirement', () => {
  beforeEach(() => {
    fail = jest.fn()
    stop = jest.fn()
    succeed = jest.fn()
    
    const spinner = {
      fail,
      stop,
      succeed
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

  test('when rule: cli', async () => {
    const rule =  toPairs({ 
      "YARN": [{ "rule": "cli", "binary": "yarn" }] 
    })[0]
    const result = await checkRequirement(rule, context)
    expect(result).toEqual(["It worked!"])
  })

  test('when rule: dir', async () => {
    const rule =  toPairs({ 
      "YARN": [{ "rule": "dir", "binary": "yarn" }] 
    })[0]
    const result = await checkRequirement(rule, context)
    expect(result).toEqual([[]])
  })

  test('when rule: env', async () => {
    const rule =  toPairs({ 
      "YARN": [{ "rule": "env", "binary": "yarn" }] 
    })[0]
    const result = await checkRequirement(rule, context)
    expect(result).toEqual([[]])
  })

  test('when rule: file', async () => {
    const rule =  toPairs({ 
      "YARN": [{ "rule": "file", "binary": "yarn" }] 
    })[0]
    const result = await checkRequirement(rule, context)
    expect(result).toEqual([[]])
  })
});