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
	tableBodyRender(
		currentWeaponArray,
		currentInstalledWeapons,
		currentWeaponSlot
	) {
		const localParent = `.${classNames.tableBody}`;

		const assignActiveClass = (crrWpn) => {
			if (!crrWpn) return;

			const isActiveClass = currentInstalledWeapons.find(
				([slotId, wpnObjId]) =>
					slotId === currentWeaponSlot.id && wpnObjId === crrWpn.id
			);

			return isActiveClass ? `${classNames.weaponPopUpActive}` : "";
		};

		const entryMarkup = (crrWpn) => `
			<ul class="${classNames.tableEntries} ${assignActiveClass(crrWpn)}"  
				${DataSet.dataWeaponPopUpId}="${crrWpn.id}">

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
}
export default new WeaponPopUpView();
