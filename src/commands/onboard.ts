import { GluegunCommand } from 'gluegun'

import { SolidarityToolbox } from '../types'

namespace Snapshot {
  export const run = async (context: SolidarityToolbox) => {
    const { print, prompt, filesystem } = context

    // check is there an existing .solidarity file?
    if (filesystem.exists('.solidarity')) {
      print.info('you have a solidarity file')
    } else {
      // Find out what they wanted
      const userAnswer = await prompt.ask({
        name: 'createFile',
        type: 'confirm',
        message: 'No `.solidarity` file found for this project.  Would you like to create one?',
      })

      if (userAnswer.createFile) {
        print.info('create wut?')
      } else {
        print.info('No Solidarity File')
      }
    }
  }
}

module.exports = {
  description: 'Wizard walkthrough to create your Solidarity file',
  alias: 'o',
  run: Snapshot.run,
} as GluegunCommand
