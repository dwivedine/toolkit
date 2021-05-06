import * as core from '@actions/core'
import {HttpClient} from '@actions/http-client'
import {BearerCredentialHandler} from '@actions/http-client/auth'
import {IRequestOptions, IHeaders} from '@actions/http-client/interfaces'

function createAcceptHeader(type: string, apiVersion: string): string {
  return `${type};api-version=${apiVersion}`
}

function getRequestOptions(): IRequestOptions {
  const requestOptions: IRequestOptions = {
    headers: {
      Accept: createAcceptHeader('application/json', '6.0-preview.1')
    }
  }

  return requestOptions
}

function createHttpClient(): HttpClient {
  const token = process.env['GITHUB_TOKEN'] || ''
  const bearerCredentialHandler = new BearerCredentialHandler(token)

  return new HttpClient(
    'actions/cache',
    [bearerCredentialHandler],
    getRequestOptions()
  )
}

function getApiVersion(): string {
  return '6.0-preview'
}

function getUploadHeaders(contentType: string): IHeaders {
  const requestOptions: IHeaders = {}
  requestOptions['Accept'] = `application/json;api-version=${getApiVersion()}`
  if (contentType) {
    requestOptions['Content-Type'] = contentType
    requestOptions['Grant_Type'] = 'password'
  }

  return requestOptions
}

export async function getIDToken(
  clientid: string,
  clientsecret: string,
  url: string
): Promise<string> {
  try {
    const httpclient: HttpClient = createHttpClient()
    core.debug(`Httpclient created ${httpclient} `) // debug is only output if you set the secret `ACTIONS_RUNNER_DEBUG` to true

    const parameters = `grant_type=password&client_id=${clientid}&username=demorepo&password=HelloWorld123#&scope=openid&client_secret=${clientsecret}`

    //const url = ''
    core.debug(`Url is ${url}`)

    const headers = getUploadHeaders('application/x-www-form-urlencoded')
    core.debug(`header is ${headers}`)

    const response = await httpclient.post(url, parameters, headers)
    const body: string = await response.readBody()
    core.debug(`body is ${body}`)

    return body
  } catch (error) {
    core.setFailed(error.message)
    return error.message
  }
}

module.exports.getIDToken = getIDToken