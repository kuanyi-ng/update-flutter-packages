import * as fs from 'fs'
import * as yaml from 'js-yaml'
import {
  DependencySection,
  Packages,
  PackageVersionInfo,
  Pubspec
} from './interfaces'

export function getCurrentPackages(): Packages {
  const pathToPubSpec = './pubspec.yaml'

  const pubspec = readYaml(pathToPubSpec)

  const dependencies = parseIntoDependencySection(pubspec.dependencies)
  const devDependencies = parseIntoDependencySection(pubspec.dev_dependencies)

  return {
    dependencies,
    devDependencies
  }
}

function parseIntoDependencySection(dependencies: object): DependencySection {
  const packageNameToSkip = ['flutter', 'footer', 'flutter_test']

  const dependencySection = []

  for (const [packageName, currentVersion] of Object.entries(dependencies)) {
    if (!packageNameToSkip.includes(packageName)) {
      const dependency: PackageVersionInfo = {
        packageName,
        currentVersion
      }
      dependencySection.push(dependency)
    }
  }

  return dependencySection
}

export function readYaml(pathToYamlFile: string): Pubspec {
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
