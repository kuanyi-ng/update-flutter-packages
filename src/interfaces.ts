export interface PackageVersionInfo {
  packageName: string
  currentVersion: string
  upgradableVersion: string
  resolvableVersion: string
  latestVersion?: string
}

export interface Packages {
  dependencies: PackageVersionInfo[]
  devDependencies: PackageVersionInfo[]
  transitiveDependencies?: PackageVersionInfo[]
  transitiveDevDependencies?: PackageVersionInfo[]
}
