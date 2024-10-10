export default class View {
	// #parentElement = document.querySelector("body");
	#parentElement;
	constructor() {
		this.eventListenerFolder = new Map();
	}

	renderComponent([markup, localParent]) {
		if (!markup || !localParent) console.warn(`renderComponentGeneric Error ${localParent}`);
		this.clearRender(document.querySelector(localParent));

		document.querySelector(localParent).insertAdjacentHTML("afterbegin", markup);
	}
	updateText = (target, value) => {
		document.querySelector(`.${target}`).textContent = `${value}`;
	};
	clearRender = (parentElement) => (parentElement.innerHTML = "");

	// eventListenerReturnDataSet = ([
	//   localParent,
	//   eventTarget,
	//   actionType,
	//   callback,
	// ]) =>
	//   document
	//     .querySelector(localParent)
	//     .addEventListener(actionType, function (e) {
	//       const btn = e.target.closest(eventTarget);
	//       if (!btn) return;
	//       callback(btn);
	//     });

	addEventListenerReturnDataSet([localParent, eventTarget, actionType, callback]) {
		const localParentQuery = document.querySelector(localParent);

		const wrappedCallback = (e) => {
			const btn = e.target.closest(eventTarget);
			// Prevent bubbling
			e.stopPropagation();
			if (!btn) return;
			callback(btn);
		};

		localParentQuery.addEventListener(actionType, wrappedCallback);

		// Store the listener details for later removal
		this.eventListenerFolder.set(callback, {
			localParentQuery,
			actionType,
			wrappedCallback,
		});
	}

	removeEventListener(callback) {
		const listenerDetails = this.eventListenerFolder.get(callback);
		if (listenerDetails) {
			const { localParentQuery, actionType, wrappedCallback } = listenerDetails;
			localParentQuery.removeEventListener(actionType, wrappedCallback);
			this.eventListenerFolder.delete(callback);
		}
	}
}
//////////////////////////
// const createEventListener = ([localParent, eventTarget, actionType, callback]) => {
//   const listenerFunction = function (e) {
//     const btn = e.target.closest(eventTarget);
//     if (!btn) return;
//     callback(btn);
//   };

//   document.querySelector(localParent).addEventListener(actionType, listenerFunction);

//   return listenerFunction;
// };
// function removeCustomEventListener(localParent, actionType, eventListenerReturnDataSet) {
//   const parentElement = document.querySelector(localParent);
//   if (parentElement) {
//     parentElement.removeEventListener(actionType, eventListenerReturnDataSet);
//   }
// }

// // Usage:
// const myListener = createEventListener(['.parent-selector', '.button-selector', 'click', myCallback]);

// // To remove:
// removeCustomEventListener('.parent-selector', 'click', myListener);

//   removeEventListenerReturnDataSet([
//     localParent,
//     eventTarget,
//     actionType,
//     callback,
//   ]) {
//     if (eventTarget) {
//       document
//         .querySelector(eventTarget)
//         .removeEventListener(actionType, callback);
//     }
//   }

// click // button // Do something // run once?
// addGlobalEventListeners(type, selector, callback, options) {
//   document.addEventListener(
//     type,
//     (event) => {
//       if (event.target.matches(selector)) callback(event);
//       console.log(`Button was Clicked ${selector}`);
//     },
//     options
//   );
// }

// addEventListenerGeneric(parent, type, selector, callback, options) {
//   parent.addEventListener(
//     type,
//     (event) => {
//       if (event.target.matches(selector)) callback(event);
//       console.log(`Button was Clicked ${selector}`);
//     },
//     options
//   );
// }
//! Rework

// bindSearchDataSubmit(callback) {
//   this.addEventListenerGeneric(
//     this.#parentElement,
//     "click",
//     ".search-form__button",
//     callback
//   );

// genericAddEventListener = (parent, target, callback) => {
//       // Store the handler function in a class property
//       this.addPopUpFilterEventHandler = (e) => {
//         const buttonClass = "hullmod-menu__header__button";
//         const buttonClassActive = "hullmod-menu__header__button--active";
//         const btn = e.target.closest(`.${buttonClass}`);
//         if (!btn) return;
//         // Remove active class from all buttons
//         document
//           .querySelectorAll(`.${buttonClass}`)
//           .forEach((button) => button.classList.remove(`${buttonClassActive}`));
//         // Add active class to the clicked button
//         btn.classList.add(`${buttonClassActive}`);
//         const { filterTag } = btn.dataset;
//         // Call the provided function with the filter tag
//         this.#currentSelectedFilter = filterTag;
//         callback(filterTag);
//       };
//       // Add the event listener to the container
//       document
//         .querySelector(".hullmod-menu__header__buttons--wrapper")
//         .addEventListener("click", this.addPopUpFilterEventHandler);
// };
