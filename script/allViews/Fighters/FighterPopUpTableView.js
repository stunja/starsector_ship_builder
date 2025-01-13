import classNames from "../../helper/DomClassNames.js";
import DataSet from "../../helper/DataSet.js";
// View
import View from "../view.js";
import WeaponSpriteView from "../Weapons/WeaponSpriteView.js";

class WeaponPopUpTableView extends View {
	_localParent = `.${classNames.tableBody}`;

	generateMarkup() {
		const [userShipBuild, currentWeaponArray, weaponSlot] = this._data;
		const markup = `${this.#tableBodyRender(
			currentWeaponArray,
			userShipBuild.installedWeapons,
			weaponSlot
		)}`;
		return markup;
	}
	#tableBodyRender(currentWeaponArray, installedWeapons, weaponSlot) {
		const assignActiveClass = (crrWpn) => {
			if (!crrWpn) return;

			const isActiveClass = installedWeapons.find(
				([slotId, wpnObjId]) =>
					slotId === weaponSlot.id && wpnObjId === crrWpn.id
			);

			// empty space so they are not joined classes
			return isActiveClass ? ` ${classNames.weaponPopUpActive}` : "";
		};

		const entryMarkup = (crrWpn) => `
			<ul class="${classNames.tableEntries}${assignActiveClass(crrWpn)}"  
				${DataSet.dataWeaponPopUpId}="${crrWpn.id}">

				<li class="${classNames.tableEntry} ${classNames.tableIcon}">
					${WeaponSpriteView.renderElement([crrWpn, weaponSlot])}
				</li>
				<li class="${classNames.tableEntry} ${classNames.tableName}">${crrWpn.name}</li>
				<li class="${classNames.tableEntry}">
					${this.#weaponTypeStringConversion(crrWpn.type)}
				</li>
				<li class="${classNames.tableEntry}">${crrWpn.range}</li>
				<li class="${classNames.tableEntry}">${crrWpn.oPs}</li>
			</ul>
			`;

		return currentWeaponArray.map((crrWpn) => entryMarkup(crrWpn)).join("");
	}
	#weaponTypeStringConversion = (damageType) =>
		damageType
			.split("_")
			.map((word) => word[0] + word.slice(1).toLowerCase())
			.join(" ");
}
export default new WeaponPopUpTableView();
// import View from "../../allViews/view.js";
// import classNames from "../../helper/DomClassNames.js";
// import FighterSpritesView from "./FighterSpritesView.js";

// import { capitalizeFirstLetter } from "../../helper/helperFunction.js";
// import URL from "../../helper/url.js";

// class FighterPopUpTableView extends View {
// 	#fighterStringConversion(fighterId) {
// 		return fighterId
// 			.replaceAll("_wing", "")
// 			.split("_")
// 			.map((arr) => capitalizeFirstLetter(arr))
// 			.join(" ");
// 	}
// 	#findCurrentInstalledWeapon(
// 		currentWeaponSlot,
// 		weaponId,
// 		currentInstalledWeapons
// 	) {
// 		return currentInstalledWeapons.find(
// 			([slotId, wpnId]) => slotId === currentWeaponSlot.id && wpnId === weaponId
// 		);
// 	}

// 	#checkIfCorrectWeapon(wpnObj, currentInstalledWeapons, currentWeaponSlot) {
// 		const [correctWeaponValue] = currentInstalledWeapons.filter((wpn) => {
// 			if (wpn[0] === currentWeaponSlot.id && wpn[1] === wpnObj.id) {
// 				return true;
// 			}
// 		});
// 		if (correctWeaponValue) {
// 			return true;
// 		}
// 	}

// 	#activeClass(wpnObj, currentInstalledWeapons, currentWeaponSlot) {
// 		if (
// 			this.#checkIfCorrectWeapon(
// 				wpnObj,
// 				currentInstalledWeapons,
// 				currentWeaponSlot
// 			)
// 		) {
// 			return ` ${classNames.weaponPopUpActive}`;
// 		}
// 		return "";
// 	}
// 	// I dont like this.
// 	#processWeaponArray(weaponArray, currentInstalledWeapons, currentWeaponSlot) {
// 		let activeWeaponClassObject;

// 		const modifiedWeaponsArray = weaponArray.filter((wpnObj) => {
// 			const currentInstalledWeaponKeyPair = this.#findCurrentInstalledWeapon(
// 				currentWeaponSlot,
// 				wpnObj.id,
// 				currentInstalledWeapons
// 			);

// 			if (currentInstalledWeaponKeyPair) {
// 				activeWeaponClassObject = wpnObj;
// 				return false;
// 			}
// 			return true;
// 		});

