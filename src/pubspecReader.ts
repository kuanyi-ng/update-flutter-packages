import * as fs from 'fs'
import * as yaml from 'js-yaml'
import {Pubspec} from './interfaces'

export function readPubspec(): Pubspec {
  return readYaml('./pubspec.yaml')
}

function readYaml(pathToYamlFile: string): Pubspec {
  let doc

  try {
    doc = yaml.load(fs.readFileSync(pathToYamlFile, 'utf-8')) as Pubspec
  } catch (error) {
    throw Error(`
    an error occured during loading of yaml file.
    error: ${error}
    `)
  }

  return doc
}
