// import classNames from "../helper/DomClassNames.js";
//
const handlerMap = new WeakMap();

export default class View {
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
	// test

	addEventHandler(
		parentElement,
		targetElement,
		eventType,
		handler,
		options = false
	) {
		// Clean up any existing handler for this event type
		this.removeEventHandler(parentElement, eventType);

		// Create delegated event handler
		const wrappedHandler = (event) => {
			// Find closest matching parentElement from event target
			const target = event.target.closest(targetElement);
			event.stopPropagation();
			// Only execute if target found and is descendant of container
			if (target && parentElement.contains(target)) {
				return handler.call(target, event);
			}
		};
		//! Old code, I need to rework it
		//	// 	const wrappedCallback = (e) => {
		// 		const btn = e.target.closest(eventTarget);
		// 		// Prevent bubbling
		// 		e.stopPropagation();
		// 		if (!btn) return;
		// 		callback(btn);
		// 	};

		// Attach the event listener
		parentElement.addEventListener(eventType, wrappedHandler, options);

		// Store handler reference for later cleanup
		if (!handlerMap.has(parentElement)) {
			handlerMap.set(parentElement, new Map());
		}
		handlerMap.get(parentElement).set(eventType, { wrappedHandler, options });

		return wrappedHandler;
	}

	removeEventHandler(parentElement, eventType) {
		if (!handlerMap.has(parentElement)) return;

		const parentElementHandlers = handlerMap.get(parentElement);
		const existingHandler = parentElementHandlers.get(eventType);

		if (existingHandler) {
			// Remove the actual event listener
			const { wrappedHandler, options } = existingHandler;
			parentElement.removeEventListener(eventType, wrappedHandler, options);
			// Clean up stored reference
			parentElementHandlers.delete(eventType);

			// Remove parentElement from WeakMap if no more handlers exist
			if (parentElementHandlers.size === 0) {
				handlerMap.delete(parentElement);
			}
		}
	}
}
// weaponPopUpFormRemover(currentWeaponSlot) {
// 	const weaponTypeCheck =
// 		currentWeaponSlot.type === "LAUNCH_BAY" ? "fighter" : "weapon";

// 	const targetClass =
// 		weaponTypeCheck === "weapon"
// 			? classNames.weaponPopUp
// 			: classNames.fighterPopUp;
