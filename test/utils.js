'use strict'

const fs = require('fs')
const path = require('path')

module.exports = {
  loadTestData(file) {
    return new Promise((resolve, reject) => {
      try {
        const filePath = path.resolve(__dirname, './data', file)
        resolve(fs.readFileSync(filePath, 'utf8'))
      } catch (error) {
        reject(error)
      }
    })
  }
}
