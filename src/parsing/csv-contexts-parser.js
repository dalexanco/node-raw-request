'use strict'

const parseCsv = require('csv-parse')
const fs = require('fs')

const CSV_OPTIONS = { delimiter: ';' }

exports.parse = (filePath) => {
  return new Promise((resolve, reject) => {
    try {
      fs.createReadStream(filePath)
        .pipe(parseCsv(CSV_OPTIONS, (err, data) => {
          if (err) {
            throw err
          }
          let titles = data[0]
          const contexts = []
          for (let i = 1; i < data.length; i++) {
            const parsedContext = data[i].reduce((agg, value, index) => {
              const key = (titles.length > index) ? titles[index] : 'unknown'
              agg[key] = value
              return agg
            }, {})
            contexts.push(parsedContext)
          }
          resolve(contexts)
        }))
    } catch(err) {
      reject(err)
    }
  })
}
