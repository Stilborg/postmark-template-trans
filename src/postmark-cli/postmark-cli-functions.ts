import config from './../transfer-config.json'
import * as postmark from 'postmark'
import * as bluebird from 'bluebird'
import {
  IPostmarkCliTemplateStorageObject,
  TPostmarkCliTemplateStorageObjectWrapper,
  TPostmarkCliTemplateStorageObjectWriter,
} from './postmark-cli-storage.js'
import { TPostmarkCliTemplateTransferReportWriter, IPostmarkCliTemplateTransferReport } from './postmark-cli-reports.js'

export interface IPostmarkCliConfig {
  source_server: string
  target_server: string
}

export type PostMarkCliConfigProvider = () => IPostmarkCliConfig
export type ClientFactory = (apiToken: string) => postmark.Client
export type TPostmarkCliTemplateListProvider = (
  postmark_server: postmark.ServerClient,
) => Promise<postmark.Models.Template[]>

/**
 * getPostmarkCliConfigFromFile
 * Provides a configuration object with access information to the source and target servers
 * @interface PostMarkCliConfigProvider
 */
export const getPostmarkCliConfigFromFile = function(): IPostmarkCliConfig {
  return config
}

export const getPostmarkClient = function(apiToken: string): postmark.Client {
  return new postmark.Client(apiToken)
}

/**
 * templateListProvider
 * @param postmark_client
 * @interfacee TPostmarkCliTemplateListProvider
 */
export const templateListProvider = async function(
  postmark_client: postmark.ServerClient,
): Promise<postmark.Models.Template[]> {
  const templates = await postmark_client.getTemplates()
  const templateIds = templates.Templates.map(item => item.TemplateId)
  const template_list: postmark.Models.Template[] = []
  await bluebird.Promise.each(templateIds, async (id: number) => {
    const template = await postmark_client.getTemplate(id)
    template_list.push(template)
  })
  return template_list
}

/**
 * transferAllTemplates
 * Main execution point that handles the transferral of templates
 * @param confProvider
 * @param clientFactory
 * @param outputChannel
 */
export const transferAllTemplates = async function(
  confProvider: PostMarkCliConfigProvider,
  clientFactory: ClientFactory,
  fetchTemplateList: TPostmarkCliTemplateListProvider,
  writeReport: TPostmarkCliTemplateTransferReportWriter,
): Promise<void> {
  const config = confProvider()
  const source_server = clientFactory(config.source_server)
  const target_server = clientFactory(config.target_server)

  const source_templates = await fetchTemplateList(source_server)

  const target_templates = await fetchTemplateList(target_server)

  const report: IPostmarkCliTemplateTransferReport = { created_date: new Date(), lines: [] }

  await bluebird.Promise.each(source_templates, async (template: postmark.Models.Template) => {
    const templateRequest = new postmark.Models.CreateTemplateRequest(
      template.Name,
      template.Subject,
      template.HtmlBody,
      template.TextBody,
      template.Alias,
      template.TemplateType,
      template.LayoutTemplate,
    )

    // Does the template already exist on the target system?
    const found = target_templates.find((target_template: postmark.Models.Template) => {
      if (template.Name === target_template.Name) {
        return target_template
      }
    })
    // Update or Create
    const new_template = found
      ? await target_server.editTemplate(found.TemplateId, templateRequest)
      : await target_server.createTemplate(templateRequest)

    const line = `From old templateId: ${template.TemplateId} => ${found ? 'Updated' : 'Created'} => new templateId : ${
      new_template.TemplateId
    }`
    report.lines.push(line)
    // write the transition data to a report writer
    console.log(line)
  })
  await writeReport(report)
}

export const backupAllTemplatesToFile = async function(
  apiToken: string,
  createClient: ClientFactory,
  fetchTemplateList: TPostmarkCliTemplateListProvider,
  wrapForStorage: TPostmarkCliTemplateStorageObjectWrapper,
  writeToFile: TPostmarkCliTemplateStorageObjectWriter,
): Promise<void> {
  // Finish this bit first
  const postmark_server = createClient(apiToken)

  // Should be provided as a param
  const postmark_templates = await fetchTemplateList(postmark_server)

  // Wrap into storage object
  const storageObject = wrapForStorage(postmark_templates)

  const result = await writeToFile(storageObject!)

  console.log(`Backed up ${result.templateCount} templates in: '${result.filepath}'`)
}
