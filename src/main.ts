/* eslint-disable no-console */
import * as core from '@actions/core'
import {getOutdatedPackages} from './outdated'
import {readPubspec, updateAllPackagesInPubspec} from './pubspecService'

async function run(): Promise<void> {
  const pathToPubspecFile = core.getInput('pathToPubspecFile')

  try {
    // read pubspec.yaml
    const pubspec = readPubspec(pathToPubspecFile)

    // get outdated package
    const outdatedPackages = await getOutdatedPackages()
    console.log(outdatedPackages)

    // combine all packages' updates into one PR
    updateAllPackagesInPubspec(pathToPubspecFile, pubspec, outdatedPackages)
    console.log(readPubspec(pathToPubspecFile).toString())
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
