import classNames from "../../helper/DomClassNames";
import * as URL from "../../helper/url";

class HangarContainer {
	render(state) {
		const localParent = `.${classNames.hangarContainer}`;
		const markup = `${this.#structureMarkup(state.currentShip)}`;

		return [markup, localParent];
	}

	#structureMarkup(currentShip) {
		return `
				<div class="${classNames.weaponPopUp}"></div>
                <ul class="${classNames.shipAndWeaponsHolder}">
                  	<li class="${classNames.weaponSlotsHolder}">
                    	<ul class="${classNames.weaponSlots}"></ul>
                  	</li>
                  	<img src="/${URL.DATA}/${currentShip.spriteName}" alt="${currentShip.spriteName}" class="${classNames.shipSprite}" />
                </ul>
                  `;
	}
}
export default new HangarContainer();

// // Regular

// //

// // Markup

// // TODO is this a copy?

// #weaponIconMarkup(weaponObject, weaponSlot) {
// 	const turretSprite = weaponObject.additionalWeaponData.turretSprite;
// 	const turretGunSprite = weaponObject.additionalWeaponData.turretGunSprite;
// 	const markupForGunSprite = turretGunSprite
// 		? `<img src="/${URL.DATA}/${turretGunSprite}" alt="gun sprite" class="${classNames.weaponSpriteGun}" />`
// 		: "";

// 	const weaponSize = weaponSlot
// 		? weaponSlot.size.toLowerCase()
// 		: weaponObject.additionalWeaponData.size.toLowerCase();
// 	const weaponType = weaponSlot
// 		? weaponSlot.type.toLowerCase()
// 		: weaponObject.additionalWeaponData.type.toLowerCase();
// 	//
// 	const markup = `
// 			<div class="${classNames.weaponSpriteParent}">
// 				${this.#weaponBackgroundSprite(weaponType, weaponSize)}
// 				<div class="${classNames.weaponSprite}">
// 					<img src="/${URL.DATA}/${turretSprite}" alt="weapon base sprite" class="${
// 		classNames.weaponSpriteBase
// 	}"/>
// 					${markupForGunSprite}
// 				</div>
// 			</div>
// 			${this.#weaponArcRenderMarkup(weaponSlot)}`;
// 	return markup;
// }
// #weaponTypeSprite(weaponObject) {
// 	const editedString = weaponObject.type.toLowerCase();
// 	const targetFile = `damagetype_${editedString}.png`;
// 	return `<img src="/${URL.UI_ICONS}/${targetFile}" alt="weapon damage type" class="${classNames.weaponDamageType}"/>`;
// }

// weaponPopUpRender() {
// 	const localParent = `.${classNames.weaponPopUpParent}`;
// 	document.querySelector(`.${classNames.weaponPopUpParent}`).classList.remove(`${classNames.dNone}`);

// 	const markup = `
// 		<div class="${classNames.weaponPopUp}">
// 			<div class="${classNames.hoverAdditionalInformation}"></div>
// 			<div class="${classNames.weaponPopUpTable}">
// 				<ul class="${classNames.weaponPopUpFilter}"></ul>
// 				<div class="${classNames.weaponPopUpTableWrapper}">
// 					<table class="${classNames.weaponPopUpTableBody}">
// 					<thead></thead>
// 					<tbody></tbody>
// 					</table>
// 				</div>
// 			</div>
// 		</div>
// `;
// 	return [markup, localParent];
// }
// weaponPopUpTableHeader() {
// 	const localParent = `.${classNames.weaponPopUpTable} thead`;

// 	const markup = `
// 				<tr class="${classNames.weaponPopUpTableHeader}">
// 					<th></th>
// 					<th class="${classNames.weaponPopUpTableHeader} ${classNames.tableHeader} ${classNames.unselectable}" data-category="name">
// 						<div>
// 							<p>Name</p><ion-icon name="chevron-down-outline" class="icon-generic"></ion-icon>
// 						</div>
// 					</th>
// 					<th class="${classNames.weaponPopUpTableHeader} ${classNames.tableHeader} ${classNames.unselectable}" data-category="type">
// 						<div>
// 							<p>Type</p><ion-icon name="chevron-down-outline" class="icon-generic"></ion-icon>
// 						</div>
// 					</th>
// 					<th class="${classNames.weaponPopUpTableHeader} ${classNames.tableHeader} ${classNames.unselectable}" data-category="range">
// 						<div>
// 							<p>Range</p><ion-icon name="chevron-down-outline" class="icon-generic"></ion-icon>
// 						</div>
// 					</th>
// 					<th class="${classNames.weaponPopUpTableHeader} ${classNames.tableHeader} ${classNames.unselectable}" data-category="cost">
// 						<div>
// 							<p>Cost</p><ion-icon name="chevron-down-outline" class="icon-generic"></ion-icon>
// 						</div>
// 					</th>
// 				</tr>
// 			`;

