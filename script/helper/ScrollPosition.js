const localStorageLabel = "scrollPosition";
const EVENT_LISTENER_TYPE = {
	SCROLL: "scroll",
	LOAD: "load",
};
class ScrollPosition {
	save(targetElementClass) {
		this.#findCorrectClass(targetElementClass).addEventListener(
			EVENT_LISTENER_TYPE.SCROLL,
			() => {
				const saveScrollPosition =
					this.#findCorrectClass(targetElementClass).scrollTop;

				localStorage.setItem(localStorageLabel, saveScrollPosition);
			}
		);
	}

	load(targetElementClass) {
		const loadScrollPosition = localStorage.getItem(localStorageLabel);
		this.#findCorrectClass(targetElementClass).scroll({
			top: loadScrollPosition,
			behavior: "instant",
		});
	}
	clear(targetElementClass) {
		localStorage.removeItem(this.#findCorrectClass(targetElementClass));
	}
	#findCorrectClass(targetElementClass) {
		return document.querySelector(`.${targetElementClass}`);
	}
}

export default new ScrollPosition();
