import { SolidarityRunContext } from '../../types'
module.exports = (settings: object, context: SolidarityRunContext): void => {
  const { print, filesystem } = context

  try {
    // Write file
    filesystem.write('.solidarity', JSON.stringify(settings, null, 2), {atomic: true})
  } catch (e) {
    print.error(e)
    process.exit(1)
  }
}
