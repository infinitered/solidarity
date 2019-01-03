import checkRequirement from '../../src/extensions/functions/checkRequirement'
import { toPairs } from 'ramda'
const examplePlugin = require('examplePlugin')
const mockContext = examplePlugin(require('mockContext'))

describe('checkRequirement Plugins', () => {
  // test('successful CUSTOM rule check', async () => {
  //   const rule = toPairs({
  //     TestRequirement: [{ rule: 'custom', plugin: 'Example Plugin', name: 'checkThing' }],
  //   })[0]
  //   const listrTask = await checkRequirement(rule, mockContext)
  //   const result = await listrTask.storedInit[0].task()
  //   expect(result).toEqual(true)
  // })

  test('failed CUSTOM rule check', async () => {
    const rule = toPairs({
      TestRequirement: [{ rule: 'custom', plugin: 'Example Plugin', name: 'checkSecondThing' }],
    })[0]
    const listrTask = await checkRequirement(rule, mockContext)
    await expect(listrTask.storedInit[0].task()).rejects.toThrow()
    // const result = await listrTask.storedInit[0].task()
    // expect(result).toEqual(['Boooo failed check'])
  })

  // test('CUSTOM and missing check function OK', async () => {
  //   mockContext.addPlugin({
  //     name: 'Empty Plugin',
  //     description: 'I help test plugins',
  //     rules: {
  //       emptyDude: {},
  //     },
  //   })
  //   const rule = toPairs({
  //     TestRequirement: [{ rule: 'custom', plugin: 'Empty Plugin', name: 'emptyDude' }],
  //   })[0]
  //   const listrTask = await checkRequirement(rule, mockContext)
  //   const result = await listrTask.storedInit[0].task()
  //   expect(result).toEqual([[]])
  // })

  test('failed to find plugin', async () => {
    const rule = toPairs({
      TestRequirement: [{ rule: 'custom', plugin: 'I do not exist', name: 'checkSecondThing' }],
    })[0]
    await expect(checkRequirement(rule, mockContext)).rejects.toThrow()
    // const listrTask = await checkRequirement(rule, mockContext)
    // const result = await listrTask.storedInit[0].task()
    // expect(result).toEqual(["Error: Plugin not found 'I do not exist'"])
  })

  test('failed to find check function', async () => {
    const rule = toPairs({
      TestRequirement: [{ rule: 'custom', plugin: 'Example Plugin', name: 'notRealName' }],
    })[0]
    await expect(checkRequirement(rule, mockContext)).rejects.toThrow()
    // const listrTask = await checkRequirement(rule, mockContext)
    // const result = await listrTask.storedInit[0].task()
    // expect(result).toEqual(["Error: NOT FOUND: Custom rule from 'Example Plugin' plugin with check function 'notRealName'"])
  })

  // test('failed CUSTOM rule with custom message', async () => {
  //   const error = 'CUSTOM ERROR'
  //   const rule = toPairs({
  //     TestRequirement: [{ rule: 'custom', plugin: 'Example Plugin', name: 'checkSecondThing', error }],
  //   })[0]
  //   const listrTask = await checkRequirement(rule, mockContext)
  //   const result = await listrTask.storedInit[0].task()
  //   expect(result).toEqual([error])
  // })
})
