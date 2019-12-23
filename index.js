var pull = require('pull-stream')
var pullCont = require('pull-cont')

exports.name = 'partial-replication'
exports.version = require('./package.json').version
exports.manifest = {
  partialReplication: 'source',
  partialReplicationReverse: 'source',
}
exports.permissions = {
  anonymous: {allow: ['partialReplication', 'partialReplicationReverse']}
}

exports.init = function (sbot, config) {
  return self = {
    partialReplication: function (opts) {
      return pull(
        sbot.createHistoryStream(opts)
      )
    },

    partialReplicationReverse: function (opts) {
      return pull(
        pullCont(function(cb) {
          sbot.getVectorClock((err, latestSeq) => {
            if (err) throw err

            var seqStart = latestSeq[opts.id] ? latestSeq[opts.id] - opts.limit : 0
            if (seqStart < 0)
              seqStart = 0

            opts.seq = seqStart

            cb(null, sbot.createHistoryStream(opts))
          })
        })
      )
    }
  }
}
