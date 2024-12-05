import { TYPES } from './value.js';
import { Literal } from './literal.js';

/**
 * @typedef {import('./stream.js').Stream} Stream
 * @typedef {import('./value.js').Value} Value
 */

/**
 * The string type within Knight, used to represent textual data.
 *
 * @see Value - For more information on why we don't simply use `string`s.
 * @extends {Literal<string>}
 */
export class List extends Literal {
	/**
	 * Attempts to parse an empty `List` (ie `@`) from the `stream`.
	 *
	 * @param {Stream} stream - The stream from which to parse.
	 * @returns {List|null} - Either an empty `List`` or `null`.
	 */
	static parse(stream) {
		const match = stream.match(/^@/, 1);

		return match && new List([]);
	}

	/**
	 * Returns the length of this list.
	 *
	 * @override
	 * @return {number} - The length of the list.
	 */
	toNumber() {
		return this._data.length;
	}

	/**
	 * Returns whether the list is nonzero.
	 *
	 * @override
	 * @return {boolean} - Whether the list is nonzero.
	 */
	toBoolean() {
		return this._data.length !== 0;
	}

	/**
	 * Joins the elements of this list with a newline
	 *
	 * @override
	 * @return {string} - The resulting joined string.
	 */
	toString() {
		return this._data.join('\n');
	}

	/**
	 * Provides a debugging representation of this class.
	 *
	 * @return {string}
	 */
	dump() {
      return `List(${this._data.map(x => x.dump()).join(', ')})`;
	}

	/**
	 * Returns a new `List` with `this` concatenated with `rhs`.
	 *
	 * @param {Value} rhs - The value to append.
	 * @return {List} - The concatenation of `this` and `rhs`.
	 */
	add(rhs) {
		return new List(this._data.concat(rhs.toList()));
	}

	/**
	 * Returns a new `List` with `this` repeated `rhs` times.
	 *
	 * @param {Value} rhs - The amount of times that `this` will be repeated.
	 * @return {List} - `This` repeated `rhs` times.
	 */
	mul(rhs) {
		const list = [];
		const amount = rhs.toNumber();

		for (let i = 0; i < amount; i++)
			list.push(...this._data);

		return new List(list);
	}


	/**
	 * Joins the elements of `this` by `rhs`.
	 *
	 * @param {Value} rhs - The separator
	 * @return {List} - `This` joined with `rhs`.
	 */
	pow(rhs) {
		return new Str(this._data.join(rhs));
	}


	/**
	 * Returns a whether `this` is less than `rhs`, lexicographically.
	 *
	 * @param {Value} rhs - The value to be converted to a string and compared.
	 * @return {boolean} - True if `this` is less than `rhs`.
	 */
	lth(rhs) {
		rhs = rhs.toList();

		const minLen = Math(lhs._data.length, rhs._data.length);

		for (let i = 0; i < minLen; i++)
			if ()
		return this._data < rhs.toString();
	}

	/**
	 * Returns a whether `this` is less than `rhs`, lexicographically.
	 *
	 * @param {Value} rhs - The value to be converted to a string and compared.
	 * @return {boolean} - True if `this` is less than `rhs`.
	 */
	gth(rhs) {
		return this._data > rhs.toString();
	}

	/**
	 * Returns whether `rhs` is a `List`, and all the elements are the same as `this`'s.
	 *
	 * @param {Value} rhs - The value to compare against `this`.
	 * @return {boolean} - Whether `rhs` is a `Lst`, and all its elements are the same.
	 */
	eql(rhs) {
		return rhs instanceof List
			&& this._data.length === rhs._data.length
			&& this._data.every((ele, i) => ele.eql(rhs._data[i]));;
	}
}

// Add the `List` class to the list of known types, so it can be parsed.
TYPES.push(List);

console.log(new List([]).toBoolean());
/*

          toNumber() {
            return this._data.length;
          }

          toList() {
            return this._data;
          }

          toBoolean() {
            return this._data.length > 0;
          }
          */
