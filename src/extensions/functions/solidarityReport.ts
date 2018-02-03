import { SolidarityReportResults } from '../../types'
import { helpers } from 'envinfo'

export const createReport = (): SolidarityReportResults => {
  return {
    basicInfo: [['System Basics', 'Value'], ['OS', helpers.getOperatingSystemInfo()], ['CPU', helpers.getCPUInfo()]],
    cliRules: [['Binary', 'Location', 'Version', 'Desired']],
    envRules: [['Environment Var', 'Value']],
    filesystemRules: [['Location', 'Type', 'Exists']],
    shellRules: [['Command', 'Pattern', 'Matches']],
  }
}
