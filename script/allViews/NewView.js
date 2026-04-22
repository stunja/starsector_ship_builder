// I want to rewrite renderer
const ERROR_MSG = {
	LOCAL_PARENT: "Local Parent Element is not found",
};
export default class NewView {
	#localParentElement; // DOM Element based on class
	_localParent; // DOM class
	#data; // imported Data

	//
	constructor(data) {
		this.#data = data;
	}
	//
	init() {
		this.#findLocalParentElement();

		this.#clearRender();
		this.#renderAsync();
	}
	async #renderAsync() {
		if (!this.#localParentElement)
			console.warn(ERROR_MSG.LOCAL_PARENT, this.#localParentElement);

		const markup = await this.generateMarkup();
		this.#localParentElement.insertAdjacentHTML("afterbegin", markup);
	}

	// Helper
	#findLocalParentElement = () =>
		(this.#localParentElement = document.querySelector(
			`.${this._localParent}`,
		));

	#updateText = (target, value) =>
		(document.querySelector(`.${target}`).textContent = `${value}`);

	#clearRender = () => (this.#localParentElement.textContent = "");

	#clearTargetValue = (target) =>
		(this.#localParentElement.querySelector(target).value = "");
}
