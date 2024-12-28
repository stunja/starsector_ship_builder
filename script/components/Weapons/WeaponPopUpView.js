import classNames from "../../helper/DomClassNames.js";
import DataSet from "../../helper/DataSet.js";
import WeaponSpriteView from "./WeaponSpriteView.js";
import View from "../../allViews/view.js";

class WeaponPopUpView extends View {
	tableContainerRender() {
		const localParent = `.${classNames.weaponPopUp}`;

		const markup = `
			<div class="${classNames.tableContainer}">
				<ul class="${classNames.tableEntries} ${classNames.tableHeader}"></ul>
				<div class="${classNames.tableBody}"></div>
			</div>
			<div class="${classNames.hoverContainer}"></div>
			`;

		return [markup, localParent];
	}
	tableHeaderRender() {
		const localParent = `.${classNames.tableHeader}`;

		const CATEGORIES = {
			icon: "",
			name: "Name",
			type: "Type",
			range: "Range",
			cost: "Cost",
		};

		const markup = Object.entries(CATEGORIES)
			.map(([key, value]) => {
				return `<li class="${classNames.unselectable} ${classNames.tableHeaderEntry}" ${DataSet.dataCategory}="${key}">
							${value}
						</li>`;
			})
			.join("");

		return [markup, localParent];
	}
	//prettierignore
	tableBodyRender(currentWeaponArray) {
		const localParent = `.${classNames.tableBody}`;

		const entryMarkup = (crrWpn) => `
			<ul class="${classNames.tableEntries}"  
				${DataSet.dataWeaponId}="${crrWpn.id}">

				<li class="${classNames.tableEntry} ${classNames.tableIcon}">
					${WeaponSpriteView.render(crrWpn)}
				</li>
				<li class="${classNames.tableEntry} ${classNames.tableName}">${crrWpn.name}</li>
				<li class="${classNames.tableEntry}">
					${this.#weaponTypeStringConversion(crrWpn.type)}
				</li>
				<li class="${classNames.tableEntry}">${crrWpn.range}</li>
				<li class="${classNames.tableEntry}">${crrWpn.OPs}</li>
			</ul>
			`;

		const markup = currentWeaponArray
			.map((crrWpn) => entryMarkup(crrWpn))
			.join("");

		return [markup, localParent];
	}
	closePopUp() {
		const locaParent = `.${classNames.tableContainer}`;
		const markup = "";

		return [markup, locaParent];
	}

	#weaponTypeStringConversion = (damageType) =>
		damageType
			.split("_")
			.map((word) => word[0] + word.slice(1).toLowerCase())
			.join(" ");

	// #findCurrentInstalledWeapon = (currentWeaponSlot, weaponId) =>
	// 	currentInstalledWeapons.find(
	// 		([slotId, wpnId]) => slotId === currentWeaponSlot.id && wpnId === weaponId
	// 	);

	// processWeaponArray = () => {
	// 	let activeWeaponClassObject;

	// 	const modifiedWeaponsArray = weaponArray.filter((wpnObj) => {
	// 		const currentInstalledWeaponKeyPair = this.#findCurrentInstalledWeapon(
	// 			currentWeaponSlot,
	// 			wpnObj.id
	// 		);

	// 		if (currentInstalledWeaponKeyPair) {
	// 			activeWeaponClassObject = wpnObj;
	// 			return false;
	// 		}

	// 		return true;
	// 	});

	// 	if (activeWeaponClassObject) {
	// 		modifiedWeaponsArray.unshift(activeWeaponClassObject);
	// 	}

	// 	return modifiedWeaponsArray;
	// };
	//
	// #checkIfCorrectWeapon = (wpnObj) => {
	// 	const [correctWeaponValue] = currentInstalledWeapons.filter((wpn) => {
	// 		if (wpn[0] === currentWeaponSlot.id && wpn[1] === wpnObj.id) {
	// 			return true;
	// 		}
	// 	});
	// 	if (correctWeaponValue) {
	// 		return true;
	// 	}
	// };
	//
	// activeClass = (wpnObj) => {
	// 	if (this.#checkIfCorrectWeapon(wpnObj)) {
	// 		return ` ${classNames.weaponPopUpActive}`;
	// 	}
	// 	return "";
	// };

	// #weaponTypeBackgroundMarkup = (currentWeaponSlot) => {
	// 	const weaponType = currentWeaponSlot.type.toLowerCase();
	// 	const weaponSize = currentWeaponSlot.size.toLowerCase();
	// 	return this.#weaponBackgroundSprite(weaponType, weaponSize);
	// };
}
export default new WeaponPopUpView();
