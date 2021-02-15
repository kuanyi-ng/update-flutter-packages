import * as YAML from 'yaml'
import * as interfaces from '../src/interfaces'
import * as pubspecService from '../src/pubspecService'

describe('updatePackageToResolvableVersion', () => {
  let pubspec: YAML.Document.Parsed

  beforeEach(() => {
    pubspec = YAML.parseDocument(`
      name: 'test'
      version: '0.0.0'
      description: 'pubspec for testing'
      environment:
        sdk: '>=2.7.0 <3.0.0'
      dependencies:
        flutter:
          sdk: 'flutter'
        cupertino_icons: '^1.0.0'
        provider: '4.3.2+3'
      dev_dependencies:
        effective_dart: '^1.3.0'
        flutter_test:
          sdk: 'flutter'
      flutter:
        uses-material-design: true
        assets:
    `)
  })

  describe('dependencies', () => {
    it('updates cupertino_icons to ^2.0.0', () => {
      const result = pubspecService.updatePackageToResolvableVersion(
        pubspec,
        'cupertino_icons',
        '2.0.0'
      )

      const expectedResult = YAML.parseDocument(`
        name: 'test'
        version: '0.0.0'
        description: 'pubspec for testing'
        environment:
          sdk: '>=2.7.0 <3.0.0'
        dependencies:
          flutter:
            sdk: 'flutter'
          cupertino_icons: '^2.0.0'
          provider: '4.3.2+3'
        dev_dependencies:
          effective_dart: '^1.3.0'
          flutter_test:
            sdk: 'flutter'
        flutter:
          uses-material-design: true
          assets:
      `)

      expect(result.toJSON()).toStrictEqual(expectedResult.toJSON())
    })
  })

  describe('devDependencies', () => {
    it('updates effective_dart to ^2.0.0', () => {
      const result = pubspecService.updatePackageToResolvableVersion(
        pubspec,
        'effective_dart',
        '2.0.0',
        true
      )

      const expectedResult = YAML.parseDocument(`
      name: 'test'
      version: '0.0.0'
      description: 'pubspec for testing'
      environment:
        sdk: '>=2.7.0 <3.0.0'
      dependencies:
        flutter:
          sdk: 'flutter'
        cupertino_icons: '^1.0.0'
        provider: '4.3.2+3'
      dev_dependencies:
        effective_dart: '^2.0.0'
        flutter_test:
          sdk: 'flutter'
      flutter:
        uses-material-design: true
        assets:
    `)

      expect(result.toJSON()).toStrictEqual(expectedResult.toJSON())
    })
  })
})
