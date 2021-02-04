import * as core from '@actions/core'
import { outdatedPackages } from "./outdated";

async function run(): Promise<void> {
  try {
      await outdatedPackages();
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
