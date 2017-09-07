// Glue it all to gluegun
console.log('RUNNING')

// ready
const { build } = require('gluegun')

// aim
const runtime = build()
  .brand('nachos')
  .loadDefault(`${__dirname}/core-plugins/`)
  .createRuntime()

// fire!
runtime.run()
console.log('FINISHED')
