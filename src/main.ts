/* eslint-disable i18n-text/no-en */
import * as core from '@actions/core'
import {runFlutterPubGet} from './flutter-cli'
import {checkIfUpdatesRequired, getOutdatedPackages} from './outdated-packages'
import {readPubspec, updateAllPackagesInPubspec} from './pubspec-service'

async function run(): Promise<void> {
  const pathToPubspecFile = core.getInput('pathToPubspecFile')

  try {
    core.info('Get packages written in pubspec.yaml.')
    await runFlutterPubGet()

    core.info(`Reading pubspec yaml located at ${pathToPubspecFile}.`)
    const pubspec = readPubspec(pathToPubspecFile)

    core.info('Get info about outdated packages.')
    const outdatedPackages = await getOutdatedPackages()

    core.info('Check if any updates is required.')
    const updatesRequired = checkIfUpdatesRequired(outdatedPackages)

    // eslint-disable-next-line no-console
    console.log(outdatedPackages)

    if (updatesRequired) {
      core.info('Update content of pubspec.yaml.')
      updateAllPackagesInPubspec(pathToPubspecFile, pubspec, outdatedPackages)

      core.info('Get packages written in pubspec.yaml (with updated versions).')
      await runFlutterPubGet()
    } else {
      core.info('All packages are up to date.')
    }

    // pullRequestRequired output will be used in workflow file
    // to decide if a new pull request should be made or not
    core.setOutput('pullRequestRequired', updatesRequired)
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
