import { read } from 'fs';

import { solidarity } from '../../src';
import getSolidaritySettings from '../../src/extensions/functions/getSolidaritySettings'

import solidarityExtension from '../../src/extensions/solidarity-extension'

const context = require('gluegun')
solidarityExtension(context)

describe('getSolidaritySettings', () => {
  describe('w/ .solidarity', () => {
    test('happy path', () => {
      const solidaritySettings = getSolidaritySettings(context)
      expect(solidaritySettings).toMatchSnapshot()
    })

    // Need to figure out a good pattern for mocking filesystem  
    // to point at our .solidarity.example 

    // test('sad path', () => {

    // })
  })

  // describe('w/o .solidarity', () => {
  //   test('it should print a reasonable error', () => {

  //   })
  // })
})