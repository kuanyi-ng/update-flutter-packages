import * as core from '@actions/core'
import {getOutdatedPackages} from './outdated'

async function run(): Promise<void> {
  try {
    await getOutdatedPackages()
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
