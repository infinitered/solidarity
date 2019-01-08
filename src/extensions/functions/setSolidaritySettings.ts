import { SolidarityToolbox, SolidaritySettings } from '../../types'
module.exports = (settings: SolidaritySettings, context: SolidarityToolbox): void => {
  const { filesystem } = context

  if (settings.requirements) {
    // Write file
    filesystem.write('.solidarity', JSON.stringify(settings, null, 2), { atomic: true })
  } else {
    throw 'You must have a requirements key to be a valid solidarity file'
  }
}
