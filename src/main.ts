import * as core from '@actions/core'
import * as glob from '@actions/glob'
import * as jsyaml from 'js-yaml'
import {readFileSync} from 'fs'
import FormData from 'form-data'
import axios, {isAxiosError} from 'axios'

async function run(): Promise<void> {
  try {
    const apiKey: string = core.getInput('api_key', {required: true})
    const files: string = core.getInput('files', {required: true})
    const apiUrl: string = core.getInput('api_url')

    const parsedFiles = jsyaml.load(files) as string[]
    const allFiles: string[] = []
    for (const fileName of parsedFiles) {
      const globber = await glob.create(fileName)
      for await (const file of globber.globGenerator()) {
        allFiles.push(file)
      }
    }

    core.notice(`Sending these files to Hatchways: ${allFiles}`)

    const formData = new FormData()
    let i = 0
    for (const file of allFiles) {
      const fileContent = readFileSync(file, 'utf-8')
      formData.append(`file${i}`, fileContent, {
        filename: file,
        contentType: 'application/xml'
      })
      i += 1
    }

    formData.append(
      'repository',
      `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}`
    )
    formData.append(
      'pipelineUrl',
      `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`
    )

    core.notice(`Updating Hatchways about ${process.env.GITHUB_REPOSITORY}`)

    let statusCode
    try {
      const response = await axios.post(apiUrl, formData, {
        headers: {
          ...formData.getHeaders(),
          'X-Api-Key': apiKey
        }
      })
      statusCode = response.status
    } catch (error) {
      core.debug(`error: ${error}`)
      if (isAxiosError(error)) {
        statusCode = error.response?.status
      } else {
        throw error
      }
    }
    core.notice(`Hatchways API responded with status code: ${statusCode}`)
    core.setOutput('status_code', statusCode)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
