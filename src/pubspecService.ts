import YAML from 'yaml'
import {Packages} from './interfaces'
import {Pubspec, readYaml, writeYaml} from './yamlService'

export function readPubspec(pathToPubspec: string): YAML.Document.Parsed {
  return readYaml(pathToPubspec)
}

export function writePubspec(pubspec: Pubspec, pathToPubspec: string): void {
  writeYaml(pubspec, pathToPubspec)
}

export function updatePubspecForAllPackages(
  pubspec: Pubspec,
  outdatedPackages: Packages,
  pathToPubspecFile: string
): void {
  // create a copy of the current pubspec
  let updatedPubspec = pubspec

  // update dependencies
  for (const packageInfo of outdatedPackages.dependencies) {
    updatedPubspec = updatePackageToResolvableVersion(
      updatedPubspec,
      packageInfo.packageName,
      packageInfo.resolvableVersion as string
    )
  }

  // update dev_dependencies
  for (const packageInfo of outdatedPackages.devDependencies) {
    updatedPubspec = updatePackageToResolvableVersion(
      updatedPubspec,
      packageInfo.packageName,
      packageInfo.resolvableVersion as string,
      true
    )
  }

  // write the changes to pubspec.yaml
  writePubspec(updatedPubspec, pathToPubspecFile)
}

export function updatePackages(
  pubspec: Pubspec,
  outdatedPackages: Packages
): Pubspec {
  let updatedPubspec = pubspec

  // update dependencies
  for (const packageInfo of outdatedPackages.dependencies) {
    updatedPubspec = updatePackageToResolvableVersion(
      updatedPubspec,
      packageInfo.packageName,
      packageInfo.resolvableVersion as string
    )
  }

  // update dev_dependencies
  for (const packageInfo of outdatedPackages.devDependencies) {
    updatedPubspec = updatePackageToResolvableVersion(
      updatedPubspec,
      packageInfo.packageName,
      packageInfo.resolvableVersion as string,
      true
    )
  }

  return updatedPubspec
}

export function updatePackageToResolvableVersion(
  pubspec: Pubspec,
  packageName: string,
  resolvableVersion: string,
  isDevDependencies = false
): Pubspec {
  // doesn't update when a package is an element of packageNameToSkip
  // as these packages have different format (type) from usual packages
  // (there's no version related info written in them)
  const packageNameToSkip = ['flutter', 'footer', 'flutter_test']
  if (packageNameToSkip.includes(packageName)) {
    return pubspec
  }

  const section = isDevDependencies ? 'dev_dependencies' : 'dependencies'
  const packageExists = pubspec.hasIn([section, packageName])

  // only update package's version when it exists
  if (packageExists) {
    pubspec.setIn([section, packageName], `^${resolvableVersion}`)
  }

  return pubspec
}
