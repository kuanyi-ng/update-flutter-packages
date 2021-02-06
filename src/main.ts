import * as core from '@actions/core'
import {getOutdatedPackages} from './outdated'
import {getCurrentPackages} from './pubspecReader'

async function run(): Promise<void> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const outdatedPackages = await getOutdatedPackages()
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const currentPackages = getCurrentPackages()
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
