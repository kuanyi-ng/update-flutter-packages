import * as core from '@actions/core'
import {getOutdatedPackages} from './outdated'

async function run(): Promise<void> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const outdatedPackages = await getOutdatedPackages()
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
