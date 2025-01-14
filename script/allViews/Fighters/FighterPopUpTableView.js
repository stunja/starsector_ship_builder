// View
import View from "../view.js";
// Helper
import classNames from "../../helper/DomClassNames.js";
import DataSet from "../../helper/DataSet.js";

class FighterPopUpTableView extends View {
	_localParent = `.${classNames.tableBody}`;

	generateMarkup() {
		// const [userShipBuild, currentWeaponArray, weaponSlot] = this._data;
		// const markup = `${this.#tableBodyRender(
		// 	currentWeaponArray,
		// 	userShipBuild.installedWeapons,
		// 	weaponSlot
		// )}`;
		console.log("test");
		const markup = "";
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

		//! ${WeaponSpriteView.renderElement([crrFighter, weaponSlot])}
		const entryMarkup = (crrFighter) => `
			<ul class="${classNames.tableEntries}${assignActiveClass(crrFighter)}"  
				${DataSet.dataWeaponPopUpId}="${crrFighter.id}">

				<li class="${classNames.tableEntry} ${classNames.tableIcon}">
					ICON
				</li>
				<li class="${classNames.tableEntry} ${classNames.tableName}">${
			crrFighter.name
		}</li>
				<li class="${classNames.tableEntry}">
					${crrFighter.role}
				</li>
				<li class="${classNames.tableEntry}">${crrFighter.range}</li>
				<li class="${classNames.tableEntry}">${crrFighter.oPs}</li>
			</ul>
			`;

		return currentWeaponArray.map((crrWpn) => entryMarkup(crrWpn)).join("");
	}
	// #fighterStringConversion(fighterId) {
	// 	return fighterId
	// 		.replaceAll("_wing", "")
	// 		.split("_")
	// 		.map((arr) => capitalizeFirstLetter(arr))
	// 		.join(" ");
	// }
	fighterSpritesRender(currentFighterObject) {
		const currentWeaponSprite =
			currentFighterObject.additionalFighterData.spriteName;
		const maxFighters = currentFighterObject.num;

		const spriteLocation = `./${URL.DATA}/${currentWeaponSprite}`;

		// Draw the sprite | Sprites can be drawn up to 6 in the same component
		// I then use CSS to position them correctly.
		const fighterSpriteMarkUp = (fighterNumber, fighterMax) =>
			`<img src="${spriteLocation}" alt="fighter sprite" class="${classNames.fighterSprite} ${classNames.fighterSprite}--${fighterNumber} ${classNames.fighterSpritesMax}--${fighterMax}" />`;

		// Draw sprites equal to number of fighters
		const fighterStringArray = Array.from({ length: maxFighters }, (_, i) => {
			return `${fighterSpriteMarkUp(i + 1, maxFighters)}`;
		}).join("");

		const markup = `
					<div class="${classNames.weaponSpriteParent}">
						<div class="${classNames.fighterSpriteContainer}">
                            ${fighterStringArray}
						</div>
					</div>`;
		return markup;
	}
}
export default new FighterPopUpTableView();
