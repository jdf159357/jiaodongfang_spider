navigator = {}

var b64map = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
var b64pad = "=";

function hex2b64(h) {
var i;
var c;
var ret = "";
for (i = 0; i + 3 <= h.length; i += 3) {
    c = parseInt(h.substring(i, i + 3), 16);
    ret += b64map.charAt(c >> 6) + b64map.charAt(c & 63);
}
if (i + 1 == h.length) {
    c = parseInt(h.substring(i, i + 1), 16);
    ret += b64map.charAt(c << 2);
} else if (i + 2 == h.length) {
    c = parseInt(h.substring(i, i + 2), 16);
    ret += b64map.charAt(c >> 2) + b64map.charAt((c & 3) << 4);
}
while ((ret.length & 3) > 0) ret += b64pad;
return ret;
}

// convert a base64 string to hex
function b64tohex(s) {
var ret = ""
var i;
var k = 0; // b64 state, 0-3
var slop;
for (i = 0; i < s.length; ++i) {
    if (s.charAt(i) == b64pad) break;
    v = b64map.indexOf(s.charAt(i));
    if (v < 0) continue;
    if (k == 0) {
        ret += int2char(v >> 2);
        slop = v & 3;
        k = 1;
    } else if (k == 1) {
        ret += int2char((slop << 2) | (v >> 4));
        slop = v & 0xf;
        k = 2;
    } else if (k == 2) {
        ret += int2char(slop);
        ret += int2char(v >> 2);
        slop = v & 3;
        k = 3;
    } else {
        ret += int2char((slop << 2) | (v >> 4));
        ret += int2char(v & 0xf);
        k = 0;
    }
}
if (k == 1) ret += int2char(slop << 2);
return ret;
}

// convert a base64 string to a byte/number array
function b64toBA(s) {
//piggyback on b64tohex for now, optimize later
var h = b64tohex(s);
var i;
var a = new Array();
for (i = 0; 2 * i < h.length; ++i) {
    a[i] = parseInt(h.substring(2 * i, 2 * i + 2), 16);
}
return a;
}

// prng4.js - uses Arcfour as a PRNG
function Arcfour() {
this.i = 0;
this.j = 0;
this.S = new Array();
}

// Initialize arcfour context from key, an array of ints, each from [0..255]
function ARC4init(key) {
var i, j, t;
for (i = 0; i < 256; ++i) this.S[i] = i;
j = 0;
for (i = 0; i < 256; ++i) {
    j = (j + this.S[i] + key[i % key.length]) & 255;
    t = this.S[i];
    this.S[i] = this.S[j];
    this.S[j] = t;
}
this.i = 0;
this.j = 0;
}

function ARC4next() {
var t;
this.i = (this.i + 1) & 255;
this.j = (this.j + this.S[this.i]) & 255;
t = this.S[this.i];
this.S[this.i] = this.S[this.j];
this.S[this.j] = t;
return this.S[(t + this.S[this.i]) & 255];
}

Arcfour.prototype.init = ARC4init;
Arcfour.prototype.next = ARC4next;

// Plug in your RNG constructor here
function prng_newstate() {
return new Arcfour();
}

// Pool size must be a multiple of 4 and greater than 32.
// An array of bytes the size of the pool will be passed to init()
var rng_psize = 256;

// Random number generator - requires a PRNG backend, e.g. prng4.js
// For best results, put code like
// <body onClick='rng_seed_time();' onKeyPress='rng_seed_time();'>
// in your main HTML document.
var rng_state;
var rng_pool;
var rng_pptr;

// Mix in a 32-bit integer into the pool
function rng_seed_int(x) {
rng_pool[rng_pptr++] ^= x & 255;
rng_pool[rng_pptr++] ^= (x >> 8) & 255;
rng_pool[rng_pptr++] ^= (x >> 16) & 255;
rng_pool[rng_pptr++] ^= (x >> 24) & 255;
if (rng_pptr >= rng_psize) rng_pptr -= rng_psize;
}

// Mix in the current time (w/milliseconds) into the pool
function rng_seed_time() {
rng_seed_int(new Date().getTime());
}

// Initialize the pool with junk if needed.
if (rng_pool == null) {
rng_pool = new Array();
rng_pptr = 0;
var t;
if (navigator.appName == "Netscape" && navigator.appVersion < "5" && window.crypto) {
    // Extract entropy (256 bits) from NS4 RNG if available
    var z = window.crypto.random(32);
    for (t = 0; t < z.length; ++t) rng_pool[rng_pptr++] = z.charCodeAt(t) & 255;
}
while (rng_pptr < rng_psize) { // extract some randomness from Math.random()
    t = Math.floor(65536 * Math.random());
    rng_pool[rng_pptr++] = t >>> 8;
    rng_pool[rng_pptr++] = t & 255;
}
rng_pptr = 0;
rng_seed_time();
//rng_seed_int(window.screenX);
//rng_seed_int(window.screenY);
}

function rng_get_byte() {
if (rng_state == null) {
    rng_seed_time();
    rng_state = prng_newstate();
    rng_state.init(rng_pool);
    for (rng_pptr = 0; rng_pptr < rng_pool.length; ++rng_pptr) rng_pool[rng_pptr] = 0;
    rng_pptr = 0;
    //rng_pool = null;
}
// TODO: allow reseeding after first request
return rng_state.next();
}

function rng_get_bytes(ba) {
var i;
for (i = 0; i < ba.length; ++i) ba[i] = rng_get_byte();
}

function SecureRandom() {}

SecureRandom.prototype.nextBytes = rng_get_bytes;

// Copyright (c) 2005  Tom Wu
// All Rights Reserved.
// See "LICENSE" for details.
// Basic JavaScript BN library - subset useful for RSA encryption.
// Bits per digit
var dbits;

