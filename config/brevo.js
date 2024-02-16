const SibApiV3Sdk = require('sib-api-v3-sdk')
const dotenv = require('dotenv')

dotenv.config()

const apiKey = SibApiV3Sdk.ApiClient.instance.authentications['api-key']
apiKey.apiKey = process.env.BREVO_APISECRET

module.exports = {
  apiKey,
}
