//? It is overkill, but I wanted to try using class inheritence

// ClassName means javascript Class
// selector is DOM class, which I look for with querySelector
class BaseError {
	constructor(options) {
		this.#errorFactory(options);
	}
	/* callback */
	#errorFactory({ message, name }) {
		const error = new Error(message);
		error.name = name;

		//? Keep this, actually shows where the error is. (Otherwise, it will lead into this factory instead of a class)
		if (Error.captureStackTrace) {
			Error.captureStackTrace(error, this.constructor);
		}
		/* callback */
		throw error;
	}
}

class MissingInput extends BaseError {
	constructor(message) {
		const name = "Input is Missing";
		super({
			name,
			message,
		});
	}
}
export class MissingInputSelectorClassError extends MissingInput {
	constructor() {
		const message = `Selector Class (DOM target class)`;
		super(message);
	}
}
export class MissingInputMethodError extends MissingInput {
	constructor() {
		const message = `Method or a callback function is missing or underfined`;
		super(message);
	}
}

// Place holder for now
export class MissingInputSelectorError extends MissingInput {
	constructor() {
		const message = `Selector Element is missing or undefined`;
		const selector = "";
		super(message);
	}
}
