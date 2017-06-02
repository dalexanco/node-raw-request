'use strict'

const { assert } = require('chai')
const { loadTestData } = require('../utils')

const rawParser = require('../../src/parsing/raw-parser')

describe('Raw parser', () => {
  it('Should parse a simple POST request', () => {
    return loadTestData('request_simple_post.raw')
      .then(rawParser)
      .then((result) => {
        assert.equal(result.method, 'POST')
        assert.equal(result.url, 'http://logx.optimizely.com/log/event')
      })
  })
})
