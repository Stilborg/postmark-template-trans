import * as os from 'os'
import * as fs from 'fs'

export interface IPostmarkCliTemplateTransferReport {
  created_date: Date
  lines: string[]
}

export interface TPostmarkCliTemplateTransferReportWriterResult {
  filepath: string
}

export type TPostmarkCliTemplateTransferReportWriter = (
  report: IPostmarkCliTemplateTransferReport,
) => Promise<TPostmarkCliTemplateTransferReportWriterResult>

/**
 * Writes the result of the transfer to file, the report contains the mapping of template ids from old to new server
 * @param report
 * @interface TPostmarkCliTemplateTransferReportWriter
 */
export const transferReportWriter = async function(
  report: IPostmarkCliTemplateTransferReport,
): Promise<TPostmarkCliTemplateTransferReportWriterResult> {
  const filepath = `${os.homedir()}/postmark-template-transfer-report.json`
  fs.writeFileSync(filepath, JSON.stringify(report))
  return { filepath }
}
