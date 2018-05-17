import { reject, contains, concat, difference } from 'ramda'
const path = require('path')
const delineator = process.platform === 'win32' ? ';' : ':'

// Node mutates path by adding to the front, move that to the back if it exists
const originalPath = process.env.PATH || ''
const originalArray = originalPath.split(delineator)
const cleanArray = reject(contains('node_modules' + path.sep), originalArray)
process.env.PATH = concat(cleanArray, difference(originalArray, cleanArray)).join(delineator)
