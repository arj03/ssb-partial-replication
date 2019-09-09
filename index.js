var pull = require('pull-stream')

exports.name = 'partial-replication'
exports.version = require('./package.json').version
exports.manifest = {
  partialReplication: 'source'
}
exports.permissions = {
  anonymous: {allow: ['partialReplication']}
}

exports.init = function (sbot, config) {
  return self = {
    partialReplication: function (opts) {
      return pull(
        sbot.createHistoryStream(opts)
      )
    }
  }
}
