import {exec, ExecOptions} from '@actions/exec'

export async function outdatedPackages(): Promise<Dependencies> {
  let output = ''
  let error = ''

  const options: ExecOptions = {}
  options.silent = true
  options.listeners = {
    stdout: (data: Buffer) => {
      output += data.toString()
    },
    stderr: (data: Buffer) => {
      error += data.toString()
    }
  }

  await exec('flutter', ['pub', 'outdated'], options)

  // TODO: error handling when error is emptyString

  const dependencies = parseFlutterPubOutdatedOutput(output)

  return {
    dependencies: dependencies.dependencies,
    devDependencies: dependencies.devDependencies
  }
}

export function parseFlutterPubOutdatedOutput(
  outputFromConsole: string
): Dependencies {
  const dependencySections = splitIntoDependencySections(outputFromConsole)

  return {
    dependencies: dependencySections[0],
    devDependencies: dependencySections[1],
    transitiveDependencies: dependencySections[2],
    transitiveDevDependencies: dependencySections[3]
  }
}

export function splitIntoDependencySections(
  fullText: string
): DependencySection[] {
  // title of each dependency section
  const dependencySections = [
    'Dependencies',
    'dev_dependencies',
    'transitive dependencies',
    'transitive dev_dependencies'
  ]

  // split fullText into lines
  const lines = splitAndRemoveEmptyString(fullText, '\n')

  // find the starting index of each section
  const sectionStartIndexes: number[] = []
  for (const sectionTitle of dependencySections) {
    const newSectionIndex = lines.findIndex(text => text.includes(sectionTitle))
    sectionStartIndexes.push(newSectionIndex)
  }

  // split lines into different sections
  const sections: string[][] = []
  for (let i = 0; i < sectionStartIndexes.length; i++) {
    let nextSection: string[]

    // startIndex of current section (excluding the section title)
    const startIndex = sectionStartIndexes[i] + 1

    // if current section is the last section
    if (i + 1 === sectionStartIndexes.length) {
      nextSection = lines.slice(startIndex)
    } else {
      const endIndex = sectionStartIndexes[i + 1]
      nextSection = lines.slice(startIndex, endIndex)
    }

    sections.push(nextSection)
  }

  return sections.map(parseIntoDependencySection)
}

export function parseIntoDependencySection(
  section: string[]
): DependencySection {
  const dependencies: string[][] = []

  for (const row of section) {
    const dependencyDetails = splitAndRemoveEmptyString(row, ' ')
    if (dependencyDetails.length === 5) {
      dependencies.push(dependencyDetails)
    }
  }

  return dependencies.map(parseIntoPackageVersionInfo)
}

export function parseIntoPackageVersionInfo(
  dependency: string[]
): PackageVersionInfo {
  return {
    packageName: dependency[0],
    currentVersion: dependency[1],
    upgradableVersion: dependency[2],
    resolvableVersion: dependency[3],
    latestVersion: dependency[4]
  }
}

export function splitAndRemoveEmptyString(
  targetString: string,
  separator: string
): string[] {
  return targetString.split(separator).filter(element => element !== '')
}

//
// Interface
//

export interface PackageVersionInfo {
  packageName: string
  currentVersion: string
  upgradableVersion: string
  resolvableVersion: string
  latestVersion: string
}

export interface DependencySection {
  [index: number]: PackageVersionInfo
}

export interface Dependencies {
  dependencies: DependencySection
  devDependencies: DependencySection
  transitiveDependencies?: DependencySection
  transitiveDevDependencies?: DependencySection
}
