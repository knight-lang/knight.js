import { TYPES } from './value.js';
import Literal from './literal.js';

/**
 * @typedef {import('./stream.js')} Stream
 * @typedef {import('./value.js')} Value
 */

/**
 * The boolean type within Knight, used to represent truthfulness.
 *
 * @see Value For more information on why we don't simply use `true`/`false`.
 * @extends {Literal<boolean>}
 */
export default class Bool extends Literal {
	/**
	 * Attempts to parse a `Bool` from `stream`.
	 *
	 * @param {Stream} stream The stream from which to parse.
	 * @return {Bool?} The parsed `Bool`, or `null` if the stream did not start with `T` or `F`.
	 */
	static parse(stream) {
		const match = stream.match(/^([TF])[A-Z]*/, 1);

		return match && new Bool(match === 'T');
	}

	/**
	 * Provides a debugging representation of this class.
	 *
	 * @return {string}
	 */
	dump() {
		return this.toString();
	}

	/**
	 * Converts this class to a JavaScript Array, according to the Knight specs.
	 *
	 * @return {Array<Value>} an empty array when false, and `[this]` for true.
	 */
	toArray() {
		return this._data ? [this] : [];
	}

	/**
	 * Returns a negative, zero, or positive number based on whether `rhs` is larger than, equal
	 * to, or smaller than `this`.
	 *
	 * @param {Value} rhs The value against which to compare.
	 * @return {int} a negative, zero, or positive integer.
	 */
	cmp(rhs) {
		return +this._data - +rhs.toBoolean();
	}
}

// Add the `Bool` class to the list of known types, so it can be parsed.
TYPES.push(Bool);
