// View
import View from "../view";
// Helper
import CLASS_NAMES from "../../helper/ui/class_names";

class ShipInfoContainerView extends View {
	_localParent = `.${CLASS_NAMES.shipInfoContainer}`;

	generateMarkup() {
		const markup = this.#infoMarkup(this._data);

		return markup;
	}
	#infoMarkup(data) {
		const { _currentShip, userShipBuild } = data.userState;
		const { name, designation, techManufacturer } = _currentShip;
		const { hullSize } = userShipBuild;

		const hullSizeString = () => hullSize.toLowerCase().replace("_", " ");

		return `
				<div>
					<h5 class="${CLASS_NAMES.shipInfoTitle}">
						${name}
					</h5>
					<div class="${CLASS_NAMES.shipInfoDetails}">
						<p>${hullSizeString()}</p>
						<p>${designation}</p>
						<p>${techManufacturer}</p>
					</div>
				</div>`;
	}
}
export default new ShipInfoContainerView();
