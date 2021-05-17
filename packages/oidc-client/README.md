@actions/oidc-client

Usage

You can use this package to interact with the github oidc provider.

Get the ID token

Method Name: getIDToken

Inputs

Client id
The client id registered with oidc provider
Required
Client secret
The client secret
Required

These inputs are temporary. They will be modified once the complete package is available.


Example:

const id = require('@actions/oidc-client')

async function getID(){
   const id_token = await id.getIDToken('client-id', 'client-secret')
   const val = `ID token is ${id_token}`
   core.setOutput('id_token', id_token);
      
}

getID()

