/* eslint-disable @typescript-eslint/no-unused-vars */
import * as core from '@actions/core'
import {getOutdatedPackages} from './outdated'
import {readPubspec, writePubspec, updatePackages} from './pubspecService'

async function run(): Promise<void> {
  const pathToPubspecFile = core.getInput('pathToPubspecFile')
  const preferToSplitPrs = core.getInput('preferToSplitPrs')
  // eslint-disable-next-line no-console
  console.log(pathToPubspecFile, preferToSplitPrs)

  // try {
  //   // read pubspec.yaml
  //   const pubspec = readPubspec()

  //   // get outdated package
  //   const outdatedPackages = await getOutdatedPackages()

  //   // update pubspec
  //   const updatedPubspec = updatePackages(pubspec, outdatedPackages)

  //   // write to pubspec.yaml
  //   writePubspec(updatedPubspec)
  // } catch (error) {
  //   core.setFailed(error.message)
  // }
}

run()
