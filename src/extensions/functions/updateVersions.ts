import { SolidarityRunContext } from '../../types'
import * as pluralize from 'pluralize'

module.exports = async (context: SolidarityRunContext): Promise<void> => {
  const { map, toPairs, isEmpty, flatten } = require('ramda')
  const { solidarity, print } = context
  const {
    getSolidaritySettings,
    setSolidaritySettings,
    updateRequirement
  } = solidarity

  // load current solidarity file
  const solidaritySettings = getSolidaritySettings(context)

  // Map over requirements with option to mutate settings
  const checks = await map(
    async requirement => updateRequirement(requirement, solidaritySettings.requirements, context),
    toPairs(solidaritySettings.requirements)
  )

  // run the array of promises you just created
  await Promise.all(checks)
    .then(results => {
      const updates = flatten(results)
      if (isEmpty(updates)) {
        print.success('\n No Changes')
      } else {
        setSolidaritySettings(solidaritySettings, context)
        const ruleMessage = pluralize('Rule', updates.length, true)
        print.success(`\n ${ruleMessage} updated`)
      }
    })
    .catch(err => {
      print.error(err)
      process.exit(2)
    })

}
