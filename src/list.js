import Value from './value.js';
import Literal from './literal.js';
import Str from './str.js';
import { RuntimeError } from './error.js';

/**
 * @typedef {import('./stream.js').Stream}
 */

/**
 * The list type within Knight.
 *
 * @see Value - For more information on why we don't simply use `Array`s.
 * @extends {Literal<Array<Value>>}
 */
export default class List extends Literal {
	/**
	 * Attempts to parse an empty List from the `stream`.
	 *
	 * @param {Stream} stream The stream from which to parse.
	 * @return {List?} The parsed `List`, or `null` if the stream did not start with `@`.
	 */
	static parse(stream) {
		return stream.match(/^@/) && new List([]);
	}

	/**
	 * Provides a debugging representation of this list.
	 *
	 * @return {string}
	 */
	dump() {
		this.toNumber()
		return `[${this._data.map(val => val.dump()).join(', ')}]`
	}

	/**
	 * Returns the length of the List.
	 * 
	 * @returns {number}
	 */
	toNumber () {
		return this._data.length;
	}

	/**
	 * Returns whether the list is nonempty.
	 * 
	 * @returns {boolean}
	 */
	toBoolean () {
		return this._data.length !== 0;
	}

	/**
	 * Returns the internal array.
	 * 
	 * @returns {Array<Value>}
	 */
	toArray () {
		return this._data;
	}

	/**
	 * Joins each element of the internal array with a newline.
	 * 
	 * @returns {string}
	 */
	toString () {
		return this._data.join('\n');
	}

	/**
	 * Returns a new List of `this` concatenated with rhs.
	 * 
	 * @param {Value} rhs The second array; conveted to an array.
	 * @returns {List} The concatenation of the two
	 */
	add(rhs) {
		return new List(this._data.concat(rhs.toArray()));
	}

	/**
	 * Returns a new List of `this` repeated `rhs` times.
	 * 
	 * @param {Value} rhs The repetition count; conveted to an integer.
	 * @returns {List} The repeated list.
	 */
	mul(rhs) {
		var acc = [];
		var num = rhs.toNumber();

		while (num--) {
			acc = acc.concat(this._data);
		}

		return new List(acc);
	}

	/**
	 * Returns whether `this` joined by `rhs`.
	 * 
	 * @param {Value} rhs The separator; converted to a string.
	 * @returns {Str} `this` joined by `rhs`.
	 */
	pow(rhs) {
		return new Str(this._data.join(rhs.toString()));
	}

	/**
	 * Returns the sublist `[start .. start + length)` of `this`.
	 * 
	 * If the range is out of bounds, an empty list is used.
	 * 
	 * @param {Value} start The start index; converted to an integer.
	 * @param {Value} length The amount of elements; converted to an integer.
	 * @returns {List} The sublist.
	 */
	get(start, length) {
		start = start.toNumber();
		length = length.toNumber();
		return new List(this._data.slice(start, start + length) || []);
	}

	/**
	 * Returns a new list where the sublist `[start .. start + length)` of `this` is replaced
	 * with `repl`.
	 * 
	 * This doesn't modify `this`.
	 * 
	 * @param {Value} start The start index; converted to an integer.
	 * @param {Value} length The amount of elements; converted to an integer.
	 * @param {Value} repl The replacement; converted to a list.
	 * @returns {List} `this` with the replacement performed.
	 */
	set(start, length, repl) {
		return new List(this._data.toSpliced(start.toNumber(), length.toNumber(), ...repl.toArray()));
	}

	/**
	 * Returns whether `this` is equal to `rhs`
	 * 
	 * @param {Value} rhs The value to compare against.
	 * @returns {boolean} Whether they're equal.
	 */
	eql(rhs) {
		// If `rhs` isn't a list, or doesn't have the same length, they're not equal.
		if (!(rhs instanceof List) || this._data.length !== rhs._data.length) {
			return false;
		}

		// Ensure each element is equal.
		for (var i = 0; i < this._data.length; ++i) {
			if (!this._data[i].eql(rhs._data[i])) {
				return false;
			}
		}

		// All elements are equal, they're equal.
		return true;
	}

	/**
	 * Returns a negative, zero, or positive number based on whether `rhs` is larger
	 * than, equal to, or smaller than `this` based on the rules in the Knight spec.
	 *
	 * @param {Value} rhs The value against which to compare; converted to an array.
	 * @return {int} a negative, zero, or positive integer.
	 */
	cmp(rhs) {
		rhs = rhs.toArray();

		for (var i = 0; i < Math.min(this._data.length, rhs.length); ++i) {
			const res = this._data[i].cmp(rhs[i]);
			if (res !== 0) {
				return res;
			}
		}

		return this._data.length - rhs.length;
	}

	/**
	 * Gets the first element of the list.
	 * 
	 * @returns {Value} The first element
	 * @throws {RuntimeError} When the list is empty.
	 */
	head () {
		if (this._data.length === 0) {
			throw new RuntimeError("head on empty list");
		}

		return this._data[0];
	}

	/**
	 * Gets everything but the first element of the list.
	 * 
	 * @returns {List} A list containing everything but the first element.
	 * @throws {RuntimeError} When the list is empty.
	 */
	tail () {
		if (this._data.length === 0) {
			throw new RuntimeError("tail on empty list");
		}

		return new List(this._data.slice(1));
	}
}

// Add the `List` class to the list of known types, so it can be parsed.
Value.TYPES.push(List);
