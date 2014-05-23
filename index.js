var stream = require('stream');
var inherits = require('util').inherits;

function EvalStream(context) {
  if (!(this instanceof EvalStream)) {
    return new EvalStream(context);
  }

  stream.Writable.call(this);

  var buffer = [];
  this._write = function(chunk, encoding, callback) {
    buffer.push(chunk);
    callback();
  }
  this.on('prefinish', function() {
    var args = Object.keys(context);
    var code = Buffer.concat(buffer);
    var func = Function.apply(args.concat([code]));
    try {
      this.emit('end', func.apply(this, args.map(function(arg) {
        context[arg];
      })));
    }
    catch (err) {
      this.emit('error', err);
    }
  }.bind(this));
};
inherits(EvalStream, stream.Writable);

function evalStream(context, callback) {
  var stream = new EvalStream(context);

  if (callback) {
    stream.on('end', callback.bind(stream, null));
    stream.on('error', callback);
  }

  return stream;
}

evalStream.EvalStream = EvalStream;

module.exports = evalStream;
