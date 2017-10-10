const fs = require('fs')

module.exports = (rule, context) => {
  return fs.existsSync(rule.location)
}
