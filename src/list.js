import Value from './value.js';
import Literal from './literal.js';
import { RuntimeError } from './error.js';
import Str from './str.js';

/**
 * @typedef {import('./stream.js').Stream} Stream
 * @typedef {import('./value.js').Value} Value
 */

export default class List extends Literal {
	/**
	 * Attempts to parse an `Int` from the `stream`.
	 *
	 * @param {Stream} stream The stream from which to parse.
	 * @return {Int|null} The parsed `Int`, or `null` if the stream did not
	 *                      start with a `Int`.
	 */
	static parse(stream) {
		return stream.match(/^@/) && new List([]);
	}

	/**
	 * Provides a debugging representation of this class.
	 *
	 * @return {string}
	 */
	dump() {
		return `[${this._data.map(val => val.dump()).join(', ')}]`
	}

	toNumber () {
		return this._data.length;
	}

	toBoolean () {
		return this._data.length !== 0;
	}

	toArray () {
		return this._data;
	}

	toString () {
		return this._data.join('\n');
	}

	head () {
		if (this._data.length === 0) {
			throw new RuntimeError("head on empty list");
		}

		return this._data[0];
	}

	tail () {
		if (this._data.length === 0) {
			throw new RuntimeError("tail on empty list");
		}


		return new List(this._data.slice(1));
	}

	add(rhs) {
		return new List(this._data.concat(rhs.toArray()));
	}

	mul(rhs) {
		var acc = [];
		var num = rhs.toNumber();

		while (num--) {
			acc = acc.concat(this._data);
		}

		return new List(acc);
	}

	get(start, length) {
		start = start.toNumber();
		length = length.toNumber();
		return new List(this._data.slice(start, start + length) || []);
	}

	set(start, length, repl) {
		return new List(this._data.toSpliced(start.toNumber(), length.toNumber(), ...repl.toArray()));
	}

	eql(rhs) {
		if (!(rhs instanceof List) || this._data.length !== rhs._data.length) {
			return false;
		}

		for (var i = 0; i < this._data.length; ++i) {
			if (!this._data[i].eql(rhs._data[i])) {
				return false;
			}
		}

		return true;
	}

	pow(rhs) {
		return new Str(this._data.join(rhs.toString()));
	}

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

}

// Add the `List` class to the list of known types, so it can be parsed.
Value.TYPES.push(List);
