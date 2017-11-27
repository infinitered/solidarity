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
  getLineWithVersion: require('./extensions/functions/getLineWithVersion'),
  reviewRule: require('./extensions/functions/reviewRule')
}

export interface SolidarityPlugin {
  readonly name: string
  readonly description: string
  readonly snapshot: string | SnapshotType
}

export interface SolidarityRunContext extends GluegunRunContext {
  solidarity: typeof solidarity
  _pluginsList: Array<SolidarityPlugin & { templateDirectory: string }>
  addPlugin: (config: SolidarityPlugin) => void
  printSeparator: () => void
  outputMode: SolidarityOutputMode
}

export type SnapshotType = (context: SolidarityRunContext) => Promise<void>

export interface CLIRule {
  readonly rule: 'cli'
  readonly binary: string
  semver?: string // updatable
  readonly version?: string
  readonly line?: string | number
  readonly error?: string
  readonly matchIndex?: number
  readonly platform?: string | string[]
}

export interface ENVRule {
  readonly rule: 'env'
  readonly variable: string
  readonly error?: string
  readonly platform?: string | string[]
}

export interface FSRule {
  readonly rule: 'dir' | 'directory' | 'file'
  readonly location: string
  readonly error?: string
  readonly platform?: string | string[]
}

// discriminated union for rule sets
export type SolidarityRule = CLIRule | ENVRule | FSRule

export enum SolidarityOutputMode {
  MODERATE,
  VERBOSE,
  SILENT
}

export const enum FriendlyMessages {
  NONE = 'NONE',
  NOTHING = 'Nothing to do ¯\\_(ツ)_/¯'
}

export type SolidarityRequirement = SolidarityRule[]
export type SolidarityRequirementChunk = [string, SolidarityRequirement]
export interface SolidarityConfig {
  output: SolidarityOutputMode
}

export interface SolidaritySettings {
  readonly requirements: object
  readonly config: SolidarityConfig
}

export interface SolidarityReportResults {
  basicInfo: Array<Array<string>>
  cliRules: Array<Array<string>>
  envRules: Array<Array<string>>
  filesystemRules: Array<Array<string>>
}
