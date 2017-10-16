import { GluegunRunContext } from 'gluegun'
export const solidarity = {
  binaryExists: require('./extensions/functions/binaryExists'),
  getSolidaritySettings: require('./extensions/functions/getSolidaritySettings'),
  setSolidaritySettings: require('./extensions/functions/setSolidaritySettings'),
  checkRequirement: require('./extensions/functions/checkRequirement'),
  updateRequirement: require('./extensions/functions/updateRequirement'),
  skipRule: require('./extensions/functions/skipRule'),
  checkENV: require('./extensions/functions/checkENV'),
  checkCLI: require('./extensions/functions/checkCLI'),
  checkDir: require('./extensions/functions/checkDir'),
  checkFile: require('./extensions/functions/checkFile'),
  updateVersions: require('./extensions/functions/updateVersions'),
  removeNonVersionCharacters: require('./extensions/functions/removeNonVersionCharacters'),
  getVersion: require('./extensions/functions/getVersion'),
  getLineWithVersion: require('./extensions/functions/getLineWithVersion')
}

export interface SolidarityPlugin {
  name: string
  description: string
  snapshot: string | SnapshotType
}

export interface SolidarityRunContext extends GluegunRunContext {
  solidarity: typeof solidarity
  _pluginsList: Array<SolidarityPlugin & {templateDirectory: string}>
  addPlugin: (config: SolidarityPlugin) => void
  printSeparator: () => void
}

export type SnapshotType = (context: SolidarityRunContext) => Promise<void>
