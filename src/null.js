import { TYPES } from './value.js';
import Literal from './literal.js';
import { RuntimeError } from './error.js';

/**
 * @typedef {import('./stream.js')} Stream
 */

/**
 * The null type within Knight, used to represent the lack of a value.
 *
 * @see Value - For more information on why we don't simply use `null`.
 * @extends {Literal<null>}
 */
export default class Null extends Literal {
	/**
	 * Attempts to parse a `Null` from the `stream`.
	 *
	 * @param {Stream} stream The stream from which to parse.
	 * @return {Null?} The parsed `Null`, or `null` if the stream did not start with `N`.
	 */
	static parse(stream) {
		return stream.match(/^N[A-Z]*/) && new Null();
	}

	/** Creates a new `Null`. */
	constructor(){
		super(null);
	}

	/**
	 * Returns `"null"`.
	 *
	 * @return {'null'}
	 */
	dump() {
		return 'null';
	}

	/**
	 * Returns an empty string, as per the Knight specs.
	 * 
	 * @returns {''}
	 */
	toString() {
		return '';
	}

	/**
	 * Returns an empty array.
	 * 
	 * @returns {[]}
	 */
	toArray() {
		return [];
	}

	/**
	 * Comparisons with `Null` are invalid, and this always fails.
	 *
	 * @param {Value} _rhs Ignored.
	 * @throws {RuntimeError} This is always thrown.
	 */
	cmp(_rhs) {
		throw new RuntimeError("Cannot compare Null.");
	}
}

// Add the `Null` class to the list of known types, so it can be parsed.
TYPES.push(Null);
