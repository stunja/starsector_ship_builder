export default class View {
  // #parentElement = document.querySelector("body");
  #parentElement;

  clearRender = (parentElement) => (parentElement.innerHTML = "");
}

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
