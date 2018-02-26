import {
  reject, contains, concat, difference
} from 'ramda'
import path from 'path'

// Node mutates path by adding to the front, move that to the back if it exists
let originalPath = process.env.PATH || ''
let originalArray = originalPath.split(':')
let cleanArray = reject(contains('node_modules' + path.sep), originalArray)
process.env.PATH = concat(cleanArray, difference(originalArray, cleanArray)).join(':')
