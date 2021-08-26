import YAML from 'yaml'
import * as fs from 'fs'

export function readYaml(pathToYamlFile: string): YAML.Document.Parsed {
  try {
    const yamlFile = fs.readFileSync(pathToYamlFile, 'utf-8')
    return YAML.parseDocument(yamlFile)
  } catch (error) {
    throw Error(`
    an error occured during loading of yaml file.
    error: ${error}
    `)
  }
}

export function writeYaml(
  yamlDoc: YAML.Document.Parsed,
  pathToYamlFile: string
): void {
  try {
    const yamlInString = yamlDoc.toString()
    fs.writeFileSync(pathToYamlFile, yamlInString)
  } catch (error) {
    throw Error(`
    an error occured during writing of yaml file.
    error: ${error}
    `)
  }
}

export type Pubspec = YAML.Document.Parsed
