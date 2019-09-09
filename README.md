# SSB partial replication

There is something wrong with createHistoryStream over a network
connection. Locally it takes around 600ms, using net protocol the same
call takes 6500ms and using ws the exact same call takes 20000ms?

The problem seems to be buried in the
[legacy](https://github.com/ssbc/ssb-replicate/blob/master/legacy.js)
protocol for ssb-replication somewhere.

This module simply exposes createHistoryStream as partialReplication
without any of the legacy overhead and we are back to 600ms again.