// JavaScript engine analysis
var canary = 0xdeadbeefcafe;
var j_lm = ((canary & 0xffffff) == 0xefcafe);

// (public) Constructor
function BigInteger(a, b, c) {
if (a != null) if ("number" == typeof a) this.fromNumber(a, b, c);
else if (b == null && "string" != typeof a) this.fromString(a, 256);
else this.fromString(a, b);
}

// return new, unset BigInteger
function nbi() {
return new BigInteger(null);
}

// am: Compute w_j += (x*this_i), propagate carries,
// c is initial carry, returns final carry.
// c < 3*dvalue, x < 2*dvalue, this_i < dvalue
// We need to select the fastest one that works in this environment.
// am1: use a single mult and divide to get the high bits,
// max digit bits should be 26 because
// max internal value = 2*dvalue^2-2*dvalue (< 2^53)
function am1(i, x, w, j, c, n) {
while (--n >= 0) {
    var v = x * this[i++] + w[j] + c;
    c = Math.floor(v / 0x4000000);
    w[j++] = v & 0x3ffffff;
}
return c;
}
// am2 avoids a big mult-and-extract completely.
// Max digit bits should be <= 30 because we do bitwise ops
// on values up to 2*hdvalue^2-hdvalue-1 (< 2^31)
function am2(i, x, w, j, c, n) {
var xl = x & 0x7fff,
xh = x >> 15;
while (--n >= 0) {
    var l = this[i] & 0x7fff;
    var h = this[i++] >> 15;
    var m = xh * l + h * xl;
    l = xl * l + ((m & 0x7fff) << 15) + w[j] + (c & 0x3fffffff);
    c = (l >>> 30) + (m >>> 15) + xh * h + (c >>> 30);
    w[j++] = l & 0x3fffffff;
}
return c;
}
// Alternately, set max digit bits to 28 since some
// browsers slow down when dealing with 32-bit numbers.
function am3(i, x, w, j, c, n) {
var xl = x & 0x3fff,
xh = x >> 14;
while (--n >= 0) {
    var l = this[i] & 0x3fff;
    var h = this[i++] >> 14;
    var m = xh * l + h * xl;
    l = xl * l + ((m & 0x3fff) << 14) + w[j] + c;
    c = (l >> 28) + (m >> 14) + xh * h;
    w[j++] = l & 0xfffffff;
}
return c;
}
if (j_lm && (navigator.appName == "Microsoft Internet Explorer")) {
BigInteger.prototype.am = am2;
dbits = 30;
} else if (j_lm && (navigator.appName != "Netscape")) {
BigInteger.prototype.am = am1;
dbits = 26;
} else { // Mozilla/Netscape seems to prefer am3
BigInteger.prototype.am = am3;
dbits = 28;
}

BigInteger.prototype.DB = dbits;
BigInteger.prototype.DM = ((1 << dbits) - 1);
BigInteger.prototype.DV = (1 << dbits);

var BI_FP = 52;
BigInteger.prototype.FV = Math.pow(2, BI_FP);
BigInteger.prototype.F1 = BI_FP - dbits;
BigInteger.prototype.F2 = 2 * dbits - BI_FP;

// Digit conversions
var BI_RM = "0123456789abcdefghijklmnopqrstuvwxyz";
var BI_RC = new Array();
var rr, vv;
rr = "0".charCodeAt(0);
for (vv = 0; vv <= 9; ++vv) BI_RC[rr++] = vv;
rr = "a".charCodeAt(0);
for (vv = 10; vv < 36; ++vv) BI_RC[rr++] = vv;
rr = "A".charCodeAt(0);
for (vv = 10; vv < 36; ++vv) BI_RC[rr++] = vv;

function int2char(n) {
return BI_RM.charAt(n);
}
function intAt(s, i) {
var c = BI_RC[s.charCodeAt(i)];
return (c == null) ? -1 : c;
}

// (protected) copy this to r
function bnpCopyTo(r) {
for (var i = this.t - 1; i >= 0; --i) r[i] = this[i];
r.t = this.t;
r.s = this.s;
}

// (protected) set from integer value x, -DV <= x < DV
function bnpFromInt(x) {
this.t = 1;
this.s = (x < 0) ? -1 : 0;
if (x > 0) this[0] = x;
else if (x < -1) this[0] = x + DV;
else this.t = 0;
}

// return bigint initialized to value
function nbv(i) {
var r = nbi();
r.fromInt(i);
return r;
}

// (protected) set from string and radix
function bnpFromString(s, b) {
var k;
if (b == 16) k = 4;
else if (b == 8) k = 3;
else if (b == 256) k = 8; // byte array
else if (b == 2) k = 1;
else if (b == 32) k = 5;
else if (b == 4) k = 2;
else {
    this.fromRadix(s, b);
    return;
}
this.t = 0;
this.s = 0;
var i = s.length,
mi = false,
sh = 0;
while (--i >= 0) {
    var x = (k == 8) ? s[i] & 0xff: intAt(s, i);
    if (x < 0) {
        if (s.charAt(i) == "-") mi = true;
        continue;
    }
    mi = false;
    if (sh == 0) this[this.t++] = x;
    else if (sh + k > this.DB) {
        this[this.t - 1] |= (x & ((1 << (this.DB - sh)) - 1)) << sh;
        this[this.t++] = (x >> (this.DB - sh));
    } else this[this.t - 1] |= x << sh;
    sh += k;
    if (sh >= this.DB) sh -= this.DB;
}
if (k == 8 && (s[0] & 0x80) != 0) {
    this.s = -1;
    if (sh > 0) this[this.t - 1] |= ((1 << (this.DB - sh)) - 1) << sh;
}
this.clamp();
if (mi) BigInteger.ZERO.subTo(this, this);
}

