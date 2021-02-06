import {PackageVersionInfo, Pubspec} from './interfaces'

export function udpatePubspecDependencies(
  pubspec: Pubspec,
  dependencies: PackageVersionInfo[]
): Pubspec {
  let updatedPubspec = Object.assign({}, pubspec)
  for (const packageInfo of dependencies) {
    updatedPubspec = updatePackageToResolvableVersion(
      updatedPubspec,
      packageInfo.packageName,
      packageInfo.resolvableVersion as string
    )
  }

  return updatedPubspec
}

export function updatePubspecDevDependencies(
  pubspec: Pubspec,
  devDependencies: PackageVersionInfo[]
): Pubspec {
  let updatedPubspec = Object.assign({}, pubspec)

  for (const packageInfo of devDependencies) {
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
  const packageNameToSkip = ['flutter', 'footer', 'flutter_test']

  if (packageNameToSkip.includes(packageName)) {
    return pubspec
  }

  const newVersion = `^${resolvableVersion}`

  const updatedPubspec = Object.assign({}, pubspec)

  if (isDevDependencies) {
    updatedPubspec.dev_dependencies[packageName] = newVersion
  } else {
    updatedPubspec.dependencies[packageName] = newVersion
  }

  return updatedPubspec
}
