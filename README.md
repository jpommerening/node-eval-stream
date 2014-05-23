# eval-stream

> Evaluate streams of JavaScript code in a given context.

## Examples

Here, we read the body of an adding function from a simple
through-stream:

```js
var PassThrough = require('stream').PassThrough ||
                  require('readable-stream/passthrough');
var assert = require('assert');

var evalStream = require('eval-stream');

var ts = new PassThrough();

ts.pipe(evalStream({
    a: 1,
    b: 2
  }, function (err, result) {
    assert(!err);
    assert.equal(result, 3);
  }));

ts.write('return a + b;');
ts.end();
```
