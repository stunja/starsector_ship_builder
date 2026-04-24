import EventManager from "../eventHandlers/EventManager";
import { UI_ERRORS } from "../helper/Errors";
///
export default class NewView {
	// I need ParentElement, as a parent of current element So i can target Lower than Document
	#localParentElement; // DOM Element based on class
	#eventManager;
	#model;
	#mounted = false;

	static LOCAL_PARENT = null;
	//
	constructor({ model = {}, callbacks = {} } = {}) {
		this.#model = model;
		this._callbacks = callbacks;

		this.#localParentElement = this.#resolveElement(
			document,
			this.constructor.LOCAL_PARENT,
		);
	}

	// View Factory
	static async createDefaultInstance(args) {
		const instance = new this(args);
		await instance.render();
		instance.listen();
		return instance;
	}

	async render() {
		// wait for markup
		const markup = await this._generateMarkup();
		// check if it exists and is a string
		this.#validateMarkup(markup);
		// clear render
		this.#localParentElement.textContent = "";
		// add new content
		this.#localParentElement.insertAdjacentHTML("afterbegin", markup);
		// add event listeners
		this.#eventManager = new EventManager(this.#localParentElement);

		this.#mounted = true;
	}
	listen() {
		if (!this.#mounted)
			throw new Error(
				UI_ERRORS.LISTEN.LISTEN_BEFORE_RENDER(this.constructor.name),
			);

		this.#eventManager = new EventManager(this.#localParentElement);
		this._setupEventListeners();

		return this;
	}
	// Prebuild, check if exists
	_generateMarkup() {
		this.#throwMissingMethodError(this._setupEventListeners);
	}
	_setupEventListeners() {
		this.#throwMissingMethodError(this._setupEventListeners);
	}
	// Prebuild Checker
	#throwMissingMethodError(methodReference) {
		throw new Error(
			UI_ERRORS.NOT_IMPLEMENTED.METHOD(
				this.constructor.name,
				methodReference.name,
			),
		);
	}
	#resolveElement(parent, className) {
		if (!className)
			throw new Error(
				UI_ERRORS.MISSING.CLASS(this.constructor.name, className),
			);

		const targetElement = parent.querySelector(`.${className}`);

		if (!targetElement)
			throw new Error(
				UI_ERRORS.MISSING.ELEMENT(this.constructor.name, targetElement),
			);

		return targetElement;
	}
	//
	#validateMarkup(markup) {
		if (!markup || typeof markup !== "string")
			throw new Error(UI_ERRORS.ISSUE.MARKUP(this.constructor.name));
	}

	//? Getters
	get model() {
		return this.#model;
	}

	_getElement(targetClass) {
		return this.#resolveElement(this.#localParentElement, targetClass);
	}

	// Event Listeners
	_onClick(targetClass, callback) {
		this.#eventManager.addMouseClickHandler(targetClass, callback);
	}

	//? Event Listener

	// _inputCapture(targetClass, callbackFunction) {
	// 	const input = this.#getAndValidateDomElement({
	// 		parent: this.#localParentElement,
	// 		element: targetClass,
	// 	});

	// 	input.addEventListener("input", (e) => {
	// 		const query = e.target.value.trim().toLowerCase();
	// 		callbackFunction(query);
	// 	});
	// }
}
