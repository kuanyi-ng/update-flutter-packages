import * as fs from 'fs'
import * as yaml from 'js-yaml'
import {Pubspec} from './interfaces'

export function writePubspec(pubspec: Pubspec): void {
  writeYaml(pubspec, './pubspec.yaml')
}

export function writeYaml(obj: object, pathToYamlFile: string): void {
  try {
    const output = yaml.dump(obj)
    fs.writeFileSync(pathToYamlFile, output)
  } catch (error) {
    throw Error(`
    an error occured during writing of yaml file.
    error: ${error}
    `)
  }
}
