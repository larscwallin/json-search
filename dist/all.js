var O = {};
function F() {
}
function typeOf(a) {
  return a === void 0 ? "undefined" : a === null ? "null" : Object.prototype.toString.call(a).split(" ").pop().split("]").shift().toLowerCase()
}
typeof exports === "undefined" && (exports = {});
typeof require !== "function" && (require = function() {
  return exports
});
if(typeof Object.create !== "function") {
  Object.create = function(a) {
    F.prototype = a;
    return new F
  }
}
if(typeof Array.isArray !== "function") {
  Array.isArray = function(a) {
    return typeOf(a) === "array"
  }
}
if(typeof Array.add !== "function") {
  Array.add = function(a, c) {
    if(a.indexOf(c) === -1) {
      return a[a.length] = c, !0
    }
    return!1
  }
}
if(typeof Array.remove !== "function") {
  Array.remove = function(a, c) {
    var b = a.indexOf(c);
    if(b !== -1) {
      return a.splice(b, 1), !0
    }
    return!1
  }
}
if(!Array.append) {
  Array.append = function(a, c) {
    c = c.slice(0);
    c.unshift(a.length, 0);
    a.splice.apply(a, c);
    return a
  }
}
if(typeof Array.orderedInsert !== "function") {
  Array.orderedInsert = function(a, c, b) {
    var d, f, g;
    if(a.length === 0) {
      a[0] = c
    }else {
      d = 0;
      f = a.length - 1;
      for(g = Math.floor(f / 2);f - d > 0;) {
        b(a[g], c) <= 0 ? d = g + 1 : f = g - 1, g = Math.round(d + (f - d) / 2)
      }
      b(a[g], c) <= 0 ? a.splice(g + 1, 0, c) : a.splice(g, 0, c)
    }
  }
}
;var EventEmitter = function() {
};
try {
  if(!require("events").EventEmitter) {
    throw Error();
  }
  EventEmitter = require("events").EventEmitter
}catch(e$$5) {
  EventEmitter.prototype.emit = function(a, c) {
    if(a === "error" && (!this._events || !this._events.error || Array.isArray(this._events.error) && !this._events.error.length)) {
      if(arguments[1] instanceof Error) {
        throw arguments[1];
      }else {
        throw Error("Uncaught, unspecified 'error' event.");
      }
    }
    if(!this._events) {
      return!1
    }
    var b = this._events[a];
    if(!b) {
      return!1
    }
    if(typeof b == "function") {
      switch(arguments.length) {
        case 1:
          b.call(this);
          break;
        case 2:
          b.call(this, arguments[1]);
          break;
        case 3:
          b.call(this, arguments[1], arguments[2]);
          break;
        default:
          c = Array.prototype.slice.call(arguments, 1), b.apply(this, c)
      }
      return!0
    }else {
      if(Array.isArray(b)) {
        for(var c = Array.prototype.slice.call(arguments, 1), b = b.slice(), d = 0, f = b.length;d < f;d++) {
          b[d].apply(this, c)
        }
        return!0
      }else {
        return!1
      }
    }
  }, EventEmitter.prototype.addListener = function(a, c) {
    if("function" !== typeof c) {
      throw Error("addListener only takes instances of Function");
    }
    if(!this._events) {
      this._events = {}
    }
    this._events[a] ? Array.isArray(this._events[a]) ? this._events[a].push(c) : this._events[a] = [this._events[a], c] : this._events[a] = c;
    return this
  }, EventEmitter.prototype.on = EventEmitter.prototype.addListener, EventEmitter.prototype.once = function(a, c) {
    function b() {
      d.removeListener(a, b);
      c.apply(this, arguments)
    }
    if("function" !== typeof c) {
      throw Error(".once only takes instances of Function");
    }
    var d = this;
    b.listener = c;
    d.on(a, b);
    return this
  }, EventEmitter.prototype.removeListener = function(a, c) {
    if("function" !== typeof c) {
      throw Error("removeListener only takes instances of Function");
    }
    if(!this._events || !this._events[a]) {
      return this
    }
    var b = this._events[a];
    if(Array.isArray(b)) {
      for(var d = -1, f = 0, g = b.length;f < g;f++) {
        if(b[f] === c || b[f].listener && b[f].listener === c) {
          d = f;
          break
        }
      }
      if(d < 0) {
        return this
      }
      b.length === 1 ? delete this._events[a] : b.splice(d, 1)
    }else {
      (b === c || b.listener && b.listener === c) && delete this._events[a]
    }
    return this
  }, EventEmitter.prototype.removeAllListeners = function(a) {
    if(arguments.length === 0) {
      return this._events = {}, this
    }
    a && this._events && this._events[a] && (this._events[a] = null);
    return this
  }, EventEmitter.prototype.listeners = function(a) {
    if(!this._events) {
      this._events = {}
    }
    this._events[a] || (this._events[a] = []);
    Array.isArray(this._events[a]) || (this._events[a] = [this._events[a]]);
    return this._events[a]
  }
}
exports.EventEmitter = EventEmitter;
function Stream() {
  EventEmitter.call(this)
}
Stream.prototype = Object.create(EventEmitter.prototype);
Stream.prototype.readable = !1;
Stream.prototype.writable = !1;
Stream.prototype.pipe = function(a, c) {
  function b(c) {
    a.writable && !1 === a.write(c) && k.pause()
  }
  function d(c) {
    a.emit("error", c);
    k.destroy()
  }
  function f() {
    k.readable && k.resume()
  }
  function g() {
    a.end()
  }
  function j() {
    k.pause()
  }
  function p() {
    k.readable && k.resume()
  }
  function n() {
    k.removeListener("data", b);
    k.removeListener("error", d);
    a.removeListener("drain", f);
    k.removeListener("end", g);
    k.removeListener("close", g);
    a.removeListener("pause", j);
    a.removeListener("resume", p);
    k.removeListener("end", n);
    k.removeListener("close", n);
    k.removeListener("error", n);
    a.removeListener("end", n);
    a.removeListener("close", n)
  }
  var k = this;
  k.on("data", b);
  if(!c || c.error !== !1) {
    k.on("error", d)
  }
  a.on("drain", f);
  if(!c || c.end !== !1) {
    k.on("end", g), k.on("close", g)
  }
  a.on("pause", j);
  a.on("resume", p);
  k.on("end", n);
  k.on("close", n);
  k.on("error", n);
  a.on("end", n);
  a.on("close", n)
};
Stream.prototype.pause = function() {
  this.emit("pause")
};
Stream.prototype.resume = function() {
  this.emit("resume")
};
Stream.prototype.destroy = function() {
  this.writable = this.readable = !1;
  this.emit("close");
  this.removeAllListeners()
};
Stream.prototype.destroySoon = Stream.prototype.destroy;
exports.Stream = Stream;
function Collector(a) {
  var c = this;
  Stream.call(this);
  this.collection = [];
  this.callback = a || null;
  this.on("error", function(a) {
    if(c.callback) {
      c.callback(a), c.callback = null
    }
  })
}
Collector.prototype = Object.create(Stream.prototype);
Collector.prototype.callback = null;
Collector.prototype.writable = !0;
Collector.prototype.write = function(a) {
  this.collection.push(a);
  return!0
};
Collector.prototype.end = function(a) {
  typeof a !== "undefined" && this.write(a);
  this.destroy()
};
Collector.prototype.destroy = function() {
  if(this.callback) {
    this.callback(null, this.collection), this.callback = null
  }
};
Collector.prototype.destroySoon = Collector.prototype.destroy;
exports.Collector = Collector;
function SingleCollector() {
  Stream.call(this)
}
SingleCollector.prototype = Object.create(Stream.prototype);
SingleCollector.prototype._writing = !1;
SingleCollector.prototype.readable = !0;
SingleCollector.prototype.writable = !0;
SingleCollector.prototype.write = function(a) {
  if(typeof this.data !== "undefined") {
    throw Error("Stream is full");
  }
  this.data = a;
  this._writing = !0;
  this.emit("data", a);
  this._writing = !1;
  return typeof this.data === "undefined"
};
SingleCollector.prototype.drain = function() {
  this.data = void 0;
  this._writing || this.emit("drain")
};
SingleCollector.prototype.end = function(a) {
  typeof a !== "undefined" && this.write(a);
  this.emit("end");
  this.destroy()
};
exports.SingleCollector = SingleCollector;
function DocumentTerms(a, c) {
  this.id = a;
  this.terms = c || []
}
DocumentTerms.prototype.terms = [];
DocumentTerms.prototype.sumOfSquaredWeights = 0;
DocumentTerms.prototype.score = 0;
exports.DocumentTerms = DocumentTerms;
function TopDocumentsCollector(a, c) {
  Collector.call(this, c);
  this.max = a || 1
}
TopDocumentsCollector.compareScores = function(a, c) {
  return c.score - a.score
};
TopDocumentsCollector.prototype = Object.create(Collector.prototype);
TopDocumentsCollector.prototype.lowestScore = 0;
TopDocumentsCollector.prototype.write = function(a) {
  if(this.collection.length < this.max || a.score > this.lowestScore) {
    this.collection.length >= this.max && this.collection.pop(), Array.orderedInsert(this.collection, a, TopDocumentsCollector.compareScores), this.lowestScore = this.collection[this.collection.length - 1].score
  }
};
exports.TopDocumentsCollector = TopDocumentsCollector;
function DefaultTermIndexer() {
}
DefaultTermIndexer.prototype.index = function(a, c) {
  var b, d, f, g = [];
  switch(typeOf(a)) {
    case "null":
    ;
    case "boolean":
    ;
    case "number":
      g[0] = {term:a, field:c};
      break;
    case "string":
      b = a.replace(/[^\w\d]/g, " ").replace(/\s\s/g, " ").toLowerCase().split(" ");
      d = {};
      for(f = 0;f < b.length;++f) {
        d[b[f]] ? (d[b[f]].termFrequency++, d[b[f]].termPositions.push(f), d[b[f]].termOffsets.push(f)) : d[b[f]] = {term:b[f], termFrequency:1, termPositions:[f], termOffsets:[f], field:c, totalFieldTokens:b.length}
      }
      for(f in d) {
        d[f] !== O[f] && (g[g.length] = d[f])
      }
      break;
    case "object":
      for(f in a) {
        a[f] !== O[f] && (g = g.concat(this.index(a[f], c ? c + "." + f : f)))
      }
      break;
    case "array":
      for(f = 0;f < a.length;++f) {
        g = g.concat(this.index(a[f], c ? c + "." + f : String(f)))
      }
  }
  return g
};
DefaultTermIndexer.prototype.toSource = function() {
};
exports.DefaultTermIndexer = DefaultTermIndexer;
function ArrayStream(a, c) {
  Stream.call(this);
  this._entries = a;
  this._index = 0;
  this._mapper = c
}
ArrayStream.prototype = Object.create(Stream.prototype);
ArrayStream.prototype._started = !1;
ArrayStream.prototype._paused = !1;
ArrayStream.prototype.readable = !0;
ArrayStream.prototype._run = function() {
  var a;
  for(this._started = !0;!this._paused && this._index < this._entries.length;) {
    a = this._entries[this._index++], this._mapper && (a = this._mapper(a)), this.emit("data", a)
  }
  !this._paused && this._index >= this._entries.length && (this.emit("end"), this.destroy())
};
ArrayStream.prototype.start = function() {
  var a = this;
  setTimeout(function() {
    a._run()
  }, 0);
  return this
};
ArrayStream.prototype.pause = function() {
  this._paused = !0;
  Stream.prototype.pause.call(this)
};
ArrayStream.prototype.resume = function() {
  if(this._started && this._paused) {
    this._paused = !1, this.start(), Stream.prototype.resume.call(this)
  }
};
ArrayStream.prototype.destroy = function() {
  this._index = Number.POSITIVE_INFINITY;
  Stream.prototype.destroy.call(this)
};
ArrayStream.prototype.destroySoon = function() {
};
exports.ArrayStream = ArrayStream;
function MemoryIndex() {
  this._docs = {};
  this._termVecs = {}
}
MemoryIndex.documentIDComparator = function(a, c) {
  if(a.documentID < c.documentID) {
    return-1
  }else {
    if(a.documentID > c.documentID) {
      return 1
    }
  }
  return 0
};
MemoryIndex.prototype._docCount = 0;
MemoryIndex.prototype._termIndexer = new DefaultTermIndexer;
MemoryIndex.prototype.generateID = function() {
  return String(Math.random())
};
MemoryIndex.prototype.addDocument = function(a, c, b) {
  var d, f, g, c = typeof c === "undefined" || typeOf(c) === "null" ? this.generateID() : String(c);
  this._docs[c] = a;
  this._docCount++;
  a = this._termIndexer.index(a);
  d = 0;
  for(f = a.length;d < f;++d) {
    a[d].documentID = c, g = JSON.stringify([a[d].term, a[d].field]), this._termVecs[g] ? Array.orderedInsert(this._termVecs[g], a[d], MemoryIndex.documentIDComparator) : this._termVecs[g] = [a[d]]
  }
  b && b(null)
};
MemoryIndex.prototype.getDocument = function(a, c) {
  c(null, this._docs[a])
};
MemoryIndex.prototype.setTermIndexer = function(a) {
  this._termIndexer = a
};
MemoryIndex.prototype.getTermVectors = function(a, c) {
  var b = this._termVecs[JSON.stringify([a, c])] || [], d = this;
  return(new ArrayStream(b, function(a) {
    return{term:a.term, termFrequency:a.termFrequency || 1, termPositions:a.termPositions || [0], termOffsets:a.termOffsets || [0], field:a.field || null, fieldBoost:a.fieldBoost || 1, totalFieldTokens:a.totalFieldTokens || 1, documentBoost:a.fieldBoost || 1, documentID:a.documentID, documentFrequency:b.length, totalDocuments:d._docCount}
  })).start()
};
exports.MemoryIndex = MemoryIndex;
var DefaultSimilarity = function() {
};
DefaultSimilarity.prototype.norm = function(a) {
  return a.documentBoost * a.fieldBoost * (1 / Math.sqrt(a.totalFieldTokens))
};
DefaultSimilarity.prototype.queryNorm = function(a) {
  return 1 / Math.sqrt(a.sumOfSquaredWeights)
};
DefaultSimilarity.prototype.tf = function(a) {
  return Math.sqrt(a.termFrequency)
};
DefaultSimilarity.prototype.sloppyFreq = function(a) {
  return 1 / (a + 1)
};
DefaultSimilarity.prototype.idf = function(a) {
  return Math.log(a.totalDocuments / (a.documentFrequency + 1)) + 1
};
DefaultSimilarity.prototype.coord = function(a, c) {
  return a / c
};
exports.DefaultSimilarity = DefaultSimilarity;
function Searcher(a) {
  this._index = a
}
Searcher.prototype.similarity = new DefaultSimilarity;
Searcher.prototype.search = function(a, c, b) {
  c = new TopDocumentsCollector(c, b);
  (new NormalizedQuery(a)).score(this.similarity, this._index).pipe(c)
};
exports.Searcher = Searcher;
function TermQuery(a, c, b) {
  this.term = a;
  this.field = c || null;
  this.boost = b || 1
}
TermQuery.prototype.field = null;
TermQuery.prototype.boost = 1;
TermQuery.prototype.score = function(a, c) {
  var b = new TermScorer(this, a);
  c.getTermVectors(this.term, this.field).pipe(b);
  return b
};
TermQuery.prototype.extractTerms = function() {
  return[{term:this.term, field:this.field}]
};
TermQuery.prototype.rewrite = function() {
  return this
};
function TermScorer(a, c) {
  Stream.call(this);
  this._boost = a.boost;
  this._similarity = c
}
TermScorer.prototype = Object.create(Stream.prototype);
TermScorer.prototype.readable = !0;
TermScorer.prototype.writable = !0;
TermScorer.prototype.write = function(a) {
  var c = this._similarity, b = new DocumentTerms(a.documentID, [a]), d = c.idf(a);
  b.sumOfSquaredWeights = d * this._boost * d * this._boost;
  b.score = c.tf(a) * d * d * this._boost * c.norm(a);
  this.emit("data", b)
};
TermScorer.prototype.end = function(a) {
  typeof a !== "undefined" && this.write(a);
  this.emit("end");
  this.destroy()
};
exports.TermQuery = TermQuery;
function NormalizedQuery(a) {
  this.query = a
}
NormalizedQuery.prototype.boost = 1;
NormalizedQuery.prototype.score = function(a, c) {
  var b = new NormalizedScorer(this, a);
  this.query.score(a, c).pipe(b);
  return b
};
NormalizedQuery.prototype.extractTerms = function() {
  return this.query.extractTerms()
};
NormalizedQuery.prototype.rewrite = function() {
  var a;
  do {
    a = this.query, this.query = this.query.rewrite()
  }while(this.query !== a);
  return this
};
function NormalizedScorer(a, c) {
  Stream.call(this);
  this._similarity = c;
  this._maxOverlap = a.extractTerms().length
}
NormalizedScorer.prototype = Object.create(Stream.prototype);
NormalizedScorer.prototype.readable = !0;
NormalizedScorer.prototype.writable = !0;
NormalizedScorer.prototype.write = function(a) {
  a.score *= this._similarity.queryNorm(a) * this._similarity.coord(a.terms.length, this._maxOverlap);
  this.emit("data", a)
};
NormalizedScorer.prototype.end = function(a) {
  typeof a !== "undefined" && this.write(a);
  this.emit("end");
  this.destroy()
};
exports.NormalizedQuery = NormalizedQuery;
function BooleanClause(a, c) {
  this.query = a;
  this.occur = c || Occur.SHOULD
}
var Occur = {MUST:1, SHOULD:0, MUST_NOT:-1};
exports.BooleanQuery = BooleanQuery;
exports.Occur = Occur;
function BooleanQuery(a, c, b) {
  this.clauses = a || [];
  this.minimumOptionalMatches = c || 0;
  this.boost = b || 1
}
BooleanQuery.prototype.minimumOptionalMatches = 0;
BooleanQuery.prototype.boost = 1;
BooleanQuery.prototype.score = function(a, c) {
  return new BooleanScorer(this, a, c)
};
BooleanQuery.prototype.extractTerms = function() {
  var a, c, b = [];
  a = 0;
  for(c = this.clauses.length;a < c;++a) {
    b = b.concat(this.clauses[a].query.extractTerms())
  }
  return b
};
BooleanQuery.prototype.rewrite = function() {
  var a, c, b, d = !1;
  if(this.minimumOptionalMatches === 0 && this.clauses.length === 1 && this.clauses[0].occur !== Occur.MUST_NOT) {
    a = this.clauses[0].query, a = a.rewrite(), a.boost *= this.boost
  }else {
    a = new BooleanQuery;
    a.boost = this.boost;
    c = 0;
    for(b = this.clauses.length;c < b;++c) {
      a.clauses[c] = new BooleanClause(this.clauses[c].query.rewrite(), this.clauses[c].occur), a.clauses[c].query !== this.clauses[c].query && (d = !0)
    }
    d || (a = this)
  }
  return a
};
function BooleanScorer(a, c, b) {
  Stream.call(this);
  this._query = a;
  this._similarity = c;
  this._index = b;
  this._inputs = [];
  this.addInputs(a.clauses)
}
BooleanScorer.prototype = Object.create(Stream.prototype);
BooleanScorer.prototype._collectorCount = 0;
BooleanScorer.prototype._paused = !1;
BooleanScorer.prototype.readable = !0;
BooleanScorer.prototype.writable = !0;
BooleanScorer.prototype.addInputs = function(a) {
  var c = this, b, d, f, g, j;
  b = 0;
  for(d = a.length;b < d;++b) {
    f = a[b], g = new SingleCollector, j = new BooleanClauseStream(f.query, f.occur, g), g.pipe(this, {end:!1}), f.query.score(this._similarity, this._index).pipe(g), this._inputs.push(j), this._collectorCount++, f = function(a) {
      return function() {
        a.collector.removeListener("end", arguments.callee);
        a.collector.removeListener("close", arguments.callee);
        a.collector = null;
        c._collectorCount--;
        if(!c._collectorCount || a.occur === Occur.MUST) {
          c._collectorCount = 0, c.end()
        }
      }
    }(j), g.on("end", f), g.on("close", f)
  }
};
BooleanScorer.prototype.write = function() {
  var a, c, b = [], d = 0, f = !1, g = 0, j;
  if(this._paused) {
    return!0
  }
  a = 0;
  for(c = this._inputs.length;a < c;++a) {
    if(this._inputs[a].collector) {
      if(b[a] = this._inputs[a].collector.data, typeof b[a] === "undefined") {
        return!0
      }
    }else {
      b[a] = void 0
    }
    if(a > 0 && (!b[d] || b[a] && b[a].id < b[d].id)) {
      d = a
    }
  }
  d = b[d].id;
  j = new DocumentTerms(d);
  a = 0;
  for(c = this._inputs.length;a < c;++a) {
    if(b[a] && b[a].id === d) {
      if(this._inputs[a].occur === Occur.MUST_NOT) {
        f = !1;
        break
      }else {
        this._inputs[a].occur === Occur.SHOULD && g++, f = !0, j.terms = j.terms.concat(b[a].terms), j.sumOfSquaredWeights += b[a].sumOfSquaredWeights, j.score += b[a].score
      }
    }else {
      if(this._inputs[a].occur === Occur.MUST) {
        f = !1;
        break
      }
    }
  }
  f && g >= this._query.minimumOptionalMatches && (j.sumOfSquaredWeights *= this._query.boost, this.emit("data", j));
  a = 0;
  for(c = this._inputs.length;a < c;++a) {
    b[a] && b[a].id === d && this._inputs[a].collector.drain()
  }
  return!0
};
BooleanScorer.prototype.end = function() {
  if(this._collectorCount) {
    throw Error("BooleanScorer#end called while there are still collectors attached!");
  }
  this.emit("end");
  this.destroy()
};
BooleanScorer.prototype.pause = function() {
  this._paused = !0
};
BooleanScorer.prototype.resume = function() {
  this._paused = !1;
  this.write()
};
BooleanScorer.prototype.destroy = function() {
  var a, c;
  a = 0;
  for(c = this._inputs.length;a < c;++a) {
    this._inputs[a].collector && this._inputs[a].collector.destroy()
  }
  Stream.prototype.destroy.call(this)
};
BooleanScorer.prototype.destroySoon = BooleanScorer.prototype.destroy;
function BooleanClauseStream(a, c, b) {
  this.query = a;
  this.occur = c;
  this.collector = b
}
BooleanClauseStream.prototype = Object.create(BooleanClause.prototype);
exports.BooleanQuery = BooleanQuery;
function QueryParser() {
}
QueryParser.parse = function(a, c) {
  var b, d;
  b = QueryParser.impl.parse(a, void 0, c || null);
  do {
    d = b, b = b.rewrite()
  }while(b !== d);
  return b
};
QueryParser.impl = function() {
  var a = {parse:function(a, b, d) {
    function f(a) {
      var c = a.charCodeAt(0);
      if(c <= 255) {
        var a = "x", e = 2
      }else {
        a = "u", e = 4
      }
      var a = "\\" + a, b = c.toString(16).toUpperCase(), c = b;
      e -= b.length;
      for(b = 0;b < e;b++) {
        c = "0" + c
      }
      return a + c
    }
    function g(a) {
      return'"' + a.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\r/g, "\\r").replace(/\n/g, "\\n").replace(/[\x80-\uFFFF]/g, f) + '"'
    }
    function j(a) {
      e < q || (e > q && (q = e, s = []), s.push(a))
    }
    function p() {
      var b = "WHITESPACE@" + e, h = m[b];
      if(h) {
        return e = h.nextPos, h.result
      }
      h = l;
      l = !1;
      if(a.substr(e).match(/^[ \t\n\r\u3000]/) !== null) {
        var i = a.charAt(e);
        e++
      }else {
        i = null, l && j("[ \t\\n\\r\\u3000]")
      }
      (l = h) && i === null && j("whitespace");
      m[b] = {nextPos:e, result:i};
      return i
    }
    function n() {
      var a = "SKIP@" + e, c = m[a];
      if(c) {
        return e = c.nextPos, c.result
      }
      for(var c = [], b = p();b !== null;) {
        c.push(b), b = p()
      }
      m[a] = {nextPos:e, result:c};
      return c
    }
    function k() {
      var b = "Number@" + e, h = m[b];
      if(h) {
        return e = h.nextPos, h.result
      }
      h = l;
      l = !1;
      var i = e;
      if(a.substr(e).match(/^[0-9]/) !== null) {
        var o = a.charAt(e);
        e++
      }else {
        o = null, l && j("[0-9]")
      }
      if(o !== null) {
        for(var d = [];o !== null;) {
          d.push(o), a.substr(e).match(/^[0-9]/) !== null ? (o = a.charAt(e), e++) : (o = null, l && j("[0-9]"))
        }
      }else {
        d = null
      }
      if(d !== null) {
        o = e;
        if(a.substr(e, 1) === ".") {
          var f = ".";
          e += 1
        }else {
          f = null, l && j('"."')
        }
        if(f !== null) {
          if(a.substr(e).match(/^[0-9]/) !== null) {
            var g = a.charAt(e);
            e++
          }else {
            g = null, l && j("[0-9]")
          }
          if(g !== null) {
            for(var k = [];g !== null;) {
              k.push(g), a.substr(e).match(/^[0-9]/) !== null ? (g = a.charAt(e), e++) : (g = null, l && j("[0-9]"))
            }
          }else {
            k = null
          }
          k !== null ? f = [f, k] : (f = null, e = o)
        }else {
          f = null, e = o
        }
        o = f !== null ? f : "";
        o !== null ? d = [d, o] : (d = null, e = i)
      }else {
        d = null, e = i
      }
      i = d !== null ? parseFloat(d[0].concat(d[1][0], d[1][1]).join("")) : null;
      (l = h) && i === null && j("number");
      m[b] = {nextPos:e, result:i};
      return i
    }
    function x() {
      var b = "ESCAPED_CHAR@" + e, h = m[b];
      if(h) {
        return e = h.nextPos, h.result
      }
      h = e;
      if(a.substr(e, 1) === "\\") {
        var i = "\\";
        e += 1
      }else {
        i = null, l && j('"\\\\"')
      }
      if(i !== null) {
        if(a.length > e) {
          var d = a.charAt(e);
          e++
        }else {
          d = null, l && j("any character")
        }
        d !== null ? i = [i, d] : (i = null, e = h)
      }else {
        i = null, e = h
      }
      m[b] = {nextPos:e, result:i};
      return i
    }
    function t() {
      var b = "TERM_START_CHAR@" + e, h = m[b];
      if(h) {
        return e = h.nextPos, h.result
      }
      a.substr(e).match(/^[^ \t\n\r\u3000+\-!():^[\]"{}~*?\\]/) !== null ? (h = a.charAt(e), e++) : (h = null, l && j('[^ \t\\n\\r\\u3000+\\-!():^[\\]"{}~*?\\\\]'));
      m[b] = {nextPos:e, result:h};
      return h
    }
    function u() {
      var b = "TERM_CHAR@" + e, h = m[b];
      if(h) {
        return e = h.nextPos, h.result
      }
      h = t();
      h === null && (h = x(), h === null && (a.substr(e, 1) === "-" ? (h = "-", e += 1) : (h = null, l && j('"-"')), h === null && (a.substr(e, 1) === "+" ? (h = "+", e += 1) : (h = null, l && j('"+"')), h = h !== null ? h : null)));
      m[b] = {nextPos:e, result:h};
      return h
    }
    function v() {
      var a = "Term@" + e, c = m[a];
      if(c) {
        return e = c.nextPos, c.result
      }
      c = l;
      l = !1;
      var b = e, d = t();
      if(d !== null) {
        for(var f = [], g = u();g !== null;) {
          f.push(g), g = u()
        }
        f !== null ? d = [d, f] : (d = null, e = b)
      }else {
        d = null, e = b
      }
      b = d !== null ? [d[0]].concat(d[1]).join("") : null;
      (l = c) && b === null && j("term");
      m[a] = {nextPos:e, result:b};
      return b
    }
    function w() {
      var b = "Boost@" + e, h = m[b];
      if(h) {
        return e = h.nextPos, h.result
      }
      h = l;
      l = !1;
      var i = e;
      if(a.substr(e, 1) === "^") {
        var d = "^";
        e += 1
      }else {
        d = null, l && j('"^"')
      }
      if(d !== null) {
        var f = k();
        f !== null ? d = [d, f] : (d = null, e = i)
      }else {
        d = null, e = i
      }
      i = d !== null ? d : "";
      i = i !== null ? function(a) {
        a && (a = a[1]);
        return typeof a === "number" ? a : 1
      }(i) : null;
      (l = h) && i === null && j("boost");
      m[b] = {nextPos:e, result:i};
      return i
    }
    function y() {
      var b = "TermQuery@" + e, h = m[b];
      if(h) {
        return e = h.nextPos, h.result
      }
      var i = h = e, d = v();
      if(d !== null) {
        if(a.substr(e, 1) === ":") {
          var f = ":";
          e += 1
        }else {
          f = null, l && j('":"')
        }
        f !== null ? d = [d, f] : (d = null, e = i)
      }else {
        d = null, e = i
      }
      i = d !== null ? d : "";
      i !== null ? (d = v(), d !== null ? (f = w(), f !== null ? i = [i, d, f] : (i = null, e = h)) : (i = null, e = h)) : (i = null, e = h);
      h = i !== null ? new TermQuery(i[1], i[0] ? i[0][0] : D, i[2]) : null;
      m[b] = {nextPos:e, result:h};
      return h
    }
    function r() {
      var b = "BooleanClause@" + e, h = m[b];
      if(h) {
        return e = h.nextPos, h.result
      }
      h = e;
      if(a.substr(e, 1) === "+") {
        var d = "+";
        e += 1
      }else {
        d = null, l && j('"+"')
      }
      d === null && (a.substr(e, 1) === "-" ? (d = "-", e += 1) : (d = null, l && j('"-"')), d = d !== null ? d : null);
      d = d !== null ? d : "";
      if(d !== null) {
        var f = z();
        f === null && (f = y(), f = f !== null ? f : null);
        f !== null ? d = [d, f] : (d = null, e = h)
      }else {
        d = null, e = h
      }
      h = d !== null ? function(a, b) {
        a = a === "+" ? Occur.MUST : a === "-" ? Occur.MUST_NOT : Occur.SHOULD;
        return new BooleanClause(b, a)
      }(d[0], d[1]) : null;
      m[b] = {nextPos:e, result:h};
      return h
    }
    function A() {
      var a = "BooleanQuery@" + e, b = m[a];
      if(b) {
        return e = b.nextPos, b.result
      }
      var b = e, c = r();
      if(c !== null) {
        var d = [], f = e, g = n();
        if(g !== null) {
          var j = r();
          j !== null ? g = [g, j] : (g = null, e = f)
        }else {
          g = null, e = f
        }
        for(;g !== null;) {
          d.push(g), f = e, g = n(), g !== null ? (j = r(), j !== null ? g = [g, j] : (g = null, e = f)) : (g = null, e = f)
        }
        d !== null ? c = [c, d] : (c = null, e = b)
      }else {
        c = null, e = b
      }
      b = c !== null ? function(a, b) {
        var c = [a];
        if(b) {
          for(var d = 0, e = b.length;d < e;++d) {
            c[c.length] = b[d][1]
          }
        }
        return new BooleanQuery(c)
      }(c[0], c[1]) : null;
      m[a] = {nextPos:e, result:b};
      return b
    }
    function z() {
      var b = "SubQuery@" + e, d = m[b];
      if(d) {
        return e = d.nextPos, d.result
      }
      d = e;
      if(a.substr(e, 1) === "(") {
        var f = "(";
        e += 1
      }else {
        f = null, l && j('"("')
      }
      if(f !== null) {
        var g = B();
        if(g !== null) {
          if(a.substr(e, 1) === ")") {
            var k = ")";
            e += 1
          }else {
            k = null, l && j('")"')
          }
          if(k !== null) {
            var n = w();
            n !== null ? f = [f, g, k, n] : (f = null, e = d)
          }else {
            f = null, e = d
          }
        }else {
          f = null, e = d
        }
      }else {
        f = null, e = d
      }
      d = f !== null ? function(a, b) {
        a.boost = b;
        return a
      }(f[1], f[3]) : null;
      m[b] = {nextPos:e, result:d};
      return d
    }
    function B() {
      var a = "Query@" + e, b = m[a];
      if(b) {
        return e = b.nextPos, b.result
      }
      var b = e, c = n();
      if(c !== null) {
        var d = A();
        if(d !== null) {
          var f = n();
          f !== null ? c = [c, d, f] : (c = null, e = b)
        }else {
          c = null, e = b
        }
      }else {
        c = null, e = b
      }
      b = c !== null ? c[1] : null;
      m[a] = {nextPos:e, result:b};
      return b
    }
    function E() {
      var b = function(a) {
        a.sort();
        for(var b = null, c = [], d = 0;d < a.length;d++) {
          a[d] !== b && (c.push(a[d]), b = a[d])
        }
        switch(c.length) {
          case 0:
            return"end of input";
          case 1:
            return c[0];
          default:
            return c.slice(0, c.length - 1).join(", ") + " or " + c[c.length - 1]
        }
      }(s), d = Math.max(e, q), d = d < a.length ? g(a.charAt(d)) : "end of input";
      return"Expected " + b + " but " + d + " found."
    }
    function G() {
      for(var b = 1, d = 1, e = !1, f = 0;f < q;f++) {
        var g = a.charAt(f);
        g === "\n" ? (e || b++, d = 1, e = !1) : g === "\r" | g === "\u2028" || g === "\u2029" ? (b++, d = 1, e = !0) : (d++, e = !1)
      }
      return{line:b, column:d}
    }
    var C = {BooleanClause:r, BooleanQuery:A, Boost:w, ESCAPED_CHAR:x, Number:k, Query:B, SKIP:n, SubQuery:z, TERM_CHAR:u, TERM_START_CHAR:t, Term:v, TermQuery:y, WHITESPACE:p};
    if(b !== void 0) {
      if(C[b] === void 0) {
        throw Error("Invalid rule name: " + g(b) + ".");
      }
    }else {
      b = "Query"
    }
    var e = 0, l = !0, q = 0, s = [], m = {}, D = d || null, b = C[b]();
    if(b === null || e !== a.length) {
      throw b = G(), new this.SyntaxError(E(), b.line, b.column);
    }
    return b
  }, SyntaxError:function(a, b, d) {
    this.name = "SyntaxError";
    this.message = a;
    this.line = b;
    this.column = d
  }};
  a.SyntaxError.prototype = Error.prototype;
  return a
}();