// (protected) clamp off excess high words
function bnpClamp() {
var c = this.s & this.DM;
while (this.t > 0 && this[this.t - 1] == c)--this.t;
}

// (public) return string representation in given radix
function bnToString(b) {
if (this.s < 0) return "-" + this.negate().toString(b);
var k;
if (b == 16) k = 4;
else if (b == 8) k = 3;
else if (b == 2) k = 1;
else if (b == 32) k = 5;
else if (b == 4) k = 2;
else return this.toRadix(b);
var km = (1 << k) - 1,
d,
m = false,
r = "",
i = this.t;
var p = this.DB - (i * this.DB) % k;
if (i-->0) {
    if (p < this.DB && (d = this[i] >> p) > 0) {
        m = true;
        r = int2char(d);
    }
    while (i >= 0) {
        if (p < k) {
            d = (this[i] & ((1 << p) - 1)) << (k - p);
            d |= this[--i] >> (p += this.DB - k);
        } else {
            d = (this[i] >> (p -= k)) & km;
            if (p <= 0) {
                p += this.DB; --i;
            }
        }
        if (d > 0) m = true;
        if (m) r += int2char(d);
    }
}
return m ? r: "0";
}

// (public) -this
function bnNegate() {
var r = nbi();
BigInteger.ZERO.subTo(this, r);
return r;
}

// (public) |this|
function bnAbs() {
return (this.s < 0) ? this.negate() : this;
}

// (public) return + if this > a, - if this < a, 0 if equal
function bnCompareTo(a) {
var r = this.s - a.s;
if (r != 0) return r;
var i = this.t;
r = i - a.t;
if (r != 0) return r;
while (--i >= 0) if ((r = this[i] - a[i]) != 0) return r;
return 0;
}

// returns bit length of the integer x
function nbits(x) {
var r = 1,
t;
if ((t = x >>> 16) != 0) {
    x = t;
    r += 16;
}
if ((t = x >> 8) != 0) {
    x = t;
    r += 8;
}
if ((t = x >> 4) != 0) {
    x = t;
    r += 4;
}
if ((t = x >> 2) != 0) {
    x = t;
    r += 2;
}
if ((t = x >> 1) != 0) {
    x = t;
    r += 1;
}
return r;
}

// (public) return the number of bits in "this"
function bnBitLength() {
if (this.t <= 0) return 0;
return this.DB * (this.t - 1) + nbits(this[this.t - 1] ^ (this.s & this.DM));
}

// (protected) r = this << n*DB
function bnpDLShiftTo(n, r) {
var i;
for (i = this.t - 1; i >= 0; --i) r[i + n] = this[i];
for (i = n - 1; i >= 0; --i) r[i] = 0;
r.t = this.t + n;
r.s = this.s;
}

// (protected) r = this >> n*DB
function bnpDRShiftTo(n, r) {
for (var i = n; i < this.t; ++i) r[i - n] = this[i];
r.t = Math.max(this.t - n, 0);
r.s = this.s;
}

// (protected) r = this << n
function bnpLShiftTo(n, r) {
var bs = n % this.DB;
var cbs = this.DB - bs;
var bm = (1 << cbs) - 1;
var ds = Math.floor(n / this.DB),
c = (this.s << bs) & this.DM,
i;
for (i = this.t - 1; i >= 0; --i) {
    r[i + ds + 1] = (this[i] >> cbs) | c;
    c = (this[i] & bm) << bs;
}
for (i = ds - 1; i >= 0; --i) r[i] = 0;
r[ds] = c;
r.t = this.t + ds + 1;
r.s = this.s;
r.clamp();
}

// (protected) r = this >> n
function bnpRShiftTo(n, r) {
r.s = this.s;
var ds = Math.floor(n / this.DB);
if (ds >= this.t) {
    r.t = 0;
    return;
}
var bs = n % this.DB;
var cbs = this.DB - bs;
var bm = (1 << bs) - 1;
r[0] = this[ds] >> bs;
for (var i = ds + 1; i < this.t; ++i) {
    r[i - ds - 1] |= (this[i] & bm) << cbs;
    r[i - ds] = this[i] >> bs;
}
if (bs > 0) r[this.t - ds - 1] |= (this.s & bm) << cbs;
r.t = this.t - ds;
r.clamp();
}

// (protected) r = this - a
function bnpSubTo(a, r) {
var i = 0,
c = 0,
m = Math.min(a.t, this.t);
while (i < m) {
    c += this[i] - a[i];
    r[i++] = c & this.DM;
    c >>= this.DB;
}
if (a.t < this.t) {
    c -= a.s;
    while (i < this.t) {
        c += this[i];
        r[i++] = c & this.DM;
        c >>= this.DB;
    }
    c += this.s;
} else {
    c += this.s;
    while (i < a.t) {
        c -= a[i];
        r[i++] = c & this.DM;
        c >>= this.DB;
    }
    c -= a.s;
}
r.s = (c < 0) ? -1 : 0;
if (c < -1) r[i++] = this.DV + c;
else if (c > 0) r[i++] = c;
r.t = i;
r.clamp();
}

// (protected) r = this * a, r != this,a (HAC 14.12)
// "this" should be the larger one if appropriate.
function bnpMultiplyTo(a, r) {
var x = this.abs(),
y = a.abs();
var i = x.t;
r.t = i + y.t;
while (--i >= 0) r[i] = 0;
for (i = 0; i < y.t; ++i) r[i + x.t] = x.am(0, y[i], r, i, 0, x.t);
r.s = 0;
r.clamp();
if (this.s != a.s) BigInteger.ZERO.subTo(r, r);
}

