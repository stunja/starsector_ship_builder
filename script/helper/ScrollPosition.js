export class ScrollPosition {
	constructor(prefix = "scrollPosition") {
		this.prefix = prefix;
		this.elements = new Map();
	}

	save(targetElementClass) {
		const element = this.#findCorrectClass(targetElementClass);
		if (!element) return false;

		// Store the element to avoid repeated DOM queries
		this.elements.set(targetElementClass, element);

		const storageKey = this.#getStorageKey(targetElementClass);

		element.addEventListener("scroll", () => {
			localStorage.setItem(storageKey, element.scrollTop);
		});

		return true;
	}

	load(targetElementClass) {
		const element =
			this.elements.get(targetElementClass) ||
			this.#findCorrectClass(targetElementClass);

		if (!element) return false;

		const storageKey = this.#getStorageKey(targetElementClass);
		const loadScrollPosition = localStorage.getItem(storageKey);

		if (loadScrollPosition !== null) {
			element.scroll({
				top: parseInt(loadScrollPosition, 10) || 0,
				behavior: "instant",
			});
			return true;
		}

		return false;
	}

	clear(targetElementClass) {
		const storageKey = this.#getStorageKey(targetElementClass);
		localStorage.removeItem(storageKey);
	}

	#getStorageKey(targetElementClass) {
		return `${this.prefix}_${targetElementClass}`;
	}

	#findCorrectClass(targetElementClass) {
		return document.querySelector(`.${targetElementClass}`);
	}
}
