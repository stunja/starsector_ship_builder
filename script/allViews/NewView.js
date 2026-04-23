import EventManager from "../eventHandlers/EventManager";
import { UI_ERRORS } from "../helper/Errors";
///
export default class NewView {
	// I need ParentElement, as a parent of current element So i can target Lower than Document
	#localParentElement; // DOM Element based on class
	#eventManager;
	#model;

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

	// tiny view factory
	static async create(args) {
		const instance = new this(args);
		await instance.#mount();
		return instance;
	}

	async #mount() {
		// wait for markup
		const markup = await this.generateMarkup();
		// check if it exists and is a string
		this.#validateMarkup(markup);
		// clear render
		this.#localParentElement.textContent = "";
		// add new content
		this.#localParentElement.insertAdjacentHTML("afterbegin", markup);
		// add event listeners
		this.#eventManager = new EventManager(this.#localParentElement);
		this._setupEventListeners();
	}

	generateMarkup() {
		throw new Error("test");
	}

	// async init() {
	// 	await this.#renderAsync();

	// 	this.#eventManager = new EventManager(this.#localParentElement);
	// 	this._setupEventListeners();
	// }
	//
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
	//! remove
	// async #renderAsync() {
	// 	const markup = await this.generateMarkup();

	// 	if (!markup || !typeof markup !== "string")
	// 		throw new Error(UI_ERRORS.ISSUE.MARKUP(this.constructor.name));

	// 	this.#clearRender();
	// 	this.#localParentElement.insertAdjacentHTML("afterbegin", markup);
	// }

	//! remove
	// Helper
	// #clearRender() {
	// 	this.#localParentElement.textContent = "";
	// }

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

	//! Check if functions are generated in children
	// get _localParentElement() {
	// 	return this.#localParentElement;
	// }

	//? Event Listener
	// _mouseClick(targetClass, callbackFunction) {
	// 	this.#eventManager.addMouseClickHandler(targetClass, callbackFunction);
	// }
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