// 		if (activeWeaponClassObject) {
// 			modifiedWeaponsArray.unshift(activeWeaponClassObject);
// 		}

// 		return modifiedWeaponsArray;
// 	}

// 	//? Render
// 	// There is MAX of 6 fighters. I need to check number of fighters
// 	fighterSpritesRender(currentFighterObject) {
// 		const currentWeaponSprite =
// 			currentFighterObject.additionalFighterData.spriteName;
// 		const maxFighters = currentFighterObject.num;

// 		const spriteLocation = `./${URL.DATA}/${currentWeaponSprite}`;

// 		// Draw the sprite | Sprites can be drawn up to 6 in the same component
// 		// I then use CSS to position them correctly.
// 		const fighterSpriteMarkUp = (fighterNumber, fighterMax) =>
// 			`<img src="${spriteLocation}" alt="fighter sprite" class="${classNames.fighterSprite} ${classNames.fighterSprite}--${fighterNumber} ${classNames.fighterSpritesMax}--${fighterMax}" />`;

// 		// Draw sprites equal to number of fighters
// 		const fighterStringArray = Array.from({ length: maxFighters }, (_, i) => {
// 			return `${fighterSpriteMarkUp(i + 1, maxFighters)}`;
// 		}).join("");

// 		const markup = `
// 					<div class="${classNames.weaponSpriteParent}">
// 						<div class="${classNames.fighterSpriteContainer}">
//                             ${fighterStringArray}
// 						</div>
// 					</div>`;
// 		return markup;
// 	}

// 	render() {
// 		const localParent = `.${classNames.fighterPopUp}`;
// 		//! Delete ? Maybe
// 		// document
// 		// 	.querySelector(`.${classNames.weaponPopUpParent}`)
// 		// 	.classList.remove(`${classNames.dNone}`);

// 		const markup = `
// 			<div class="${classNames.fighterPopUpContainer}">
// 				<div class="${classNames.hoverAdditionalInformation}"></div>
// 				<div class="${classNames.weaponPopUpTable}">
// 					<ul class="${classNames.weaponPopUpFilter}"></ul>
// 					<div class="${classNames.weaponPopUpTableWrapper}">
// 						<table class="${classNames.weaponPopUpTableBody}">
// 							<thead></thead>
// 							<tbody></tbody>
// 						</table>
// 					</div>
// 				</div>
// 			</div>
//     `;
// 		return [markup, localParent];
// 	}
// 	tableHeaderRender() {
// 		const localParent = `.${classNames.weaponPopUpTable} thead`;
// 		const dataCategory = [
// 			{
// 				label: "Name",
// 				category: "name",
// 			},
// 			{
// 				label: "Role",
// 				category: "role",
// 			},
// 			{
// 				label: "Range",
// 				category: "range",
// 			},
// 			{
// 				label: "Cost",
// 				category: "cost",
// 			},
// 		];
// 		const headerCategoryMarkUp = dataCategory
// 			.map(
// 				({ label, category }) => `
// 						<th class="${classNames.weaponPopUpTableHeader} ${classNames.tableHeader} ${classNames.unselectable}" data-category="${category}">
// 							<div>
// 								<p>${label}</p>
// 							</div>
// 						</th>`
// 			)
// 			.join("");

// 		const markup = `
// 					<tr class="${classNames.weaponPopUpTableHeader}">
// 						<th></th>
// 						${headerCategoryMarkUp}
// 					</tr>
// 				`;

// 		return [markup, localParent];
// 	}
// 	tableContentRender(weaponArray, currentInstalledWeapons, currentWeaponSlot) {
// 		const localParent = `.${classNames.weaponPopUpTable} tbody`;

// 		// prettier-ignore
// 		const markup = this.#processWeaponArray(weaponArray, currentInstalledWeapons, currentWeaponSlot)
// 			.map((fighterObj) => {
// 				//
// 				const markup = `
//                     <tr class="${classNames.fighter}${this.#activeClass(fighterObj, currentInstalledWeapons, currentWeaponSlot)}" data-id="${fighterObj.id}">
//                             <td class="${classNames.fighterSprites}">
//                                 ${FighterSpritesView.render(fighterObj)}
//                             </td>
// 							<td class="${classNames.fighterName}">
//                                 ${this.#fighterStringConversion(fighterObj.id)}
//                             </td>
// 							<td class="${classNames.fighterType}">${fighterObj.role}</td>
// 							<td class="${classNames.fighterRange}">${fighterObj.range}</td>
// 							<td class="${classNames.fighterCost}">${fighterObj.op_cost}</td>
// 						</tr>`;
// 				return markup;
// 			})
// 			.join("");

// 		return [markup, localParent];
// 	}
// }
// // DONT FORGET TO CALL IT
// export default new FighterPopUpTableView();
