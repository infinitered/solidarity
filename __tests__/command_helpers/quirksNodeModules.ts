const path = require('path')
const delineator = process.platform === 'win32' ? ';' : ':'
test('quirks moves node_modules to back', () => {
  // key is that it has `node_modules` + path.sep
  const injectedStuff = `node_modules${path.sep}testOnly`
  // prepend to PATH
  process.env.PATH = injectedStuff + delineator + process.env.PATH
  const pathAsArray = process.env.PATH.split(delineator)
  // Yup it is prepended to front
  expect(pathAsArray[0]).toBe(injectedStuff)
  // require mutates PATH
  require('../../src/extensions/functions/quirksNodeModules')
  const newPathAsArray = process.env.PATH.split(delineator)
  // Not in the front
  expect(newPathAsArray[0]).not.toBe(injectedStuff)
  // still there though (moved to back)
  expect(process.env.PATH.match(injectedStuff)).toBeTruthy()
})

test('quirks does not move just any injected path to back', () => {
  const injectedStuff = `taco${path.sep}testOnly`
  // prepend to PATH
  process.env.PATH = injectedStuff + delineator + process.env.PATH
  const pathAsArray = process.env.PATH.split(delineator)
  // Yup it is prepended to front
  expect(pathAsArray[0]).toBe(injectedStuff)
  // require does not mutate PATH this time
  require('../../src/extensions/functions/quirksNodeModules')
  const newPathAsArray = process.env.PATH.split(delineator)
  // Not in the front
  expect(newPathAsArray[0]).toBe(injectedStuff)
})
