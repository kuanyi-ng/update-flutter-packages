import * as core from '@actions/core'
import {getOutdatedPackages} from './outdated'
import {readPubspec, updateAllPackagesInPubspec} from './pubspecService'

async function run(): Promise<void> {
  const pathToPubspecFile = core.getInput('pathToPubspecFile')

  try {
    core.info(`Reading pubspec yaml located at ${pathToPubspecFile}`)
    const pubspec = readPubspec(pathToPubspecFile)

    core.info('Get info about outdated packages')
    const outdatedPackages = await getOutdatedPackages()

    core.info('Update content of pubspec.yaml')
    updateAllPackagesInPubspec(pathToPubspecFile, pubspec, outdatedPackages)
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
