import {
	MissingInputSelectorClassError,
	MissingInputMethodError,
} from "../helper/Error/ErrorHandler";

import { findAndResolveDomElement } from "../helper/helper_functions";

export default class EventManager {
	#targetMap = new Map();
	#localParentElement;
	//
	constructor(localParentElement) {
		this.#localParentElement = localParentElement;
	}

	/* 
	constructorName is to get a location of Error Throw
	callback is fn
	selectorClass class I use to target eventListener??
	*/
	addMouseClickHandler({ callback, selectorClass }) {
		if (!selectorClass) {
			new MissingInputSelectorClassError();
		}

		if (!callback) new MissingInputMethodError();
		// Create the event listener function
		const listener = function (e) {
			const btn = e.target.closest(`.${selectorClass}`);
			if (!btn) return;

			e.preventDefault();

			callback(btn);
		};

		// If there's an existing listener for this target, remove it first
		this.#removeMouseClickHandler(selectorClass);

		// Store the new listener in the Map
		this.#targetMap.set(selectorClass, listener);

		// Add the event listener
		this.#localParentElement.addEventListener("click", listener);

		// Return the listener for potential external reference
		return listener;
	}
	#removeMouseClickHandler(selectorClass) {
		// Get the existing listener if any
		const existingListener = this.#targetMap.get(selectorClass);

		if (existingListener) {
			// Remove the event listener
			this.#localParentElement.removeEventListener("click", existingListener);
			// Remove from Map
			this.#targetMap.delete(selectorClass);
			return true;
		}

		return false;
	}
	//? maybe overkill, but better to also manually remove all eventListeners
	destroy() {
		console.log(this.#targetMap);
		this.#targetMap.forEach((listener) => {
			this.#localParentElement.removeEventListener("click", listener);
		});

		this.#targetMap.clear();
		this.#localParentElement = null;
		console.log(this.#targetMap);
	}

	clickOutsideParent({
		constructorName: constructorName,
		selectorClass: selectorClass,
		callback: callback,
	}) {
		console.log(constructorName, selectorClass, callback);
		if (typeof callback !== "function") return () => {};

		// const targetContainer = document.querySelector(`.${selectorClass}`);

		const test = findAndResolveDomElement("test", document, selectorClass);
		console.log(test);
		const targetContainer = document.querySelector(`.${selectorClass}`);
		if (!targetContainer) {
			console.warn(`Target .${selectorClass} not found`);
			return () => {};
		}
		const controller = new AbortController();

		const handleOutsideClick = (event) => {
			if (targetContainer && !targetContainer.contains(event.target)) {
				callback();
				controller.abort(); // self-cleanup on success
			}
		};
		// Defer so the click that opened the popup doesn't immediately trigger close
		const timeoutId = setTimeout(() => {
			document.addEventListener("click", handleOutsideClick, {
				signal: controller.signal,
				capture: true,
			});
		}, 0);
		// Return cleanup so callers can cancel (e.g. via Escape key)
		return () => {
			clearTimeout(timeoutId);
			controller.abort();
		};
	}
}
