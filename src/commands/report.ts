import { GluegunCommand } from 'gluegun'
import { print as envinfoPrint } from 'envinfo'

module.exports = {
  alias: 'r',
  description: 'Report an issue',
  run: context => {
    envinfoPrint({
      cpu: true, // add cpu details in environment
      duplicates: true, // package duplicate versions in parentheses
      packages: true // package.json version details
    })
  }
} as GluegunCommand
