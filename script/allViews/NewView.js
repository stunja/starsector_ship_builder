import EventManager from "../eventHandlers/EventManager";

import CLASS_NAMES from "../helper/ui/class_names";
import CONFIG from "../helper/ui/configs";
import { findAndResolveDomElement } from "../helper/helper_functions";
///
export default class NewView {
	// I need ParentElement, as a parent of current element So i can target Lower than Document
	#localParentElement; // DOM Element based on class
	#eventManager;
	#model;
	#mounted = false;

	static LOCAL_PARENT = null;
	//
	constructor({ model = {}, callbacks = {}, inputs = {} } = {}) {
		this.#model = model;
		this._callbacks = callbacks;
		this._inputs = inputs;

		this.#localParentElement = findAndResolveDomElement(
			this.constructor.name,
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
	// Private Helper
	// #resolveElement(parent, className) {
	// 	if (!className)
	// 		throw new Error(
	// 			UI_ERRORS.MISSING.CLASS(this.constructor.name, className),
	// 		);

	// 	const targetElement = parent.querySelector(`.${className}`);

	// 	if (!targetElement)
	// 		throw new Error(
	// 			UI_ERRORS.MISSING.ELEMENT(this.constructor.name, targetElement),
	// 		);

	// 	return targetElement;
	// }
	//
	//! replace error
	#validateMarkup(markup) {
		if (!markup || typeof markup !== "string")
			console.log(this.constructor.name, "replace me");
		// throw new Error(UI_ERRORS.ISSUE.MARKUP(this.constructor.name));
	}

	//? Getters
	get model() {
		return this.#model;
	}

	_getElement(targetClass) {
		return findAndResolveDomElement(
			this.constructor.name,
			this.#localParentElement,
			targetClass,
		);
	}

	//? Event Listeners
	_onClick(selectorClass, callback) {
		this.#eventManager.addMouseClickHandler({
			selectorClass,
			callback,
		});
	}
	_onClose(selectorClass, callback) {
		this.#eventManager.clickOutsideParent({
			selectorClass,
			callback,
		});
	}
	// function to destroy and delete eventListeners
	destroy() {
		this.#eventManager.destroy();
		// remove eventListeners
		this.#localParentElement.textContent = "";
		// unmount
		this.#mounted = false;
		return this;
	}

	//? Animation
	//! rework a bit
	async fadeOutAnimation() {
		this.#localParentElement.classList.add(CLASS_NAMES.ANIM.FADE_OUT);

		return new Promise((resolve) =>
			setTimeout(() => {
				this.#localParentElement.classList.remove(CLASS_NAMES.ANIM.FADE_OUT);
				resolve();
			}, CONFIG.ANIM.FADEOUT_MS),
		);
	}
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
