'use strict'

module.exports = (handlebars) => {
  handlebars.registerHelper('urlencode', (text) => {
    const urlencodedString = encodeURIComponent(text)
    return new handlebars.SafeString(urlencodedString)
  })
}
