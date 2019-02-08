import {
  GluegunRunContext,
  GluegunFilesystem,
  GluegunStrings,
  GluegunPrint,
  GluegunSystem,
  GluegunSemver,
  GluegunHttp,
  GluegunPatching,
  GluegunPrompt,
  GluegunTemplate,
  GluegunMeta,
} from 'gluegun'
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
  printResults: require('./extensions/functions/printResults'),
  reviewRule: require('./extensions/functions/reviewRule'),
  buildSpecificRequirement: require('./extensions/functions/buildSpecificRequirement'),
  appendSolidaritySettings: require('./extensions/functions/appendSolidaritySettings'),
  ruleHandlers: require('./extensions/functions/ruleHandlers'),
  createPlugin: require('./extensions/functions/createPlugin'),
}

export interface SolidarityPlugin {
  readonly name: string
  readonly description: string
  readonly snapshot: string | SnapshotType
}

export interface SolidarityRunContext extends GluegunRunContext {
  solidarity: typeof solidarity
  _pluginsList: Array<SolidarityPlugin & { templateDirectory: string | null }>
  addPlugin: (config: SolidarityPlugin) => void
  printSeparator: () => void
  outputMode: SolidarityOutputMode
  envHelpers: any
  filesystem: GluegunFilesystem
  strings: GluegunStrings
  print: GluegunPrint
  system: GluegunSystem
  semver: GluegunSemver
  http: GluegunHttp
  patching: GluegunPatching
  prompt: GluegunPrompt
  template: GluegunTemplate
  meta: GluegunMeta
  bufferSettings?: SolidaritySettings
}

export type SnapshotType = (context: SolidarityRunContext) => Promise<void>

export interface CLIRule {
  readonly rule: 'cli'
  readonly binary: string
  semver?: string // updatable
  readonly version?: string
  readonly line?: string | number
  error?: string // updatable
  readonly matchIndex?: number
  platform?: string | string[]
  ci?: boolean // updatable
}

export interface ENVRule {
  readonly rule: 'env'
  readonly variable: string
  error?: string
  platform?: string | string[]
  ci?: boolean
}

export interface FSRule {
  readonly rule: 'dir' | 'directory' | 'file'
  readonly location: string
  error?: string
  platform?: string | string[]
  ci?: boolean
}

/**
 * Runs a shell command and evaluates the output is what we expect.
 */
export interface ShellRule {
  /**
   * We're a shell rule.
   */
  readonly rule: 'shell'
  /**
   * The command to execute.
   */
  readonly command: string
  /**
   * A regular expression to match the output against.
   *
   * If you add a capture group, it will only target that instead of the whole
   * expression. This is great for selecting a subset.
   */
  readonly match: string
  /**
   * An optional error message to override.
   */
  error?: string
  /**
   * An optional platform or platforms to target.
   */
  platform?: string | string[]
  /**
   * An optional flag to skip rule on CI
   */
  ci?: boolean
}

export interface CustomRule {
  readonly rule: 'custom'
  readonly plugin: string
  readonly name: string
  error?: string
  platform?: string | string[]
  ci?: boolean
}

// discriminated union for rule sets
export type SolidarityRule = CLIRule | ENVRule | FSRule | ShellRule | CustomRule

export interface PluginFind {
  success: boolean
  message?: string
  plugin?: SolidarityRule
}

export enum SolidarityOutputMode {
  MODERATE,
  VERBOSE,
  SILENT,
}

export const enum FriendlyMessages {
  NONE = 'NONE',
  NOTHING = 'Nothing to do ¯\\_(ツ)_/¯',
}

export type SolidarityRequirement = SolidarityRule[]
export type SolidarityRequirementChunk = [string, SolidarityRequirement]
export interface SolidarityConfig {
  output: SolidarityOutputMode
}

export interface SolidaritySettings {
  readonly requirements: object
  readonly config?: SolidarityConfig
}

export interface CustomRulesConfig {
  title: string
  table: Array<Array<string>>
}

export interface SolidarityReportResults {
  basicInfo: Array<Array<string>>
  cliRules: Array<Array<string>>
  envRules: Array<Array<string>>
  filesystemRules: Array<Array<string>>
  shellRules: Array<Array<string>>
  customRules?: Array<CustomRulesConfig>
  addCLI: (cliReportConfig: CLIReportConfig) => void
}

export interface CLIReportConfig {
  binary: string
  version: string
  desired?: string
}
