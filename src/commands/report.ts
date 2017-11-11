import { GluegunCommand } from 'gluegun'
import { print as envinfoPrint } from 'envinfo'

module.exports = {
  alias: 'r',
  description: 'Report identify info about the current machine',
  run: context => {
    envinfoPrint({
      cpu: true, // add cpu details in environment
      // Off by default, bc might not have package.json
      // perhaps use in verbose
      duplicates: false, // package duplicate versions in parentheses
      packages: false // package.json version details
    })
  }
} as GluegunCommand
