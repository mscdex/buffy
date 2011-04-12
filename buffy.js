var Buffy = module.exports = function() {
  this._store = new Array();
  this._length = 0;
};
Buffy.prototype.append = function(buffer) {
  this._length += buffer.length;
  this._store.push(buffer);
};
Buffy.prototype.indexOf = function(bytes, start) {
  if (start && (start < 0 || start >= this._length))
    throw new Error('OOB');
  if (typeof bytes === 'number')
    bytes = [bytes];
  start = start || 0;
  var ret = -1, matching = false, foundStart = false, bn = 0, bc = 0, matchedAt,
      numbufs = this._store.length, buflen, bytesPos = 0,
      lastBytesPos = bytes.length-1, i;
  while (bn < numbufs) {
    i = 0;
    buflen = this._store[bn].length;
    if (!foundStart) {
      if (start >= buflen)
        start -= buflen;
      else {
        i = start;
        foundStart = true;
      }
    }
    if (foundStart) {
      for (; i<buflen; ++i) {
        if (this._store[bn][i] === bytes[bytesPos]) {
          if (bytesPos === 0) {
            matchedAt = bc + i;
          }
          if (bytesPos === lastBytesPos) {
            ret = matchedAt;
            break;
          }
          matching = true;
          ++bytesPos;
        } else if (matching) {
          matching = false;
          bytesPos = 0;
          --i; // retry current byte with reset bytesPos
        }
      }
      if (ret > -1)
        break;
    }
    bc += buflen;
    ++bn;
  }
  return ret;
};

Buffy.prototype.copy = function(destBuffer, destStart, srcStart, srcEnd) {
  if (typeof srcEnd === 'undefined')
    srcEnd = this._length;
  destStart = destStart || 0;
  srcStart = srcStart || 0;
  if (srcStart < 0 || srcStart > this._length || srcEnd > this._length
      || srcStart > srcEnd || destStart + (srcEnd-srcStart) > destBuffer.length)
    throw new Error('OOB');
  if (srcStart !== srcEnd) {
    var foundStart = false, bn = 0, totalBytes = (srcEnd-srcStart+1),
        doExit = false, numbufs = this._store.length, buflen, bufpos = destStart,
        i;
    while (bn < numbufs) {
      i = 0;
      buflen = this._store[bn].length;
      if (!foundStart) {
        if (srcStart >= buflen)
          srcStart -= buflen;
        else {
          i = srcStart;
          foundStart = true;
        }
      }
      if (foundStart) {
        if ((totalBytes - bufpos) <= (buflen - i)) {
          this._store[bn].copy(destBuffer, bufpos, i, totalBytes - bufpos);
          bufpos += (totalBytes - bufpos);
          break;
        } else {
          this._store[bn].copy(destBuffer, bufpos, i, buflen);
          bufpos += (buflen - i);
        }
      }
      ++bn;
    }
  }
};
Buffy.prototype.splice = function(index, howmany, el) {
  if (index >= this._length || (index + howmany) >= this._length)
    throw new Error('OOB');
  throw new Error('Not implemented');
};
Buffy.prototype.__defineGetter__('length', function() {
  return this._length;
});
Buffy.prototype.toString = function() {
  var ret = '';
  for (var i=0,len=this._store.length; i<len; ++i)
    ret += this._store[i].toString();
  return ret;
};
Buffy.prototype.inspect = function() {
  var len = this._store.length, ret = '<Buffy' + (len === 0 ? ' ' : '');
  for (var i=0,tmp,len=this._store.length; i<len; ++i) {
    tmp = this._store[i].inspect();
    ret += ' ' + tmp.substring(7, tmp.length-1).trim();
  }
  ret += '>';
  return ret;
};