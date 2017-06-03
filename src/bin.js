/*eslint-disable no-console*/
'use strict'

const debug = require('debug')('node-raw-request::bin')
const program = require('commander')
const path = require('path')
const fs = require('fs')
const rp = require('request-promise')
const csvContextsParser = require('./parsing/csv-contexts-parser')
const { version } = require('../package.json')
const rawRequestParser = require('./index')

const FORMAT_HANDLERS = {
  csv(filePath) {
    return csvContextsParser.parse(filePath)
  }
}

program
  .version(version)
  .usage('--template <template-file> --contexts <context-file>')
  .option('-t, --template <file>', 'Define the path of raw request template')
  .option('-c, --contexts <file>', 'Define the path of the context file')
  .option('-f, --format [format]', 'Define the format of the context file [format]', 'csv')
  .parse(process.argv)

console.log('Starting parsing request..')
console.log('Template file : %s', program.template)
console.log('Context file : %s', program.contexts)
console.log('Context format : %s', program.format)

debug('Reading template file...')
const templatePath = path.resolve(program.template)
const requestRaw = fs.readFileSync(templatePath, 'utf8')

const contextsPath = path.resolve(program.contexts)
debug('Reading contexts file... (%s)', contextsPath)
if (!FORMAT_HANDLERS[program.format]) {
  throw new Error('Please provide a valid format option')
}

console.log('Requesting...\n\n')
const formatHandler = FORMAT_HANDLERS[program.format]
formatHandler(contextsPath)
  .then((contexts) => {
    return contexts.reduce((agg, context, index) => {
      return agg
        .then(() => rawRequestParser.parse(requestRaw, context))
        .then((options) => {
          debug('#%d Calling \'%s\'...', index, options.url)
          options.simple = false
          options.resolveWithFullResponse = true
          return rp(options)
        })
        .then((response) => {
          const { statusCode, body } = response
          console.log('#%d Received %d response (body length: %d)',
            index,
            statusCode,
            body.length)
        })
    }, Promise.resolve())
  })

// console.log('you ordered a pizza with:');
// if (program.peppers) console.log('  - peppers');
// if (program.pineapple) console.log('  - pineapple');
// if (program.bbqSauce) console.log('  - bbq');
// console.log('  - %s cheese', program.cheese);

