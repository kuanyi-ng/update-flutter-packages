/* eslint-disable no-console */
import * as core from '@actions/core'
import {getOutdatedPackages} from './outdated'
import {
  readPubspec,
  updateAllPackagesInPubspec,
  updateOnePackageInPubspec
} from './pubspecService'

async function run(): Promise<void> {
  const pathToPubspecFile = core.getInput('pathToPubspecFile')
  // change preferToSplitPrs (input) from string to boolean type
  const preferToSplitPrs = core.getInput('preferToSplitPrs') === 'true'

  try {
    // read pubspec.yaml
    const pubspec = readPubspec(pathToPubspecFile)

    // get outdated package
    const outdatedPackages = await getOutdatedPackages()
    console.log(outdatedPackages)

    if (preferToSplitPrs) {
      // update and open a new PR for each package
      // update dependencies
      for (const packageInfo of outdatedPackages.dependencies) {
        console.log(packageInfo)
        updateOnePackageInPubspec(pathToPubspecFile, pubspec, packageInfo)
        console.log(readPubspec(pathToPubspecFile).toString())
      }

      // update dev_dependencies
      for (const packageInfo of outdatedPackages.devDependencies) {
        console.log(packageInfo)
        updateOnePackageInPubspec(pathToPubspecFile, pubspec, packageInfo, true)
        console.log(readPubspec(pathToPubspecFile).toString())
      }
    } else {
      // combine all packages' updates into one PR
      updateAllPackagesInPubspec(pathToPubspecFile, pubspec, outdatedPackages)
      console.log(readPubspec(pathToPubspecFile).toString())
    }
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
