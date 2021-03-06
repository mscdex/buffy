Description
===========

Buffy is a utility module for [node.js](http://nodejs.org/) that lets you easily access and manipulate many Buffers as if they were one single Buffer.


Requirements
============

* [node.js](http://nodejs.org/) -- v0.4.0 or newer


Examples
========

    var Buffy = require('./buffy'), inspect = require('util').inspect;

    var b = new Buffy();
    b.append(new Buffer([1, 4, 3, 4, 1, 1, 4]));
    b.append(new Buffer([20, 10, 12]));
    b.append(new Buffer([6]));
    b.append(new Buffer([44, 9]));

    console.log(inspect(b));
    // output: <Buffy 01 04 03 04 01 01 04 14 0a 0c 06 2c 09>

    console.log(b.indexOf([1, 4]));
    // output: 0

    console.log(b.indexOf([1, 4], 1));
    // output: 5

    console.log(b.indexOf([1, 4, 20, 10, 12, 6]));
    // output: 5
    
    console.log(b.indexOf([44, 9]));
    // output: 11

    var myBuffer = new Buffer(5);
    b.copy(myBuffer, 0, 7, 12);
    console.log(inspect(myBuffer));
    // output: <Buffer 14 0a 0c 06 2c>


API
===

_Properties_
------------

* **length** - Returns the total length of the contents of the Buffy


_Methods_
---------

* **(constructor)**() - Creates and returns a new instance of a Buffy object.

* **get**(Integer:index) - _Boolean/Integer:byte_ - Retrieves a single byte at the specified index. If the index is invalid, Boolean false is returned.

* **set**(Integer:index, Integer:newByteValue) - _Boolean:success_ - Sets the byte at the specified index to the given value.

* **indexOf**(Array:bytes, [Integer:start=0]) - _Integer:position_ - Searches for the specified bytes in the Buffy at an optional starting position. Returns -1 if the bytes were not found.

* **copy**(Buffer:destBuffer, [Integer:destStart=0], [Integer:sourceStart=0], [Integer:sourceEnd=buffy.length]) - _(void)_ - Works similar to Buffer's copy().

* **append**(Buffer:newBuffer) - _(void)_ - Appends the given Buffer to the end of the Buffy.

* **GCBefore**(Integer:index) - _Integer:bytesRemoved_ - Removes any Buffers stored before the given Buffy index.

* **toString**([String:encoding], [Integer:startIndex], [Integer:endIndex]) - _String:result_ - Decodes and returns a string with the specified encoding beginning at startIndex and ending at endIndex.
