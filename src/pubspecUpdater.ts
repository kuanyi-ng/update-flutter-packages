import {Pubspec} from './interfaces'

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
