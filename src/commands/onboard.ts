import { GluegunCommand } from 'gluegun'

import { SolidarityRunContext, SolidaritySettings } from '../types'

namespace Onboard {
  export const run = async (context: SolidarityRunContext) => {
    const { onboardAdd, printWizard, executeAddRule, addMore, reviewAndSave } = require('../extensions/functions/onboard')
    const { print, prompt, filesystem } = context

    // check is there an existing .solidarity file?
    // TODO:  Delete file for them
    // TODO BONUS: Eventually allow live editor to modify .solidarity files
    if (filesystem.exists('.solidarity')) {
      print.info('There seems to already be a Solidarity file.  If you would like to use onboarding you will need to delete it!')
      /*
      const userAnswer = await prompt.ask({
        name: 'createFile',
        type: 'confirm',
        message: 'Existing `.solidarity` file found for this project.  Would you like to delete it and start fresh?',
      })

      if (userAnswer.createFile) {
        print.info('create wut?')
      } else {
        print.info('No Solidarity File')
      }
      */
    } else {

      context.bufferSettings = {
        requirements: {}
      }

      printWizard(context)
      let repeat = true
      while (repeat) {
        // Find out what they wanted
        let answer = await onboardAdd(context)
        // execute their will
        executeAddRule(context, answer)
        // more?
        repeat = await addMore(context)
      }

      reviewAndSave(context)

    }
  }
}

module.exports = {
  description: 'Wizard walkthrough to create your Solidarity file',
  alias: 'o',
  run: Onboard.run,
} as GluegunCommand
