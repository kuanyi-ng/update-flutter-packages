export interface PackageVersionInfo {
  packageName: string
  currentVersion: string
  upgradableVersion?: string
  resolvableVersion?: string
  latestVersion?: string
}

export interface DependencySection {
  [index: number]: PackageVersionInfo
}

export interface Packages {
  dependencies: DependencySection
  devDependencies: DependencySection
  transitiveDependencies?: DependencySection
  transitiveDevDependencies?: DependencySection
}

// https://dart.dev/tools/pub/pubspec
export interface Pubspec {
  name: string
  version: string
  description: string
  homepage?: string
  repository?: string
  issue_tracker?: string
  documentation?: string
  dependencies: object
  dev_dependencies: object
  dependency_overrides?: object
  environment: FlutterSdk
  executables?: object
  publish_to?: string
  flutter: object
  flutter_localizations?: FlutterSdk
}

interface FlutterSdk {
  sdk: string
}
