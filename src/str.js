import { TYPES } from './value.js';
import Int from './int.js';
import Literal from './literal.js';
import { ParseError } from './error.js';

/**
 * @typedef {import('./stream.js')} Stream
 * @typedef {import('./value.js')} Value
 */

/**
 * The string type within Knight, used to represent textual data.
 *
 * @see Value For more information on why we don't simply use `string`s.
 * @extends {Literal<string>}
 */
export default class Str extends Literal {
	/**
	 * Attempts to parse a `Str` from the `stream`.
	 *
	 * @param {Stream} stream The stream from which to parse.
	 * @return {Str?} The parsed `Str`, or `null` if the stream did not start with a `'` or `"`.
	 * @throws {ParseError} If a starting quote, but no ending quote, is parsed.
	 */
	static parse(stream) {
		// The modifier `/m` doesn't work in this case, so `[\s\S]` is used to
		// match _all_ characters, including `\n` and `\r\n`.
		const match = stream.match(/^(["'])([\s\S]*?)\1/, 2);

		if (match === null) {
			// if we have a starting quote, it means the ending one didn't match.
			const first = stream.peek();
			if (first === "'" || first === '"') {
				throw new ParseError(`Unterminated quote encountered: ${stream}`);
			}

			return null;
		}

		return new Str(match);
	}

	/**
	 * Converts the string to a number, as per the Knight spec.
	 *
	 * This does effectively what `parseInt` does, except it returns `0` instead of `NaN`.
	 *
	 * @return {number} The numeric representation of this class.
	 */
	toNumber() {
		return parseInt(this._data, 10) || 0;
	}

	/**
	 * Converts the string to an array, by converting each character to a `Str`.
	 *
	 * @return {Array<Str>} An array of all characters in the string.
	 */
	toArray() {
		return this._data.split('').map(chr => new Str(chr));
	}

	/**
	 * Provides a debugging representation of this class.
	 *
	 * @return {string}
	 */
	dump() {
		return JSON.stringify(this._data);
	}

	/**
	 * Returns a new `Str` with `this` concatenated with `rhs`.
	 *
	 * @param {Value} rhs The value to append.
	 * @return {Str} The concatenation of `this` and `rhs`.
	 */
	add(rhs) {
		return new Str(`${this}${rhs}`);
	}

	/**
	 * Returns a new `Str` with `this` repeated `rhs` times.
	 *
	 * @param {Value} rhs The amount of times that `this` will be repeated.
	 * @return {Str} `This` repeated `rhs` times.
	 */
	mul(rhs) {
		return new Str(this._data.repeat(rhs.toNumber()));
	}

	/**
	 * Returns a negative, zero, or positive number based on whether `rhs` is lexicographically
	 * larger than, equal to, or smaller than `this`.
	 *
	 * @param {Value} rhs The value against which to compare; converted to a string.
	 * @return {int} a negative, zero, or positive integer.
	 */
	cmp(rhs) {
		rhs = rhs.toString();
		return this._data < rhs ?  -1 : this._data > rhs ? 1 : 0;
	}

	/**
	 * Gets the first charcater of the string.
	 *
	 * @returns {Str} The first character.
	 * @throws {RuntimeError} When the string is empty.
	 */
	head() {
		if (this._data.length === 0) {
			throw new RuntimeError("head on empty string");
		}

		return new Str(this._data[0]);
	}

	/**
	 * Gets everything but the first character in the string.
	 *
	 * @returns {Str} A string containing everything but the first character.
	 * @throws {RuntimeError} When the character is empty.
	 */
	tail() {
		if (this._data.length === 0) {
			throw new RuntimeError("tail on empty string");
		}

		return new Str(this._data.substr(1));
	}

	/**
	 * Returns the substring `[start .. start + length)` of `this`.
	 *
	 * If the range is out of bounds, an empty string is used.
	 *
	 * @param {Value} start The start index; converted to an integer.
	 * @param {Value} length The amount of elements; converted to an integer.
	 * @returns {Str} The substring.
	 */
	get(start, length) {
		start = start.toNumber();
		length = length.toNumber();
		return new Str(this._data.substring(start, start + length) || "");
	}

	/**
	 * Returns a new string where the substring `[start .. start + length)` of `this` is replaced
	 * with `repl`.
	 *
	 * This doesn't modify `this`.
	 *
	 * @param {Value} start The start index; converted to an integer.
	 * @param {Value} length The amount of elements; converted to an integer.
	 * @param {Value} repl The replacement; converted to a list.
	 * @returns {Str} `this` with the replacement performed.
	 */
	set(start, length, repl) {
		start = start.toNumber();
		length = length.toNumber();
		repl = repl.toString();

		if (this._data.length == start) {
			return new Str(this._data + repl);
		}

		return new Str(this._data.substring(0, start) + repl + this._data.substring(start + length));
	}

	/**
	 * Returns the first codepoint in this string.
	 *
	 * @returns {Int}
	 */
	ascii() {
		return new Int(this._data.charCodeAt(0));
	}
}

// Add the `Str` class to the list of known types, so it can be parsed.
TYPES.push(Str);
