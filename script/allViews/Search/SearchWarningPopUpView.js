import View from "../view";
//
class SearchWarningPopUpView extends View {
	_localParent = "body";
	generateMarkup() {
		const markup = `<div class="search-warning">TEST</div>`;
		return markup;
	}
}
export default new SearchWarningPopUpView();
