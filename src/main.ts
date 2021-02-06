import * as core from '@actions/core'
import {getOutdatedPackages} from './outdated'
import {getCurrentPackages, readPubspec} from './pubspecReader'
import {updatePubspecToResolvableVersion} from './pubspecUpdater'

async function run(): Promise<void> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const currentPackages = getCurrentPackages()

    // read pubspec.yaml
    const pubspec = readPubspec()
    // get outdated package
    const outdatedPackages = await getOutdatedPackages()
    // update pubspec
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const updatedPubspec = updatePubspecToResolvableVersion(
      pubspec,
      outdatedPackages
    )
    // TODO: write to pubspec
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
