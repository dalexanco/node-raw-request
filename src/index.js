'use strict'

const handlebarsParser = require('./handlebars/parser')
const httpRawParser = require('./parsing/http-raw-parser')

module.exports = {
  parse,
  parseContexts
}

function parse(request, context) {
  return new Promise((resolve, reject) => {
    try {
      const parsedRequest = handlebarsParser.parse(request, context)
      const requestOptions = httpRawParser.parse(parsedRequest)
      return resolve(requestOptions)
    } catch(error) {
      reject(error)
    }
  })
}

function parseContexts(request, contextArray) {
  return Promise.all(contextArray.map((context) => {
    return parse(request, context)
  }))
}