// (protected) r = this^2, r != this (HAC 14.16)
function bnpSquareTo(r) {
var x = this.abs();
var i = r.t = 2 * x.t;
while (--i >= 0) r[i] = 0;
for (i = 0; i < x.t - 1; ++i) {
    var c = x.am(i, x[i], r, 2 * i, 0, 1);
    if ((r[i + x.t] += x.am(i + 1, 2 * x[i], r, 2 * i + 1, c, x.t - i - 1)) >= x.DV) {
        r[i + x.t] -= x.DV;
        r[i + x.t + 1] = 1;
    }
}
if (r.t > 0) r[r.t - 1] += x.am(i, x[i], r, 2 * i, 0, 1);
r.s = 0;
r.clamp();
}

// (protected) divide this by m, quotient and remainder to q, r (HAC 14.20)
// r != q, this != m.  q or r may be null.
function bnpDivRemTo(m, q, r) {
var pm = m.abs();
if (pm.t <= 0) return;
var pt = this.abs();
if (pt.t < pm.t) {
    if (q != null) q.fromInt(0);
    if (r != null) this.copyTo(r);
    return;
}
if (r == null) r = nbi();
var y = nbi(),
ts = this.s,
ms = m.s;
var nsh = this.DB - nbits(pm[pm.t - 1]); // normalize modulus
if (nsh > 0) {
    pm.lShiftTo(nsh, y);
    pt.lShiftTo(nsh, r);
} else {
    pm.copyTo(y);
    pt.copyTo(r);
}
var ys = y.t;
var y0 = y[ys - 1];
if (y0 == 0) return;
var yt = y0 * (1 << this.F1) + ((ys > 1) ? y[ys - 2] >> this.F2: 0);
var d1 = this.FV / yt,
d2 = (1 << this.F1) / yt,
e = 1 << this.F2;
var i = r.t,
j = i - ys,
t = (q == null) ? nbi() : q;
y.dlShiftTo(j, t);
if (r.compareTo(t) >= 0) {
    r[r.t++] = 1;
    r.subTo(t, r);
}
BigInteger.ONE.dlShiftTo(ys, t);
t.subTo(y, y); // "negative" y so we can replace sub with am later
while (y.t < ys) y[y.t++] = 0;
while (--j >= 0) {
    // Estimate quotient digit
    var qd = (r[--i] == y0) ? this.DM: Math.floor(r[i] * d1 + (r[i - 1] + e) * d2);
    if ((r[i] += y.am(0, qd, r, j, 0, ys)) < qd) { // Try it out
        y.dlShiftTo(j, t);
        r.subTo(t, r);
        while (r[i] < --qd) r.subTo(t, r);
    }
}
if (q != null) {
    r.drShiftTo(ys, q);
    if (ts != ms) BigInteger.ZERO.subTo(q, q);
}
r.t = ys;
r.clamp();
if (nsh > 0) r.rShiftTo(nsh, r); // Denormalize remainder
if (ts < 0) BigInteger.ZERO.subTo(r, r);
}

// (public) this mod a
function bnMod(a) {
var r = nbi();
this.abs().divRemTo(a, null, r);
if (this.s < 0 && r.compareTo(BigInteger.ZERO) > 0) a.subTo(r, r);
return r;
}

// Modular reduction using "classic" algorithm
function Classic(m) {
this.m = m;
}
function cConvert(x) {
if (x.s < 0 || x.compareTo(this.m) >= 0) return x.mod(this.m);
else return x;
}
function cRevert(x) {
return x;
}
function cReduce(x) {
x.divRemTo(this.m, null, x);
}
function cMulTo(x, y, r) {
x.multiplyTo(y, r);
this.reduce(r);
}
function cSqrTo(x, r) {
x.squareTo(r);
this.reduce(r);
}

Classic.prototype.convert = cConvert;
Classic.prototype.revert = cRevert;
Classic.prototype.reduce = cReduce;
Classic.prototype.mulTo = cMulTo;
Classic.prototype.sqrTo = cSqrTo;

// (protected) return "-1/this % 2^DB"; useful for Mont. reduction
// justification:
//         xy == 1 (mod m)
//         xy =  1+km
//   xy(2-xy) = (1+km)(1-km)
// x[y(2-xy)] = 1-k^2m^2
// x[y(2-xy)] == 1 (mod m^2)
// if y is 1/x mod m, then y(2-xy) is 1/x mod m^2
// should reduce x and y(2-xy) by m^2 at each step to keep size bounded.
// JS multiply "overflows" differently from C/C++, so care is needed here.
function bnpInvDigit() {
if (this.t < 1) return 0;
var x = this[0];
if ((x & 1) == 0) return 0;
var y = x & 3; // y == 1/x mod 2^2
y = (y * (2 - (x & 0xf) * y)) & 0xf; // y == 1/x mod 2^4
y = (y * (2 - (x & 0xff) * y)) & 0xff; // y == 1/x mod 2^8
y = (y * (2 - (((x & 0xffff) * y) & 0xffff))) & 0xffff; // y == 1/x mod 2^16
// last step - calculate inverse mod DV directly;
// assumes 16 < DB <= 32 and assumes ability to handle 48-bit ints
y = (y * (2 - x * y % this.DV)) % this.DV; // y == 1/x mod 2^dbits
// we really want the negative inverse, and -DV < y < DV
return (y > 0) ? this.DV - y: -y;
}

// Montgomery reduction
function Montgomery(m) {
this.m = m;
this.mp = m.invDigit();
this.mpl = this.mp & 0x7fff;
this.mph = this.mp >> 15;
this.um = (1 << (m.DB - 15)) - 1;
this.mt2 = 2 * m.t;
}

