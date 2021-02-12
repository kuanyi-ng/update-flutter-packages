import YAML from 'yaml'
import {Pair, YAMLMap} from 'yaml/types'
import * as fs from 'fs'

export function readYaml(pathToYamlFile: string): YAML.Document.Parsed {
  const yamlFile = fs.readFileSync(pathToYamlFile, 'utf-8')
  return YAML.parseDocument(yamlFile)
}

export function writeYaml()
