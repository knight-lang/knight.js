import { TYPES } from './value.js';
import { Literal } from './literal.js';

/**
 * @typedef {import('./stream.js').Stream} Stream
 * @typedef {import('./value.js').Value} Value
 */

/**
 * The boolean type within Knight, used to represent truthfulness.
 *
 * @see Value - For more information on why we don't simply use `true`/`false`.
 * @extends {Literal<boolean>}
 */
export class Bool extends Literal {
	/**
	 * Attempts to parse a `Bool` from `stream`.
	 *
	 * @param {Stream} stream - The stream from which to parse.
	 * @return {Bool|null} - The parsed `Bool`, or `null` if the stream did not start with `T`/`F`.
	 */
	static parse(stream) {
		const match = stream.match(/^([TF])[A-Z]*/, 1);

		return match && new Bool(match === 'T');
	}

	/**
	 * Provides a debugging representation of this class.
	 *
	 * @override
	 * @return {string}
	 */
	dump() {
		return `Boolean(${this})`;
	}

	/**
	 * Compares `this` to `rhs`.
	 * 
	 * This returns a positive number if `this` is true and `rhs` if falsey,
	 * a negative number if `this` is false and `rhs` is truthy, and zero otherwise.
	 * 
	 * @override
	 * @param {Value}
	 * @return {number} 
	 */
	cmp(rhs) {
		return this._data - rhs.toBoolean()._data;
	}

	toList() {
		return this._data ? [this] : [];
	}
}

// Add the `Bool` class to the list of known types, so it can be parsed.
TYPES.push(Bool);
