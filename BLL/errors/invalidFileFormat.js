module.exports = function InvalidFileFormat(message, extra) {
	Error.captureStatackTrace && Error.captureStatackTrace(this, this.constructor);
	this.name = this.constructor.name;
	this.message = message;
	this.extra = extra;
};

require('util').inherits(module.exports, Error);