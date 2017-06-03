'use strict'

const { assert } = require('chai')
const { loadTestData } = require('../utils')

const rawParser = require('../../src/parsing/http-raw-parser')

const FORBIDDEN_HEADERS = [
  'Content-Length',
  'Connection',
  'DNT'
]

describe('Raw parser', () => {

  it('Should parse a simple POST request (without body)', () => {
    return loadTestData('request_simple_head_nobody.raw')
      .then(rawParser.parse)
      .then((result) => {
        assert.equal(result.method, 'HEAD')
        assert.equal(result.url, 'http://www.example.com/log/event')

        assert.property(result, 'headers')
        assert.doesNotHaveAnyKeys(result.headers, FORBIDDEN_HEADERS)
        assert.equal(result.headers['Content-Type'], 'application/json')
        assert.equal(result.headers['Origin'], 'https://www.example.com')
      })
  })

  it('Should parse a simple POST request (with body)', () => {
    return loadTestData('request_simple_post.raw')
      .then(rawParser.parse)
      .then((result) => {
        assert.equal(result.method, 'POST')
        assert.equal(result.url, 'http://www.example.com/log/event')

        assert.property(result, 'headers')
        assert.doesNotHaveAnyKeys(result.headers, FORBIDDEN_HEADERS)
        assert.equal(result.headers['Content-Type'], 'application/json')
        assert.equal(result.headers['Origin'], 'https://www.example.com')

        assert.property(result, 'body')
        assert.lengthOf(result.body, 1099)
      })
  })
})