// xR mod m
function montConvert(x) {
var r = nbi();
x.abs().dlShiftTo(this.m.t, r);
r.divRemTo(this.m, null, r);
if (x.s < 0 && r.compareTo(BigInteger.ZERO) > 0) this.m.subTo(r, r);
return r;
}

// x/R mod m
function montRevert(x) {
var r = nbi();
x.copyTo(r);
this.reduce(r);
return r;
}

// x = x/R mod m (HAC 14.32)
function montReduce(x) {
while (x.t <= this.mt2) // pad x so am has enough room later
x[x.t++] = 0;
for (var i = 0; i < this.m.t; ++i) {
    // faster way of calculating u0 = x[i]*mp mod DV
    var j = x[i] & 0x7fff;
    var u0 = (j * this.mpl + (((j * this.mph + (x[i] >> 15) * this.mpl) & this.um) << 15)) & x.DM;
    // use am to combine the multiply-shift-add into one call
    j = i + this.m.t;
    x[j] += this.m.am(0, u0, x, i, 0, this.m.t);
    // propagate carry
    while (x[j] >= x.DV) {
        x[j] -= x.DV;
        x[++j]++;
    }
}
x.clamp();
x.drShiftTo(this.m.t, x);
if (x.compareTo(this.m) >= 0) x.subTo(this.m, x);
}

// r = "x^2/R mod m"; x != r
function montSqrTo(x, r) {
x.squareTo(r);
this.reduce(r);
}

// r = "xy/R mod m"; x,y != r
function montMulTo(x, y, r) {
x.multiplyTo(y, r);
this.reduce(r);
}

Montgomery.prototype.convert = montConvert;
Montgomery.prototype.revert = montRevert;
Montgomery.prototype.reduce = montReduce;
Montgomery.prototype.mulTo = montMulTo;
Montgomery.prototype.sqrTo = montSqrTo;

// (protected) true iff this is even
function bnpIsEven() {
return ((this.t > 0) ? (this[0] & 1) : this.s) == 0;
}

// (protected) this^e, e < 2^32, doing sqr and mul with "r" (HAC 14.79)
function bnpExp(e, z) {
if (e > 0xffffffff || e < 1) return BigInteger.ONE;
var r = nbi(),
r2 = nbi(),
g = z.convert(this),
i = nbits(e) - 1;
g.copyTo(r);
while (--i >= 0) {
    z.sqrTo(r, r2);
    if ((e & (1 << i)) > 0) z.mulTo(r2, g, r);
    else {
        var t = r;
        r = r2;
        r2 = t;
    }
}
return z.revert(r);
}

// (public) this^e % m, 0 <= e < 2^32
function bnModPowInt(e, m) {
var z;
if (e < 256 || m.isEven()) z = new Classic(m);
else z = new Montgomery(m);
return this.exp(e, z);
}

// protected
BigInteger.prototype.copyTo = bnpCopyTo;
BigInteger.prototype.fromInt = bnpFromInt;
BigInteger.prototype.fromString = bnpFromString;
BigInteger.prototype.clamp = bnpClamp;
BigInteger.prototype.dlShiftTo = bnpDLShiftTo;
BigInteger.prototype.drShiftTo = bnpDRShiftTo;
BigInteger.prototype.lShiftTo = bnpLShiftTo;
BigInteger.prototype.rShiftTo = bnpRShiftTo;
BigInteger.prototype.subTo = bnpSubTo;
BigInteger.prototype.multiplyTo = bnpMultiplyTo;
BigInteger.prototype.squareTo = bnpSquareTo;
BigInteger.prototype.divRemTo = bnpDivRemTo;
BigInteger.prototype.invDigit = bnpInvDigit;
BigInteger.prototype.isEven = bnpIsEven;
BigInteger.prototype.exp = bnpExp;

// public
BigInteger.prototype.toString = bnToString;
BigInteger.prototype.negate = bnNegate;
BigInteger.prototype.abs = bnAbs;
BigInteger.prototype.compareTo = bnCompareTo;
BigInteger.prototype.bitLength = bnBitLength;
BigInteger.prototype.mod = bnMod;
BigInteger.prototype.modPowInt = bnModPowInt;

// "constants"
BigInteger.ZERO = nbv(0);
BigInteger.ONE = nbv(1);

// Depends on jsbn.js and rng.js
// Version 1.1: support utf-8 encoding in pkcs1pad2
// convert a (hex) string to a bignum object
function parseBigInt(str, r) {
return new BigInteger(str, r);
}

function linebrk(s, n) {
var ret = "";
var i = 0;
while (i + n < s.length) {
    ret += s.substring(i, i + n) + "\n";
    i += n;
}
return ret + s.substring(i, s.length);
}

function byte2Hex(b) {
if (b < 0x10) return "0" + b.toString(16);
else return b.toString(16);
}

// PKCS#1 (type 2, random) pad input string s to n bytes, and return a bigint
function pkcs1pad2(s, n) {
if (n < s.length + 11) { // TODO: fix for utf-8
    alert("Message too long for RSA");
    return null;
}
var ba = new Array();
var i = s.length - 1;
while (i >= 0 && n > 0) {
    var c = s.charCodeAt(i--);
    if (c < 128) { // encode using utf-8
        ba[--n] = c;
    } else if ((c > 127) && (c < 2048)) {
        ba[--n] = (c & 63) | 128;
        ba[--n] = (c >> 6) | 192;
    } else {
        ba[--n] = (c & 63) | 128;
        ba[--n] = ((c >> 6) & 63) | 128;
        ba[--n] = (c >> 12) | 224;
    }
}
ba[--n] = 0;
var rng = new SecureRandom();
var x = new Array();
while (n > 2) { // random non-zero pad
    x[0] = 0;
    while (x[0] == 0) rng.nextBytes(x);
    ba[--n] = x[0];
}
ba[--n] = 2;
ba[--n] = 0;
return new BigInteger(ba);
}

