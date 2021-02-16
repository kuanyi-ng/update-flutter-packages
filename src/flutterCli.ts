import {exec, ExecOptions} from '@actions/exec'
import {CliOutputs} from './interfaces'

export async function runFlutterPubOutdated(): Promise<CliOutputs> {
  let output = ''
  let error = ''

  const options: ExecOptions = {}
  options.silent = true
  options.listeners = {
    stdout: (data: Buffer) => {
      output += data.toString()
    },
    stderr: (data: Buffer) => {
      error += data.toString()
    }
  }

  await exec('flutter', ['pub', 'outdated'], options)

  return {
    output,
    error
  }
}
