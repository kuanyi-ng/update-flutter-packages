import {PackageVersionInfo, Packages} from './interfaces'
import {runFlutterPubOutdated} from './flutter-cli'

export async function getOutdatedPackages(): Promise<Packages> {
  const {output, error} = await runFlutterPubOutdated()

  if (error.length > 0) {
    throw Error(`
    an error occured during the execution of flutter pub outdated.
    error: ${error}
    `)
  }

  const outdatedPackages = parseIntoOutdatedPackages(output)

  return {
    dependencies: outdatedPackages.dependencies,
    devDependencies: outdatedPackages.devDependencies
  }
}

export function parseIntoOutdatedPackages(outputFromConsole: string): Packages {
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
): PackageVersionInfo[][] {
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

  return sections.map(parseIntoArrayOfPackageVersionInfo)
}

export function parseIntoArrayOfPackageVersionInfo(
  section: string[]
): PackageVersionInfo[] {
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
    currentVersion: refineVersionText(dependency[1]),
    upgradableVersion: refineVersionText(dependency[2]),
    resolvableVersion: refineVersionText(dependency[3]),
    latestVersion: refineVersionText(dependency[4])
  }
}

export function checkIfUpdatesRequired(outdatedPackages: Packages): boolean {
  const dependenciesUpdateRequired = outdatedPackages.dependencies.length > 0
  const devDependenciesUpdatesRequired =
    outdatedPackages.devDependencies.length > 0

  return dependenciesUpdateRequired || devDependenciesUpdatesRequired
}

function refineVersionText(versionText: string): string {
  return versionText.replace('*', '')
}

export function splitAndRemoveEmptyString(
  targetString: string,
  separator: string
): string[] {
  return targetString.split(separator).filter(element => element !== '')
}
