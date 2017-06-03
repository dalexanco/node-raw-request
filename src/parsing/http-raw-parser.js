'use strict'

const debug = require('debug')('node-raw-request::raw-parser')

module.exports = {
  parse,
  parseHead
}

const FORBIDDEN_HEADERS = [
  'Content-Length',
  'Connection',
  'DNT'
]

function parse(requestString, options={}) {
  const posDoubleLineBreak = requestString.indexOf('\n\n')
  const hasBody = (posDoubleLineBreak >= 0)
  const posHeaderEnd = (hasBody) ? posDoubleLineBreak : requestString.length
  const headString = requestString.substr(0, posHeaderEnd)

  const result = parseHead(headString, options)

  if (hasBody) {
    result['body'] = requestString
    result['body'] = result['body'].substr(posHeaderEnd + 2)
    result['body'] = result['body'].replace(/^\s+|\s+$/g, '')
    debug('Found body : length %d', result['body'].length)
  }
  return result
}

function parseHead(headString, options={}) {
  const lines = headString.split('\n')
  // Parse first line
  const [method, path] = lines[0].split(' ')
  debug('Found method : %s', method)
  debug('Found path : %s', path)
  // Parse headers
  let host = ''
  const headers = lines.slice(1).reduce((headers, line) => {
    const [key, value] = line.split(': ')
    if (key.toLowerCase() === 'host') {
      debug('Found host : %s', value)
      host = value
    } else if (!FORBIDDEN_HEADERS.includes(key)) {
      headers[key] = value
    } else {
      debug('Ignored header : \'%s\'', key)
    }
    return headers
  }, {})
  // Build url
  const protocol = (options['https']) ? 'https://' : 'http://'
  const url = protocol + host + path
  return {
    url,
    headers,
    method
  }
}
