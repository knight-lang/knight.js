import { TYPES } from './value.js';
import Literal from './literal.js';
import Str from './str.js';
import { RuntimeError } from './error.js';

/**
 * @typedef {import('./stream.js')} Stream
 */

/**
 * The number type within Knight.
 *
 * As per the Knight specs, the only number type allowed are integers.
 *
 * @see Value - For more information on why we don't simply use `number`s.
 * @extends {Literal<number>}
 */
export default class Int extends Literal {
	/**
	 * Attempts to parse an `Int` from the `stream`.
	 *
	 * @param {Stream} stream The stream from which to parse.
	 * @return {Int?} The parsed `Int`, or `null` if the stream did not start with a digit.
	 */
	static parse(stream) {
		const match = stream.match(/^\d+/);

		return match && new Int(Number(match));
	}

	/**
	 * Returns the int converted to a string.
	 *
	 * @return {string}
	 */
	dump() {
		return this.toString();
	}

	/**
	 * Returns the list of digits in the int.
	 * 
	 * This handles negative integers by multiplying each digit by `-1`.
	 *
	 * @returns {Array<Int>}
	 */
	toArray() {
		if (this._data === 0) {
			return [this];
		}

		var acc = [];
		var num = Math.abs(this._data);
		while (num !== 0 && num !== -1) {
			acc = acc.concat([new Int(Math.sign(this._data) * (num % 10))]);
			num = Math.floor(num / 10);
		}

		return acc.reverse();
	}

	/**
	 * Returns a new `Int` that is the result of adding `rhs` to `this`.
	 *
	 * @param {Value} rhs The value to add to `this`.
	 * @return {Int} The result of the addition.
	 */
	add(rhs) {
		return new Int(this._data + rhs.toNumber());
	}

	/**
	 * Returns a new `Int` that is the result of subtracting `rhs` from `this`.
	 *
	 * @param {Value} rhs The value to subtract from `this`.
	 * @return {Int} The result of the subtraction.
	 */
	sub(rhs) {
		return new Int(this._data - rhs.toNumber());
	}

	/**
	 * Returns a new `Int` that is the result of multiplying `this` by `rhs`.
	 *
	 * @param {Value} rhs The value to multiply from `this`.
	 * @return {Int} The result of the multiplication.
	 */
	mul(rhs) {
		return new Int(this._data * rhs.toNumber());
	}

	/**
	 * Returns a new `Int` that is the result of dividing `rhs` from `this`.
	 *
	 * Note that this will truncate the result of the division.
	 *
	 * @param {Value} rhs The value to divide from `this`.
	 * @return {Int} The result of the division.
	 * @throws {RuntimeError} - Thrown if `rhs` is zero.
	 */
	div(rhs) {
		const rhsInt = rhs.toNumber();

		if (!rhsInt) {
			throw new RuntimeError('Cannot divide by zero');
		} else {
			return new Int(Math.trunc(this._data / rhsInt));
		}
	}

	/**
	 * Returns a new `Int` that is the result of moduloing `this` by `this`.
	 *
	 * @param {Value} rhs The base of the modulation.
	 * @return {Int} The result of the modulo operation.
	 * @throws {RuntimeError} - Thrown if `rhs` is zero.
	 */
	mod(rhs) {
		const rhsInt = rhs.toNumber();

		if (!rhsInt) {
			throw new RuntimeError('Cannot modulo by zero');
		} else {
			return new Int(this._data % rhsInt);
		}
	}

	/**
	 * Returns a new `Int` that is the result of raising `this` to the `rhs`th
	 * power.
	 *
	 * Note that this will truncate the result of the exponentiation.
	 *
	 * @param {Value} rhs The exponent
	 * @return {Int} The result of the exponentiation.
	 */
	pow(rhs) {
		const rhsInt = rhs.toNumber();

		if (!this._data && rhsInt < 0) {
			throw new RuntimeError('Cannot exponentiate zero to a negative power');
		} else {
			return new Int(Math.trunc(this._data ** rhsInt));
		}
	}

	/**
	 * Returns a negative, zero, or positive number based on whether `rhs` is numerically larger
	 * than, equal to, or smaller than `this`.
	 *
	 * @param {Value} rhs The value against which to compare.
	 * @return {int} a negative, zero, or positive integer.
	 */
	cmp(rhs) {
		return this._data - rhs.toNumber();
	}

	/**
	 * Interprets `this` as a codepoint and returns a `Str` containing it.
	 * 
	 * @returns {Str}
	 */
	ascii () {
		return new Str(String.fromCharCode(this._data));
	}
}

// Add the `Int` class to the list of known types, so it can be parsed.
TYPES.push(Int);
