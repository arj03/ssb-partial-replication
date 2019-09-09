# SSB partial replication

There is something wrong with createHistoryStream when doing only a
single feed over a network connection. Locally it takes around 600ms,
using net protocol the same call takes 6500ms and using ws the exact
same call takes 20000ms?

```
var pull = require('pull-stream')

var remote = 'ws:between-two-worlds.dk:8989~shs:lbocEWqF2Fg6WMYLgmfYvqJlMfL7hiqVAV6ANjHWNw8=.ed25519'
//remote = 'net:between-two-worlds.dk:8008~shs:lbocEWqF2Fg6WMYLgmfYvqJlMfL7hiqVAV6ANjHWNw8=.ed25519'

require('ssb-client')({ remote }, (err, sbot) => {
  if (err) throw err
  console.time("downloading messages")
  pull(
    sbot.createHistoryStream({id: '@ye+QM09iPcDJD6YvQYjoQc7sLF/IFhmNbEqgdzQo3lQ=.ed25519', seq: 27000, keys: false}),
    pull.drain((msg) => {
      console.log(msg)
    }, (err) => {
      if (err) throw err

      console.timeEnd("downloading messages")
      sbot.close()
    })
  )
})
```

The problem seems to be buried in the
[legacy](https://github.com/ssbc/ssb-replicate/blob/master/legacy.js)
protocol for ssb-replication somewhere.

This module simply exposes createHistoryStream as partialReplication
without any of the legacy overhead and we are back to 600ms again.
