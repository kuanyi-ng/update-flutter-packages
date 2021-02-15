import * as outdated from '../src/outdatedPackages'
import * as interfaces from '../src/interfaces'

describe('splitAndRemoveEmptyString', () => {
  it('split a long string into string[] and remove empty string', () => {
    const longStringWithExtraEmptySpaces =
      'Lorem   ipsum  dolor  sit   amet   consectetur  adipiscing  elit'
    const result = outdated.splitAndRemoveEmptyString(
      longStringWithExtraEmptySpaces,
      ' '
    )
    const expectedResult = [
      'Lorem',
      'ipsum',
      'dolor',
      'sit',
      'amet',
      'consectetur',
      'adipiscing',
      'elit'
    ]
    expect(result).toStrictEqual(expectedResult)
  })
})

describe('parseIntoPackageVersionInfo', () => {
  it('convert an array of string (length of 5) into PackageVersionInfo', () => {
    const arrayOfString = ['Donec', 'nec', 'libero', 'et', 'lorem']
    const result = outdated.parseIntoPackageVersionInfo(arrayOfString)
    const expectedResult: interfaces.PackageVersionInfo = {
      packageName: 'Donec',
      currentVersion: 'nec',
      upgradableVersion: 'libero',
      resolvableVersion: 'et',
      latestVersion: 'lorem'
    }

    expect(result).toStrictEqual(expectedResult)
  })
})

describe('parseIntoArrayOfPackageVersionInfo', () => {
  it('convert an array of string (without the first element) into DependencySection', () => {
    const arrayOfString = [
      'Phasellus vel mauris nec massa',
      'Nulla id dui malesuada lacus porttitor pulvinar',
      'Nullam ac dolor ac sapien'
    ]
    const result = outdated.parseIntoArrayOfPackageVersionInfo(arrayOfString)
    const expectedResult: interfaces.PackageVersionInfo[] = [
      {
        packageName: 'Phasellus',
        currentVersion: 'vel',
        upgradableVersion: 'mauris',
        resolvableVersion: 'nec',
        latestVersion: 'massa'
      },
      {
        packageName: 'Nullam',
        currentVersion: 'ac',
        upgradableVersion: 'dolor',
        resolvableVersion: 'ac',
        latestVersion: 'sapien'
      }
    ]

    expect(result).toStrictEqual(expectedResult)
  })
})

describe('splitIntoDependencySections', () => {
  it('convert an multiline string into 4 DependencySections', () => {
    const multiLineString = `
      Dependencies
      Cras a diam pellentesque imperdiet
      dev_dependencies
      Sed gravida ligula sit amet
      transitive dependencies
      Curabitur eleifend diam at egestas
      transitive dev_dependencies
      Sed dignissim nunc et velit
      Mauris sed nulla et risus placerat blandit vel non turpis
    `
    const result = outdated.splitIntoDependencySections(multiLineString)
    const expectedResult: interfaces.PackageVersionInfo[][] = [
      [
        {
          packageName: 'Cras',
          currentVersion: 'a',
          upgradableVersion: 'diam',
          resolvableVersion: 'pellentesque',
          latestVersion: 'imperdiet'
        }
      ],
      [
        {
          packageName: 'Sed',
          currentVersion: 'gravida',
          upgradableVersion: 'ligula',
          resolvableVersion: 'sit',
          latestVersion: 'amet'
        }
      ],
      [
        {
          packageName: 'Curabitur',
          currentVersion: 'eleifend',
          upgradableVersion: 'diam',
          resolvableVersion: 'at',
          latestVersion: 'egestas'
        }
      ],
      [
        {
          packageName: 'Sed',
          currentVersion: 'dignissim',
          upgradableVersion: 'nunc',
          resolvableVersion: 'et',
          latestVersion: 'velit'
        }
      ]
    ]

    expect(result.length).toStrictEqual(4)
    expect(result).toStrictEqual(expectedResult)
  })
})
