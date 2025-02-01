import classNames from "../../helper/DomClassNames.js";
import DataSet from "../../helper/DataSet.js";
// View
import View from "../view.js";

class HullModsPopUpFilterView extends View {
	_localParent = `.${classNames.tableFilter}`;

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
			? `class="${classNames.hullModsFilterActive}"`
			: "";

	#allButtonsMarkup = () =>
		this.#filterCategories
			.map((category) => this.#singleFilterButton(category))
			.join("");

	#singleFilterButton = (category) => {
		const dataSetId = `${DataSet.dataFilter}="${category}"`;
		return `<li ${this.#activeClass(category)}>
					<button class="${classNames.button} ${classNames.filterButton}" ${dataSetId}>
						${category}
					</button>
				</li>`;
	};
	#filterView() {
		const markup = `
			<div class="${classNames.filterButtons}">
				${this.#allButtonsMarkup()}
			</div>
			`;
		return markup;
	}
}
export default new HullModsPopUpFilterView();
