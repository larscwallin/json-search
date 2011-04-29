/**
 * @constructor
 * @implements Query
 * @param {string} term
 * @param {string|null} [field]
 * @param {number} [boost]
 */

function TermQuery(term, field, boost) {
	this.term = term;
	this.field = field || null;
	this.boost = boost || 1.0;
};

/**
 * @type {string}
 */

TermQuery.prototype.term;

/**
 * @type {string|null}
 */

TermQuery.prototype.field = null;

/**
 * @type {number}
 */

TermQuery.prototype.boost = 1.0;

/**
 * @param {Index} index
 * @param {Similarity} similarity
 * @return {ReadableStream}
 */

TermQuery.prototype.score = function (index, similarity) {
	var scorer = new TermScorer(this, similarity);
	index.getTermVectors(this.term, this.field).pipe(scorer);
	return scorer;
};

/**
 * @return {Array.<string>}
 */

TermQuery.prototype.extractTerms = function () {
	return [this.term];
};


/**
 * @protected
 * @constructor
 * @extends Stream
 * @implements ReadableStream
 * @implements WritableStream
 * @param {TermQuery} query
 * @param {Similarity} similarity
 */

function TermScorer(query, similarity) {
	Stream.call(this);
	this._query = query;
	this._similarity = similarity;
}

TermScorer.prototype = Object.create(Stream.prototype);

/**
 * @protected
 * @type {TermQuery}
 */

TermScorer.prototype._query;

/**
 * @protected
 * @type {Similarity}
 */

TermScorer.prototype._similarity;

TermScorer.prototype.readable = true;

TermScorer.prototype.writable = true;

/**
 * @param {TermVector} termVec
 */

TermScorer.prototype.write = function (termVec) {
	var similarity = this._similarity,
		doc = new DocumentTerms(termVec.documentID, [termVec]);
	
	//compute sumOfSquaredWeights
	doc.sumOfSquaredWeights = Math.pow((similarity.idf(termVec) * this._query.boost), 2);
	
	//compute score
	doc.score = similarity.tf(termVec) * 
		Math.pow(similarity.idf(termVec), 2) * 
		this._query.boost * 
		similarity.norm(termVec);
	
	this.emit('data', doc);
};

/**
 * @param {TermVector} [termVec]
 */

TermScorer.prototype.end = function (termVec) {
	if (typeof termVec !== "undefined") {
		this.write(termVec);
	}
	this.emit('end');
	this.destroy();
};


exports.TermQuery = TermQuery;