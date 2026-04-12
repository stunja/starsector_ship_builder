export class EventManager {
	constructor(localParent) {
		this._targetMap = new Map();
		this._localParentElement = localParent;
	}
	addMouseClickHandler(targetClass, callbackFunction) {
		// Create the event listener function
		const listener = function (e) {
			const btn = e.target.closest(`.${targetClass}`);
			if (!btn) return;

			e.preventDefault();

			callbackFunction(btn);
		};

		// If there's an existing listener for this target, remove it first
		this.#removeMouseClickHandler(targetClass);

		// Store the new listener in the Map
		this._targetMap.set(targetClass, listener);

		// Add the event listener
		this._localParentElement.addEventListener("click", listener);

		// Return the listener for potential external reference
		return listener;
	}
	#removeMouseClickHandler(targetClass) {
		// Get the existing listener if any
		const existingListener = this._targetMap.get(targetClass);

		if (existingListener) {
			// Remove the event listener
			this._localParentElement.removeEventListener("click", existingListener);
			// Remove from Map
			this._targetMap.delete(targetClass);
			return true;
		}

		return false;
	}

	closePopUpContainerIfUserClickOutside(targetClass, callback) {
		if (typeof callback !== "function") return () => {};

		const targetContainer = document.querySelector(`.${targetClass}`);
		if (!targetContainer) {
			console.warn(`Target .${targetClass} not found`);
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
