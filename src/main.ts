import * as core from '@actions/core'
import {getOutdatedPackages} from './outdated'
import {readPubspec, writePubspec, updatePackages} from './pubspecService'

async function run(): Promise<void> {
  const pathToPubspecFile = core.getInput('pathToPubspecFile')
  // change preferToSplitPrs (input) from string to boolean type
  const preferToSplitPrs = core.getInput('preferToSplitPrs') === 'true'

  try {
    // read pubspec.yaml
    const pubspec = readPubspec(pathToPubspecFile)

    // get outdated package
    const outdatedPackages = await getOutdatedPackages()

    if (preferToSplitPrs) {
      // update and open a new PR for each package
      // eslint-disable-next-line no-console
      console.log('preferToSplitPrs')
    } else {
      // combine all packages' updates into one PR
      // update pubspec
      const updatedPubspec = updatePackages(pubspec, outdatedPackages)

      // write to pubspec.yaml
      writePubspec(updatedPubspec, pathToPubspecFile)
      // eslint-disable-next-line no-console
      console.log(readPubspec(pathToPubspecFile).toString())
    }
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