// 	return [markup, localParent];
// }
// weaponPopUpTableContentRender(weaponArray, currentInstalledWeapons, currentWeaponSlot) {
// 	const localParent = `.${classNames.weaponPopUpTable} tbody`;
// 	const weaponTypeStringConversion = (damageType) => {
// 		const convertedString = damageType
// 			.split("_")
// 			.map((word) => word[0] + word.slice(1).toLowerCase())
// 			.join(" ")
// 			.toUpperCase();

// 		const specialCases = {
// 			"HIGH EXPLOSIVE": "EXPLOSIVE",
// 			"FRAGMENTATION": "FRAGMEN", // prettier-ignore
// 		};

// 		return specialCases[convertedString] || convertedString;
// 	};
// 	const findCurrentInstalledWeapon = (currentWeaponSlot, weaponId) =>
// 		currentInstalledWeapons.find(([slotId, wpnId]) => slotId === currentWeaponSlot.id && wpnId === weaponId);
// 	//
// 	const processWeaponArray = () => {
// 		let activeWeaponClassObject;

// 		const modifiedWeaponsArray = weaponArray.filter((wpnObj) => {
// 			const currentInstalledWeaponKeyPair = findCurrentInstalledWeapon(currentWeaponSlot, wpnObj.id);

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
// 	};
// 	//
// 	const checkIfCorrectWeapon = (wpnObj) => {
// 		const [correctWeaponValue] = currentInstalledWeapons.filter((wpn) => {
// 			if (wpn[0] === currentWeaponSlot.id && wpn[1] === wpnObj.id) {
// 				return true;
// 			}
// 		});
// 		if (correctWeaponValue) {
// 			return true;
// 		}
// 	};
// 	//
// 	const activeClass = (wpnObj) => {
// 		if (checkIfCorrectWeapon(wpnObj)) {
// 			return ` ${classNames.weaponPopUpActive}`;
// 		}
// 		return "";
// 	};
// 	//
// 	const markup = processWeaponArray()
// 		.map((weaponObj) => {
// 			if (Number.parseInt(weaponObj.OPs) === 0 || !weaponObj.OPs) return "";

// 			const weaponType = weaponObj.additionalWeaponData.type.toLowerCase();
// 			const weaponSize = weaponObj.additionalWeaponData.size.toLowerCase();
// 			const markup = `
// 					<tr class="${classNames.weapon} ${classNames.weaponSize}--${weaponSize} ${classNames.weaponType}--${weaponType}${activeClass(weaponObj)}" data-id="${
// 				weaponObj.id
// 			}">
// 						<td class="${classNames.weaponIcon}">${this.#weaponIconMarkup(weaponObj)}</td>
// 						<td class="${classNames.weaponName}">${weaponObj.name}</td>
// 						<td class="${classNames.weaponType} ${classNames.weaponType}--${weaponObj.type.toLowerCase()}">${weaponTypeStringConversion(weaponObj.type)}</td>
// 						<td class="${classNames.weaponRange}">${weaponObj.range}</td>
// 						<td class="${classNames.weaponCost}">${weaponObj.OPs}</td>
// 					</tr>`;
// 			return markup;
// 		})
// 		.join("");

// 	return [markup, localParent];
// }

// weaponPopUpHoverAdditionalInformationRender(
// 	weaponObjectEditedData,
// 	weaponObject
// ) {
// 	const localParent = `.${classNames.hoverAdditionalInformation}`;

// 	// document
// 	// 	.querySelector(localParent)
// 	// 	.classList.remove(classNames.dNone);

// 	const {
// 		stats,
// 		information,
// 		additionalStats,
// 		string,
// 		damageTypeEffect,
// 		accuracyRating,
// 		turnRateRating,
// 	} = weaponObjectEditedData;

// 	const contentMarkUp = (str, data) => {
// 		return `
// 			<li>
// 				${str !== "" ? `<p>${str}</p>` : ""}
// 				<strong><p>${data}</p></strong>
// 			</li>`;
// 	};

// 	//
// 	const fluxMarkUp = () => {
// 		const fluxPerShotMarkup = stats.flux.perShot
// 			? `${contentMarkUp("Flux / shot", stats.flux.perShot)}`
// 			: "";
// 		const fluxPerSecondMarkup = additionalStats.fluxPerSecond
// 			? `${contentMarkUp("Flux / sec", additionalStats.fluxPerSecond)}`
// 			: "";
// 		const fluxPerDamageMarkup = additionalStats.fluxPerDamage
// 			? `${contentMarkUp("Flux / damage", additionalStats.fluxPerDamage)}`
// 			: "";

