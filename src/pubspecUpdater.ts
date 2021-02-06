import {Packages, PackageVersionInfo, Pubspec} from './interfaces'

export function updatePubspecToResolvableVersion(
  pubspec: Pubspec,
  outdatedPackages: Packages
): Pubspec {
  let updatedPubspec = copyOfPubspec(pubspec)

  updatedPubspec = updatePubspecDependencies(
    pubspec,
    outdatedPackages.dependencies
  )
  updatedPubspec = updatePubspecDevDependencies(
    pubspec,
    outdatedPackages.devDependencies
  )

  return updatedPubspec
}

export function updatePubspecDependencies(
  pubspec: Pubspec,
  dependencies: PackageVersionInfo[]
): Pubspec {
  let updatedPubspec = copyOfPubspec(pubspec)

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
  let updatedPubspec = copyOfPubspec(pubspec)

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

  const updatedPubspec = copyOfPubspec(pubspec)

  if (isDevDependencies) {
    updatedPubspec.dev_dependencies[packageName] = newVersion
  } else {
    updatedPubspec.dependencies[packageName] = newVersion
  }

  return updatedPubspec
}

function copyOfPubspec(pubspec: Pubspec): Pubspec {
  return Object.assign({}, pubspec)
}