// "empty" RSA key constructor
function RSAKey() {
this.n = null;
this.e = 0;
this.d = null;
this.p = null;
this.q = null;
this.dmp1 = null;
this.dmq1 = null;
this.coeff = null;
}

// Set the public key fields N and e from hex strings
function RSASetPublic(N, E) {
if (N != null && E != null && N.length > 0 && E.length > 0) {
    this.n = parseBigInt(N, 16);
    this.e = parseInt(E, 16);
} else alert("Invalid RSA public key");
}

// Perform raw public operation on "x": return x^e (mod n)
function RSADoPublic(x) {
return x.modPowInt(this.e, this.n);
}

// Return the PKCS#1 RSA encryption of "text" as an even-length hex string
function RSAEncrypt(text) {
var m = pkcs1pad2(text, (this.n.bitLength() + 7) >> 3);
if (m == null) return null;
var c = this.doPublic(m);
if (c == null) return null;
var h = c.toString(16);
if ((h.length & 1) == 0) return h;
else return "0" + h;
}

// Return the PKCS#1 RSA encryption of "text" as a Base64-encoded string
//function RSAEncryptB64(text) {
//  var h = this.encrypt(text);
//  if(h) return hex2b64(h); else return null;
//}
// protected
RSAKey.prototype.doPublic = RSADoPublic;

// public
RSAKey.prototype.setPublic = RSASetPublic;
RSAKey.prototype.encrypt = RSAEncrypt;
//RSAKey.prototype.encrypt_b64 = RSAEncryptB64;
var public_key = "B0AAFA4C9D388208E9F55B14DF04C8603D0CD81B7B65BBD669FA893096C985E33682FE7DEEE6500E1C4C6722C9855B6DD2E130F3672BEBA446B72D8DFFF2DD1F4E23D6BD728E267A9DC2C544C6680712884926D67AF74B74E5AD8298034D8C16FE8E5A37706EF5E447E423E69CA7FD3E47BBF7A9B137EF9B0310E2560E13D3C1";
var public_length = "10001";
function rsa_encrypt(str) {
var BLOCK_SIZE = public_key.length / 2 - 11;
var ret = '';
while (str.length > 0) {
    var i = BLOCK_SIZE;
    if (str.length < i) i = str.length;
    str_1 = str.substr(0, i);
    str = str.substr(i, str.length - i);
    ret += rsa_encrypt1(str_1) + ' ';
}
return (ret);
}
function rsa_encrypt1(str) {
var rsa = new RSAKey();
rsa.setPublic(public_key, public_length);
var res = rsa.encrypt(str);
res = hex2b64(res);
return (res);
}

//  json2.js
//  2017-06-12
//  Public Domain.
//  NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
//  USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
//  NOT CONTROL.
//  This file creates a global JSON object containing two methods: stringify
//  and parse. This file provides the ES5 JSON capability to ES3 systems.
//  If a project might run on IE8 or earlier, then this file should be included.
//  This file does nothing on ES5 systems.
//      JSON.stringify(value, replacer, space)
//          value       any JavaScript value, usually an object or array.
//          replacer    an optional parameter that determines how object
//                      values are stringified for objects. It can be a
//                      function or an array of strings.
//          space       an optional parameter that specifies the indentation
//                      of nested structures. If it is omitted, the text will
//                      be packed without extra whitespace. If it is a number,
//                      it will specify the number of spaces to indent at each
//                      level. If it is a string (such as "\t" or "&nbsp;"),
//                      it contains the characters used to indent at each level.
//          This method produces a JSON text from a JavaScript value.
//          When an object value is found, if the object contains a toJSON
//          method, its toJSON method will be called and the result will be
//          stringified. A toJSON method does not serialize: it returns the
//          value represented by the name/value pair that should be serialized,
//          or undefined if nothing should be serialized. The toJSON method
//          will be passed the key associated with the value, and this will be
//          bound to the value.
//          For example, this would serialize Dates as ISO strings.
//              Date.prototype.toJSON = function (key) {
//                  function f(n) {
//                      // Format integers to have at least two digits.
//                      return (n < 10)
//                          ? "0" + n
//                          : n;
//                  }
//                  return this.getUTCFullYear()   + "-" +
//                       f(this.getUTCMonth() + 1) + "-" +
//                       f(this.getUTCDate())      + "T" +
//                       f(this.getUTCHours())     + ":" +
//                       f(this.getUTCMinutes())   + ":" +
//                       f(this.getUTCSeconds())   + "Z";
//              };
//          You can provide an optional replacer method. It will be passed the
//          key and value of each member, with this bound to the containing
//          object. The value that is returned from your method will be
//          serialized. If your method returns undefined, then the member will
//          be excluded from the serialization.
//          If the replacer parameter is an array of strings, then it will be
//          used to select the members to be serialized. It filters the results
//          such that only members with keys listed in the replacer array are
//          stringified.
//          Values that do not have JSON representations, such as undefined or
//          functions, will not be serialized. Such values in objects will be
//          dropped; in arrays they will be replaced with null. You can use
//          a replacer function to replace those with JSON values.
//          JSON.stringify(undefined) returns undefined.
//          The optional space parameter produces a stringification of the
//          value that is filled with line breaks and indentation to make it
//          easier to read.
//          If the space parameter is a non-empty string, then that string will
//          be used for indentation. If the space parameter is a number, then
//          the indentation will be that many spaces.
//          Example:
//          text = JSON.stringify(["e", {pluribus: "unum"}]);
//          // text is '["e",{"pluribus":"unum"}]'
//          text = JSON.stringify(["e", {pluribus: "unum"}], null, "\t");
//          // text is '[\n\t"e",\n\t{\n\t\t"pluribus": "unum"\n\t}\n]'
//          text = JSON.stringify([new Date()], function (key, value) {
//              return this[key] instanceof Date
//                  ? "Date(" + this[key] + ")"
//                  : value;
//          });
//          // text is '["Date(---current time---)"]'
//      JSON.parse(text, reviver)
//          This method parses a JSON text to produce an object or array.
//          It can throw a SyntaxError exception.
//          The optional reviver parameter is a function that can filter and
//          transform the results. It receives each of the keys and values,
//          and its return value is used instead of the original value.
//          If it returns what it received, then the structure is not modified.
//          If it returns undefined then the member is deleted.
//          Example:
//          // Parse the text. Values that look like ISO date strings will
//          // be converted to Date objects.
//          myData = JSON.parse(text, function (key, value) {
//              var a;
//              if (typeof value === "string") {
//                  a =
//   /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
//                  if (a) {
//                      return new Date(Date.UTC(
//                         +a[1], +a[2] - 1, +a[3], +a[4], +a[5], +a[6]
//                      ));
//                  }
//                  return value;
//              }
//          });
//          myData = JSON.parse(
//              "[\"Date(09/09/2001)\"]",
//              function (key, value) {
//                  var d;
//                  if (
//                      typeof value === "string"
//                      && value.slice(0, 5) === "Date("
//                      && value.slice(-1) === ")"
//                  ) {
//                      d = new Date(value.slice(5, -1));
//                      if (d) {
//                          return d;
//                      }
//                  }
//                  return value;
//              }
//          );
//  This is a reference implementation. You are free to copy, modify, or
//  redistribute.
/*jslint
eval, for, this
*/

