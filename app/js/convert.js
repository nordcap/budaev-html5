
"use strict";

var _marked = [generatorSeq].map(regeneratorRuntime.mark);

function generatorSeq() {
	return regeneratorRuntime.wrap(function generatorSeq$(_context) {
		while (1) {
			switch (_context.prev = _context.next) {
				case 0:
					_context.next = 2;
					return 1;

				case 2:
					_context.next = 4;
					return 2;

				case 4:
					return _context.abrupt("return", 3);

				case 5:
				case "end":
					return _context.stop();
			}
		}
	}, _marked[0], this);
}

var gen = generatorSeq();
var _iteratorNormalCompletion = true;
var _didIteratorError = false;
var _iteratorError = undefined;

try {
	for (var _iterator = gen[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
		var value = _step.value;

		console.log(value);
	}
} catch (err) {
	_didIteratorError = true;
	_iteratorError = err;
} finally {
	try {
		if (!_iteratorNormalCompletion && _iterator.return) {
			_iterator.return();
		}
	} finally {
		if (_didIteratorError) {
			throw _iteratorError;
		}
	}
}