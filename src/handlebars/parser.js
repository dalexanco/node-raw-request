'use strict'

const debug = require('debug')('node-raw-request::handlerbars-parser')
const handlebars = require('handlebars')

// Registering helpers
const HELPERS = [
  'urlencode'
]
HELPERS.forEach((helper) => {
  debug('Loaded helper : \'%s\'', helper)
  require(`./helpers/${helper}`)(handlebars)
})

exports.parse = (documentString, context) => {
  debug('Compiling document (length: %d)...', documentString.length)
  const template = handlebars.compile(documentString)
  debug('Parsing document using context : %j', context)
  return template(context)
}
