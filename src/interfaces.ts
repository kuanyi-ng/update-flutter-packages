export interface PackageVersionInfo {
  packageName: string
  currentVersion: string
  upgradableVersion?: string
  resolvableVersion?: string
  latestVersion?: string
}

export interface Packages {
  dependencies: PackageVersionInfo[]
  devDependencies: PackageVersionInfo[]
  transitiveDependencies?: PackageVersionInfo[]
  transitiveDevDependencies?: PackageVersionInfo[]
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
  dependencies: PubspecDependencies
  dev_dependencies: PubspecDependencies
  dependency_overrides?: object
  environment: FlutterSdk
  executables?: object
  publish_to?: string
  flutter: object
  flutter_localizations?: FlutterSdk
}

interface PubspecDependencies {
  [index: string]: string | FlutterSdk | null
}

interface FlutterSdk {
  sdk: string
}
