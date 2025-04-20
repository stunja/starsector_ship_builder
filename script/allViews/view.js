export default class View {
	constructor() {
		this._targetMap = new Map();
	}
	_data;
	_localParentElement;
	_localParent;

	_updateText = (target, value) => {
		document.querySelector(`.${target}`).textContent = `${value}`;
	};

	_clearRender = () => (this._localParentElement.textContent = "");
	render(data) {
		if (!data) return this.#renderError("no data");

		if (!this._localParent)
			console.warn("Issue with parent element", this._localParent);

		this._localParentElement = document.querySelector(this._localParent);

		this._data = data;
		const markup = this.generateMarkup();

		this._clearRender();
		this._localParentElement.insertAdjacentHTML("afterbegin", markup);
	}
	#renderError(reason) {
		// TO DO
		console.error("Render Error", reason);
	}
	createList(classes, title, str) {
		return `
		<li class="${classes}">
            <h5>${title}</h5>
            <p>${str}</p>
        </li>`;
	}

	addClickHandler(target, type, callback) {
		// Create the event listener function
		const listener = function (e) {
			const btn = e.target.closest(target);
			if (!btn) return;
			e.preventDefault();
			callback(btn);
		};

		// If there's an existing listener for this target, remove it first
		this.removeClickHandler(target, type);

		// Store the new listener in the Map
		this._targetMap.set(target, listener);

		// Add the event listener
		this._localParentElement.addEventListener(type, listener);

		// Return the listener for potential external reference
		return listener;
	}

	removeClickHandler(target, type) {
		// Get the existing listener if any
		const existingListener = this._targetMap.get(target);

		if (existingListener) {
			// Remove the event listener
			this._localParentElement.removeEventListener(type, existingListener);
			// Remove from Map
			this._targetMap.delete(target);
			return true;
		}

		return false;
	}
	// Utility method to check if a target has an active listener
	hasListener(target) {
		return this._targetMap.has(target);
	}
	// Event Listener for Closing Container if User click outside of it { Once }
	closePopUpContainerIfUserClickOutside(targetClass, callback) {
		const targetContainer = document.querySelector(targetClass);

		const handleOutsideClick = (event) => {
			const userClickedOutsideOfContainer = !targetContainer.contains(
				event.target
			);

			if (userClickedOutsideOfContainer) {
				callback();
			}
		};

		// Conflict between Weapon EL and close form EL.
		// Defer the event listener to next tick to avoid immediate triggering
		requestAnimationFrame(() => {
			document.addEventListener("click", handleOutsideClick, { once: true });
		});
	}
}
