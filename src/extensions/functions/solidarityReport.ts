import { SolidarityRunContext, SolidarityReportResults, CLIReportConfig } from '../../types'

export const createReport = async (context: SolidarityRunContext): Promise<SolidarityReportResults> => {
  const { print, system, envinfo } = context
  const { colors } = print
  const OS = await envinfo.getOSInfo()
  const CPU = await envinfo.getCPUInfo()

  return {
    basicInfo: [
      ['System Basics', 'Value'],
      ['OS', OS],
      ['CPU', CPU],
    ],
    cliRules: [['Binary', 'Location', 'Version', 'Desired']],
    envRules: [['Environment Var', 'Value']],
    filesystemRules: [['Location', 'Type', 'Exists']],
    shellRules: [['Command', 'Pattern', 'Matches']],
    customRules: [],
    // helper for adding CLI rules
    addCLI: function(cliReportConfig: CLIReportConfig) {
      const desired = cliReportConfig.desired ? cliReportConfig.desired : colors.green('*ANY*')
      let location = system.which(cliReportConfig.binary)
      if (Boolean(location) === false) {
        location = colors.red('*MISSING*')
      }
      this.cliRules.push([cliReportConfig.binary, location, cliReportConfig.version, desired])
    },
  }
}
