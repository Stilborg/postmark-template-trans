import config from './../transfer-config.json';
import * as postmark from 'postmark'
import * as bluebird from 'bluebird'

export interface IPostmarkCliConfig { 
  source_server: string,
  target_server: string
}

export type PostMarkCliConfigProvider = () => IPostmarkCliConfig 

export type ClientFactory = (apiToken: string) => postmark.Client

/**
 * getPostmarkCliConfigFromFile
 * Provides a configuration object with access information to the source and target servers
 * @interface PostMarkCliConfigProvider
 */
export const getPostmarkCliConfigFromFile = function (): IPostmarkCliConfig { 
  return config
}

export const getPostmarkClient = function (apiToken: string): postmark.Client {
  const c = new postmark.Client(apiToken)
  return c
} 

/**
 * transferAllTemplates
 * Main execution point that handles the transferral of templates
 * @param confProvider 
 * @param clientFactory
 * @param outputChannel 
 */
export const transferAllTemplates = async function (confProvider: PostMarkCliConfigProvider, clientFactory: ClientFactory, outputChannel: Function): Promise<void> { 
  const config = confProvider()
  const source_server = clientFactory(config.source_server)
  const target_server = clientFactory(config.target_server)
  
  const templates = await source_server.getTemplates()
  const templateIds = templates.Templates.map(item => item.TemplateId)

  const target_templates = await target_server.getTemplates()
  outputChannel(`templates on target: ${target_templates.TotalCount}`)

  await bluebird.Promise.each(templateIds, async (id: number) => { 
    const template = await source_server.getTemplate(id)
    //const templateRequest = new postmark.Models.CreateTemplateRequest(template.Name, template.Subject, template.HtmlBody, template.TextBody, template.Alias, template.TemplateType, template.LayoutTemplate)

    // const new_template = await target_server.createTemplate(templateRequest)
    // await outputChannel(`Old templateId: ${template.TemplateId} => New templateId: ${new_template.TemplateId}`)
  })

  outputChannel(`Total number of templates: ${templates.TotalCount}`)
}

export const backupAllTemplatesToFile = async function (apiToken: string, clientFactory: ClientFactory, outputChannel: Function): Promise<void> { 
  // Finish this bit first
  console.log('write backup to file')
}

export const importTemplatesFromFile = async function (apiToken: string, clientFactory: ClientFactory, fileWriter: Function, outputChannel: Function): Promise<void> { 

} 
