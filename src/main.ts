import * as core from '@actions/core'
import {runFlutterPubGet} from './flutterCli'
import {getOutdatedPackages} from './outdatedPackages'
import {readPubspec, updateAllPackagesInPubspec} from './pubspecService'

async function run(): Promise<void> {
  const pathToPubspecFile = core.getInput('pathToPubspecFile')

  try {
    core.info('Get packages written in pubspec.yaml.')
    await runFlutterPubGet()

    core.info(`Reading pubspec yaml located at ${pathToPubspecFile}.`)
    const pubspec = readPubspec(pathToPubspecFile)

    core.info('Get info about outdated packages.')
    const outdatedPackages = await getOutdatedPackages()

    core.info('Update content of pubspec.yaml.')
    updateAllPackagesInPubspec(pathToPubspecFile, pubspec, outdatedPackages)

    core.info('Get packages written in pubspec.yaml (with updated versions).')
    await runFlutterPubGet()
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
