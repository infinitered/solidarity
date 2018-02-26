import {
  reject, contains, concat, difference
} from 'ramda'
import path from 'path'

// Node mutates path by adding to the front, move that to the back if it exists
const originalPath = process.env.PATH || ''
const originalArray = originalPath.split(':')
const cleanArray = reject(contains('node_modules' + path.sep), originalArray)
process.env.PATH = concat(cleanArray, difference(originalArray, cleanArray)).join(':')