// 		const markup = `
// 			${fluxPerSecondMarkup}
// 			${fluxPerShotMarkup}
// 			${fluxPerDamageMarkup}`;
// 		return markup;
// 	};
// 	const weaponTypeString = stats.projectile.type
// 		.split("_")
// 		.map((str) => capitalizeFirstLetter(str.toLowerCase()))
// 		.join(" ");

// 	//! Way to many useless classes
// 	// class="${this.#weaponMountTypeClass}"
// 	const primaryDataMarkUp = `
// 	<div class="d-grid weapon-primary-data">
//       <div class="weapon-primary-data__icon">
//         <li class="${classNames.weaponIcon} ${classNames.weaponSize}--${
// 		stats.mount.size
// 	} ${classNames.weaponType}--${stats.mount.type}" data-id="${
// 		information.id
// 	}">${this.#weaponIconMarkup(weaponObject)}</li>
//       </div>
// 		<div class="weapon-primary-data_content">
// 			${contentMarkUp("Primary Role", information.primaryRole)}
// 			<li>
// 				<p>Mount Type:</p>
// 				<div class="${classNames.textAlignRight}">
// 					<strong><p>${capitalizeFirstLetter(stats.mount.type)}</p></strong>
// 					<strong><p>${capitalizeFirstLetter(stats.mount.size)}</p></strong>
// 				</div>
// 			</li>
// 			${contentMarkUp("Ordinance Point", information.op)}

// 			<div class="${classNames.weaponContentGroup}">
// 				${contentMarkUp("Range", stats.range)}
// 				${
// 					!additionalStats.isWeaponBeam
// 						? contentMarkUp("Damage", string.damageString)
// 						: ""
// 				}
// 				${contentMarkUp("Damage / sec", additionalStats.damagePerSecond)}
// 			</div>
// 			${fluxMarkUp()}
// 		</div>
//       </div>
// `;
// 	const anciliaryDataMarkUp = `
// 		<div class="d-grid weapon-anciliary-data">
// 			<div class="weapon-anciliary-data__icon-parent">
// 				<li class="weapon-anciliary-data__icon">${this.#weaponTypeSprite(
// 					weaponObject
// 				)}</li>
// 			</div>
// 			<div class="weapon-primary-data_content">
// 				<li class="${classNames.weaponDamageType}">
// 					<p>Damage Type:</p>
// 					<div class="${classNames.textAlignRight}">
// 						<strong><p>${weaponTypeString}</p></strong>
// 						<strong><p>${damageTypeEffect()}</p></strong>
// 					</div>
// 				</li>
// 				${contentMarkUp("Accuracy", accuracyRating())}
// 				${contentMarkUp("Turn rate", turnRateRating())}

// 				${
// 					stats.ammo.burstSize < 2 || !stats.ammo.burstSize
// 						? ""
// 						: contentMarkUp("Burst Size", stats.ammo.burstSize)
// 				}
// 				${stats.ammo.capacity ? contentMarkUp("Ammo Size", stats.ammo.capacity) : ""}
// 				${
// 					stats.ammo.capacity
// 						? contentMarkUp("Ammo Per Sec", stats.ammo.perSecond)
// 						: ""
// 				}

// 				${contentMarkUp("Refire delay", string.refireDelayString)}
// 			</div>
// 		</div>`;

// 	//! Wrong implementation of ShortString. I need to rework it
// 	// 15/12/2024
// 	const introDataMarkUp = `
// 			<li class="weapon-name">
// 				<p>Weapon Name</p>
// 				<p>${information.name}</p>
// 			</li>
// 			<li class="${classNames.weaponDescription}"><p>${string.shortWeaponDescription}.</p></li>`;
// 	const markup = `
// 		<ul>
// 			${introDataMarkUp}
// 			<li class="weapon-divider"><p>Primary Data</p></li>
// 			${primaryDataMarkUp}
// 			<li class="weapon-divider"><p>Anciliary Data</p></li>
// 			${anciliaryDataMarkUp}
// 		</ul>
// 	`;
// 	return [markup, localParent];
// }
// weaponPopUpTurnCurrentActiveWeaponInactive(btn) {
// 	btn.classList.remove(`${classNames.weaponPopUpActive}`);
// }

// addCurrentWeaponSpriteToShipRender(currentWeaponSlot, weaponObject) {
// 	const slotId = currentWeaponSlot.id;
// 	const localParent = `[data-id="${slotId}"]`;
// 	const markup = `${this.#weaponIconMarkup(weaponObject, currentWeaponSlot)}`;

// 	return [markup, localParent];
// }
