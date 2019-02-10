import Ajv from 'ajv'

test('solidarity.example.json fits local schema', () => {
  const ajv = new Ajv()
  const localSchema = require('../../solidaritySchema.json')
  expect(localSchema).toBeTruthy()

  const solidarityExample = require('../../.solidarity.example.json')
  const valid = ajv.validate(localSchema, solidarityExample)
  expect(valid).toBe(true)
})
