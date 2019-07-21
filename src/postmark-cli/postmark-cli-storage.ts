import * as postmark from 'postmark'
import * as os from 'os'
import * as fs from 'fs'

// Interfaces
export interface IPostmarkCliTemplateStorageObject {
  created_date: Date
  total_count: number
  templates: postmark.Models.Template[]
}

export interface IPostmarkCliTemplateStorageResult {
  templateCount: number
  filepath: string
}

// Function types
export type TPostmarkCliTemplateStorageObjectWrapper = (
  templates: postmark.Models.Template[],
) => IPostmarkCliTemplateStorageObject

export type TPostmarkCliTemplateStorageObjectWriter = (
  objectToStore: IPostmarkCliTemplateStorageObject,
) => Promise<IPostmarkCliTemplateStorageResult>

// Functions
/**
 *
 * @param templates
 * @interface TPostmarkCliTemplateStorageObjectWrapper
 */
export const storageObjectWrapper = function(templates: postmark.Models.Template[]): IPostmarkCliTemplateStorageObject {
  return { created_date: new Date(), total_count: templates.length, templates }
}

/**
 * storageObjectWriter
 * @param objectToStore
 * @interface TPostmarkCliTemplateStorageObjectWriter
 */
export const storageObjectWriter = async function(
  objectToStore: IPostmarkCliTemplateStorageObject,
): Promise<IPostmarkCliTemplateStorageResult> {
  const filepath = `${os.homedir()}/postmark-template-backup.json`
  fs.writeFileSync(filepath, JSON.stringify(objectToStore))
  return { templateCount: objectToStore.total_count, filepath }
}

export const storageObjectReader = async function(path: string): Promise<IPostmarkCliTemplateStorageObject> {
  // TODO finish this
  return { created_date: new Date(), total_count: 0, templates: [] }
}
