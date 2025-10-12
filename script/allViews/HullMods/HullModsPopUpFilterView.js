import CLASS_NAMES from "../../helper/ui/class_names.js";
import DATASET from "../../helper/ui/datasets.js";
// View
import View from "../view.js";

class HullModsPopUpFilterView extends View {
	_localParent = `.${CLASS_NAMES.tableFilter}`;

	#filterCategories;
	#currentFilter;

	generateMarkup() {
		this.#processData(this._data);

		const markup = this.#filterView();
		return markup;
	}
	#processData(data) {
		const [categories, currentFilter] = data;

		this.#filterCategories = categories;
		this.#currentFilter = currentFilter;
	}

	#activeClass = (category) =>
		category === this.#currentFilter
			? `class="${CLASS_NAMES.hullModsFilterActive}"`
			: "";

	#allButtonsMarkup = () =>
		this.#filterCategories
			.map((category) => this.#singleFilterButton(category))
			.join("");

	#singleFilterButton = (category) => {
		const DATASETId = `${DATASET.dataFilter}="${category}"`;
		return `<li ${this.#activeClass(category)}>
					<button class="${CLASS_NAMES.button} ${CLASS_NAMES.filterButton}" ${DATASETId}>
						${category}
					</button>
				</li>`;
	};
	#filterView() {
		const markup = `
			<div class="${CLASS_NAMES.filterButtons}">
				${this.#allButtonsMarkup()}
			</div>
			`;
		return markup;
	}
}
export default new HullModsPopUpFilterView();
