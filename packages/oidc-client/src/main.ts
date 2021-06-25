import * as core from '@actions/core'
import {IHeaders} from '@actions/http-client/interfaces'
import {
  createHttpClient,
  isSuccessStatusCode
} from './internal/utils'

import {
  getIDTokenUrl
} from './internal/config-variables'


export async function getIDToken(audience: string): Promise<string> {
  try {
    const id_tokne_url: string =  getIDTokenUrl()

    if (id_tokne_url == undefined) {
      throw new Error(`ID Token URL not found`)
    }

    core.debug(`ID token url is ${id_tokne_url}`)

    const httpclient = createHttpClient()
    if (httpclient == undefined) {
      throw new Error(`Failed to get Httpclient `)
    }
    core.debug(`Httpclient created ${httpclient} `) // debug is only output if you set the secret `ACTIONS_RUNNER_DEBUG` to true


    const response = await httpclient.post(id_tokne_url, audience)

    
    if (!isSuccessStatusCode(response.message.statusCode)){
      throw new Error(
        `Failed to get ID Token. Error message  :${response.message.statusMessage} `
      )
    }

    const body: string = await response.readBody()
    const val = JSON.parse(body)
    const id_token = val['id_token']

    if (id_token == undefined) {
      throw new Error(`Not able to fetch the ID token`)
    }

    return id_token
  } catch (error) {
    core.setFailed(error.message)
    return error.message
  }
}

module.exports.getIDToken = getIDToken