/*property
JSON, apply, call, charCodeAt, getUTCDate, getUTCFullYear, getUTCHours,
getUTCMinutes, getUTCMonth, getUTCSeconds, hasOwnProperty, join,
lastIndex, length, parse, prototype, push, replace, slice, stringify,
test, toJSON, toString, valueOf
*/

// Create a JSON object only if one does not already exist. We create the
// methods in a closure to avoid creating global variables.
if (typeof JSON !== "object") {
JSON = {};
}

(function() {
"use strict";

var rx_one = /^[\],:{}\s]*$/;
var rx_two = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g;
var rx_three = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g;
var rx_four = /(?:^|:|,)(?:\s*\[)+/g;
var rx_escapable = /[\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
var rx_dangerous = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;

function f(n) {
    // Format integers to have at least two digits.
    return (n < 10) ? "0" + n: n;
}

function this_value() {
    return this.valueOf();
}

if (typeof Date.prototype.toJSON !== "function") {

    Date.prototype.toJSON = function() {

        return isFinite(this.valueOf()) ? (this.getUTCFullYear() + "-" + f(this.getUTCMonth() + 1) + "-" + f(this.getUTCDate()) + "T" + f(this.getUTCHours()) + ":" + f(this.getUTCMinutes()) + ":" + f(this.getUTCSeconds()) + "Z") : null;
    };

    Boolean.prototype.toJSON = this_value;
    Number.prototype.toJSON = this_value;
    String.prototype.toJSON = this_value;
}

var gap;
var indent;
var meta;
var rep;

function quote(string) {

    // If the string contains no control characters, no quote characters, and no
    // backslash characters, then we can safely slap some quotes around it.
    // Otherwise we must also replace the offending characters with safe escape
    // sequences.
    rx_escapable.lastIndex = 0;
    return rx_escapable.test(string) ? "\"" + string.replace(rx_escapable,
    function(a) {
        var c = meta[a];
        return typeof c === "string" ? c: "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice( - 4);
    }) + "\"": "\"" + string + "\"";
}

function str(key, holder) {

    // Produce a string from holder[key].
    var i; // The loop counter.
    var k; // The member key.
    var v; // The member value.
    var length;
    var mind = gap;
    var partial;
    var value = holder[key];

    // If the value has a toJSON method, call it to obtain a replacement value.
    if (value && typeof value === "object" && typeof value.toJSON === "function") {
        value = value.toJSON(key);
    }

    // If we were called with a replacer function, then call the replacer to
    // obtain a replacement value.
    if (typeof rep === "function") {
        value = rep.call(holder, key, value);
    }

    // What happens next depends on the value's type.
    switch (typeof value) {
    case "string":
        return quote(value);

    case "number":

        // JSON numbers must be finite. Encode non-finite numbers as null.
        return (isFinite(value)) ? String(value) : "null";

    case "boolean":
    case "null":

        // If the value is a boolean or null, convert it to a string. Note:
        // typeof null does not produce "null". The case is included here in
        // the remote chance that this gets fixed someday.
        return String(value);

        // If the type is "object", we might be dealing with an object or an array or
        // null.
    case "object":

        // Due to a specification blunder in ECMAScript, typeof null is "object",
        // so watch out for that case.
        if (!value) {
            return "null";
        }

        // Make an array to hold the partial results of stringifying this object value.
        gap += indent;
        partial = [];

        // Is the value an array?
        if (Object.prototype.toString.apply(value) === "[object Array]") {

            // The value is an array. Stringify every element. Use null as a placeholder
            // for non-JSON values.
            length = value.length;
            for (i = 0; i < length; i += 1) {
                partial[i] = str(i, value) || "null";
            }

            // Join all of the elements together, separated with commas, and wrap them in
            // brackets.
            v = partial.length === 0 ? "[]": gap ? ("[\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "]") : "[" + partial.join(",") + "]";
            gap = mind;
            return v;
        }

        // If the replacer is an array, use it to select the members to be stringified.
        if (rep && typeof rep === "object") {
            length = rep.length;
            for (i = 0; i < length; i += 1) {
                if (typeof rep[i] === "string") {
                    k = rep[i];
                    v = str(k, value);
                    if (v) {
                        partial.push(quote(k) + ((gap) ? ": ": ":") + v);
                    }
                }
            }
        } else {

            // Otherwise, iterate through all of the keys in the object.
            for (k in value) {
                if (Object.prototype.hasOwnProperty.call(value, k)) {
                    v = str(k, value);
                    if (v) {
                        partial.push(quote(k) + ((gap) ? ": ": ":") + v);
                    }
                }
            }
        }

        // Join all of the member texts together, separated with commas,
        // and wrap them in braces.
        v = partial.length === 0 ? "{}": gap ? "{\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "}": "{" + partial.join(",") + "}";
        gap = mind;
        return v;
    }
}

// If the JSON object does not yet have a stringify method, give it one.
if (typeof JSON.stringify !== "function") {
    meta = { // table of character substitutions
        "\b": "\\b",
        "\t": "\\t",
        "\n": "\\n",
        "\f": "\\f",
        "\r": "\\r",
        "\"": "\\\"",
        "\\": "\\\\"
    };
    JSON.stringify = function(value, replacer, space) {

        // The stringify method takes a value and an optional replacer, and an optional
        // space parameter, and returns a JSON text. The replacer can be a function
        // that can replace values, or an array of strings that will select the keys.
        // A default replacer method can be provided. Use of the space parameter can
        // produce text that is more easily readable.
        var i;
        gap = "";
        indent = "";

        // If the space parameter is a number, make an indent string containing that
        // many spaces.
        if (typeof space === "number") {
            for (i = 0; i < space; i += 1) {
                indent += " ";
            }

            // If the space parameter is a string, it will be used as the indent string.
        } else if (typeof space === "string") {
            indent = space;
        }

        // If there is a replacer, it must be a function or an array.
        // Otherwise, throw an error.
        rep = replacer;
        if (replacer && typeof replacer !== "function" && (typeof replacer !== "object" || typeof replacer.length !== "number")) {
            throw new Error("JSON.stringify");
        }

        // Make a fake root object containing our value under the key of "".
        // Return the result of stringifying the value.
        return str("", {
            "": value
        });
    };
}

// If the JSON object does not yet have a parse method, give it one.
if (typeof JSON.parse !== "function") {
    JSON.parse = function(text, reviver) {

        // The parse method takes a text and an optional reviver function, and returns
        // a JavaScript value if the text is a valid JSON text.
        var j;

        function walk(holder, key) {

            // The walk method is used to recursively walk the resulting structure so
            // that modifications can be made.
            var k;
            var v;
            var value = holder[key];
            if (value && typeof value === "object") {
                for (k in value) {
                    if (Object.prototype.hasOwnProperty.call(value, k)) {
                        v = walk(value, k);
                        if (v !== undefined) {
                            value[k] = v;
                        } else {
                            delete value[k];
                        }
                    }
                }
            }
            return reviver.call(holder, key, value);
        }

        // Parsing happens in four stages. In the first stage, we replace certain
        // Unicode characters with escape sequences. JavaScript handles many characters
        // incorrectly, either silently deleting them, or treating them as line endings.
        text = String(text);
        rx_dangerous.lastIndex = 0;
        if (rx_dangerous.test(text)) {
            text = text.replace(rx_dangerous,
            function(a) {
                return ("\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice( - 4));
            });
        }

        // In the second stage, we run the text against regular expressions that look
        // for non-JSON patterns. We are especially concerned with "()" and "new"
        // because they can cause invocation, and "=" because it can cause mutation.
        // But just to be safe, we want to reject all unexpected forms.
        // We split the second stage into 4 regexp operations in order to work around
        // crippling inefficiencies in IE's and Safari's regexp engines. First we
        // replace the JSON backslash pairs with "@" (a non-JSON character). Second, we
        // replace all simple value tokens with "]" characters. Third, we delete all
        // open brackets that follow a colon or comma or that begin the text. Finally,
        // we look to see that the remaining characters are only whitespace or "]" or
        // "," or ":" or "{" or "}". If that is so, then the text is safe for eval.
        if (rx_one.test(text.replace(rx_two, "@").replace(rx_three, "]").replace(rx_four, ""))) {

            // In the third stage we use the eval function to compile the text into a
            // JavaScript structure. The "{" operator is subject to a syntactic ambiguity
            // in JavaScript: it can begin a block or an object literal. We wrap the text
            // in parens to eliminate the ambiguity.
            j = eval("(" + text + ")");

            // In the optional fourth stage, we recursively walk the new structure, passing
            // each name/value pair to a reviver function for possible transformation.
            return (typeof reviver === "function") ? walk({
                "": j
            },
            "") : j;
        }

        // If the text is not JSON parseable, then a SyntaxError is thrown.
        throw new SyntaxError("JSON.parse");
    };
}
} ());

function getpwd() {

var jsondata_rsa = {};
jsondata_rsa['username'] = '15888888888';
jsondata_rsa['loginpass'] = '666666';
jsondata_rsa['code'] = '2c243b0625ade3e473e48d892fd8b216';
jsondata_rsa['vvccookie'] = 'c51a25003a2f2e160fba46a75d5f3d0b';
jsondata_rsa = rsa_encrypt(JSON.stringify(jsondata_rsa));
return jsondata_rsa

}