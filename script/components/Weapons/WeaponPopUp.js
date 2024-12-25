import classNames from "../../helper/DomClassNames";
import DataSet from "../../helper/DataSet";
import * as URL from "../../helper/url.js";
import View from "../../allViews/view.js";

class WeaponPopUp extends View {
	baseRender(currentWeaponArray, currentInstalledWeapons, currentWeaponSlot) {
		const localParent = `.${classNames.weaponPopUp}`;
		// ${this.#headerRender()}
		// ${this.#bodyRender(currentWeaponArray)}
		const markup = `
			<div class="${classNames.tableContainer}">
				${this.#headerRender()}
				${this.#bodyRender(currentWeaponArray)}
			</div>
			<div class="${classNames.hoverContainer}"></div>
			`;

		return [markup, localParent];
	}
	#headerRender() {
		const CATEGORIES = {
			icon: "",
			name: "Name",
			type: "Type",
			range: "Range",
			cost: "Cost",
		};

		const categoryMarkup = Object.entries(CATEGORIES)
			.map(([key, value]) => {
				return `<li class="${classNames.unselectable} ${classNames.tableHeaderEntry}" ${DataSet.dataCategory}="${key}">
							${value}
						</li>`;
			})
			.join("");

		const markup = `
				<ul class="${classNames.tableEntries} ${classNames.tableHeader}">
					${categoryMarkup}
				</ul>
			`;
		return markup;
	}
	//prettierignore
	#bodyRender(currentWeaponArray) {
		const entryMarkup = (crrWpn) => `
			<ul class="${classNames.tableEntries}">
				<li class="${classNames.tableEntry} ${classNames.tableIcon}">
					${this.#weaponIconMarkup(crrWpn)}
				</li>
				<li class="${classNames.tableEntry} ${classNames.tableName}">${crrWpn.name}</li>
				<li class="${classNames.tableEntry}">
					${this.#weaponTypeStringConversion(crrWpn.type)}
				</li>
				<li class="${classNames.tableEntry}">${crrWpn.range}</li>
				<li class="${classNames.tableEntry}">${crrWpn.OPs}</li>
			</ul>
			`;

		return currentWeaponArray.map((crrWpn) => entryMarkup(crrWpn)).join("");
	}

	#weaponTypeStringConversion = (damageType) =>
		damageType
			.split("_")
			.map((word) => word[0] + word.slice(1).toLowerCase())
			.join(" ");

	#findCurrentInstalledWeapon = (currentWeaponSlot, weaponId) =>
		currentInstalledWeapons.find(
			([slotId, wpnId]) => slotId === currentWeaponSlot.id && wpnId === weaponId
		);

	processWeaponArray = () => {
		let activeWeaponClassObject;

		const modifiedWeaponsArray = weaponArray.filter((wpnObj) => {
			const currentInstalledWeaponKeyPair = this.#findCurrentInstalledWeapon(
				currentWeaponSlot,
				wpnObj.id
			);

			if (currentInstalledWeaponKeyPair) {
				activeWeaponClassObject = wpnObj;
				return false;
			}

			return true;
		});

		if (activeWeaponClassObject) {
			modifiedWeaponsArray.unshift(activeWeaponClassObject);
		}

		return modifiedWeaponsArray;
	};
	//
	#checkIfCorrectWeapon = (wpnObj) => {
		const [correctWeaponValue] = currentInstalledWeapons.filter((wpn) => {
			if (wpn[0] === currentWeaponSlot.id && wpn[1] === wpnObj.id) {
				return true;
			}
		});
		if (correctWeaponValue) {
			return true;
		}
	};
	//
	activeClass = (wpnObj) => {
		if (this.#checkIfCorrectWeapon(wpnObj)) {
			return ` ${classNames.weaponPopUpActive}`;
		}
		return "";
	};

	#weaponTypeBackgroundMarkup = (currentWeaponSlot) => {
		const weaponType = currentWeaponSlot.type.toLowerCase();
		const weaponSize = currentWeaponSlot.size.toLowerCase();
		return this.#weaponBackgroundSprite(weaponType, weaponSize);
	};

	#weaponBackgroundSpriteMarkUpAndSelector(weaponType, weaponSize) {
		const weaponMarkup = (size, type, oppacity) => {
			return `<div class="${classNames.weaponBackgroundSprite} ${classNames.weaponBackgroundSpriteSize}--${size} ${classNames.weaponBackgroundSpriteType}--${type} ${classNames.weaponBackgroundSpriteOppacity}--${oppacity}"></div>`;
		};
		const weaponTypeSelector = () => {
			if (
				weaponType === "ballistic" ||
				weaponType === "energy" ||
				weaponType === "missile"
			) {
				return weaponSize === "small"
					? weaponMarkup("small", weaponType, "full")
					: weaponSize === "medium"
					? weaponMarkup("small", weaponType, "medium") +
					  weaponMarkup("medium", weaponType, "full")
					: weaponSize === "large"
					? weaponMarkup("small", weaponType, "light") +
					  weaponMarkup("medium", weaponType, "medium") +
					  weaponMarkup("large", weaponType, "full")
					: console.warn("error with weaponSizeLogic");
			}
			if (weaponType === "composite") {
				return (
					weaponMarkup(weaponSize, weaponType, "full") +
					weaponMarkup(weaponSize, weaponType, "full")
				);
			}
			if (weaponType === "hybrid") {
				return (
					weaponMarkup(weaponSize, weaponType, "full") +
					weaponMarkup(weaponSize, weaponType, "full")
				);
			}
			if (weaponType === "decorative") {
				return "";
			}
			if (weaponType === "synergy") {
				return (
					weaponMarkup(weaponSize, weaponType, "full") +
					weaponMarkup(weaponSize, weaponType, "full")
				);
			}
		};
		return weaponTypeSelector();
	}
	#weaponBackgroundSprite(weaponType, weaponSize) {
		//prettierignore
		return `
		<div class="${classNames.weaponBackgroundSpriteParent}">
			${this.#weaponBackgroundSpriteMarkUpAndSelector(weaponType, weaponSize)}
		</div>`;
	}
	#weaponIconMarkup(weaponObject, weaponSlot) {
		const turretSprite = weaponObject.additionalWeaponData.turretSprite;
		const turretGunSprite = weaponObject.additionalWeaponData.turretGunSprite;
		const markupForGunSprite = turretGunSprite
			? `<img src="/${URL.DATA}/${turretGunSprite}" alt="gun sprite" class="${classNames.weaponSpriteGun}" />`
			: "";

		const weaponSize = weaponSlot
			? weaponSlot.size.toLowerCase()
			: weaponObject.additionalWeaponData.size.toLowerCase();
		const weaponType = weaponSlot
			? weaponSlot.type.toLowerCase()
			: weaponObject.additionalWeaponData.type.toLowerCase();
		//
		const markup = `
				<div class="${classNames.weaponSpriteParent}">
					${this.#weaponBackgroundSprite(weaponType, weaponSize)}
					<div class="${classNames.weaponSprite}">
						<img src="/${URL.DATA}/${turretSprite}" alt="weapon base sprite" 
						class="${classNames.weaponSpriteBase}"/>
						${markupForGunSprite}
					</div>
				</div>
				${this.#weaponArcRenderMarkup(weaponSlot)}`;
		return markup;
	}
	#weaponArcRenderMarkup(currentWeaponSlot) {
		if (!currentWeaponSlot) return "";

		const markup = `
		<div class="${classNames.weaponArc}" 
		${DataSet.dataId}"${currentWeaponSlot.id}" 
		${DataSet.dataArc}="${currentWeaponSlot.arc}" 
		${DataSet.dataAngle}="${currentWeaponSlot.angle}">
			<div class="${classNames.weaponArcSprite}"></div>
		</div>`;

		return markup;
	}
}
export default new WeaponPopUp();
