// ViewModel
import ViewModel from "../../ViewModel.js";
import ShipStats from "../ShipStats/ShipStats";
import HullModController from "../../components/Hullmods/HullModController.js";

// Helper
import WeaponPopUpCreateCurrentWeaponArray from "./WeaponPopUpCreateCurrentWeaponArray.js";
import TablePopUpSorter from "../TablePopUpSorter.js";
import classNames from "../../helper/DomClassNames.js";
import UpdateUserShipBuild from "../../helper/UpdateUserShipBuild.js";

import {
	weaponSlotIdIntoWeaponSlotObject,
	AddRemoveInstalledWeapon,
	pushTargetWeaponObjectOnTop,
} from "../../helper/helperFunction.js";

import {
	EVENT_LISTENER_TYPE,
	GENERIC_STRING,
} from "../../helper/MagicStrings.js";

// Views
import WeaponPopUpContainerView from "../../allViews/WeaponPopUp/WeaponPopUpContainerView.js";
import WeaponPopUpTableHeaderView from "../../allViews/WeaponPopUp/WeaponPopUpTableHeaderView.js";
import WeaponPopUpTableView from "../../allViews/WeaponPopUp/WeaponPopUpTableView.js";
import WeaponSlots from "./WeaponSlots.js";
import WeaponHoverContainerView from "../../allViews/WeaponPopUp/WeaponHoverContainerView.js";

const EVENT_LISTENER_TARGET = {
	TABLE_ENTRIES: `.${classNames.tableEntries}`,
	TABLE_HEADER_ENTRY: `.${classNames.tableHeaderEntry}`,
};

const SKIP_SORT_CATEGORY = {
	icon: "icon",
	description: "description",
};

const TABLE_POPUP_TYPE = "weaponPopUpTable";

export default class WeaponPopUp extends ViewModel {
	#weaponSlot;
	// CurrentWeaponArray based on Slots / Weapon Mount
	#currentWeaponArray;

	#state;
	#allWeapons;
	#userShipBuild;
	#installedWeapons;
	// Hover
	#currentlyHoveredWeapon;
	// UI
	constructor(model) {
		super(model);
	}
	#updateData() {
		this.#state = this.getState();
		this.#allWeapons = this.#state.dataState.allWeapons;
		this.#userShipBuild = this.#state.userState.userShipBuild;
		this.#installedWeapons = this.#userShipBuild.installedWeapons;
	}
	#updateOtherComponents() {
		// Update shipStats to render new fields
		new ShipStats(this.getState()).update();
		// Update Controller, to display installedHullMods
		new HullModController(this.getState()).update();
	}
	update = (btn) => {
		if (!btn) return;

		this.#updateData();

		this.#weaponSlot = weaponSlotIdIntoWeaponSlotObject(
			this.getUserShipBuild().weaponSlots,
			btn.dataset.weaponSlotId
		);

		this.#createCurrentWeaponArray();

		// Pushes Installed Weapon to the top of the array
		this.#currentWeaponArray = pushTargetWeaponObjectOnTop(
			this.#installedWeapons,
			this.#weaponSlot,
			this.#currentWeaponArray
		);

		// Render
		this.#weaponPopUpRender();
		this.#addEventListeners();
	};

	#toggleWeaponAndClosePopUp() {
		// Update WeaponSlots // Render // Listener // Arcs / Background
		new WeaponSlots(this.#state).update();

		// Remove WeaponPopUpContainer
		WeaponPopUpContainerView._clearRender();
	}

	#weaponTableSorter = (btn) => {
		const { category } = btn.dataset;
		if (SKIP_SORT_CATEGORY[category]) return;
		// Sort the Table
		const sorterArray = TablePopUpSorter.update([
			category,
			TABLE_POPUP_TYPE,
			this.#currentWeaponArray,
			this.#userShipBuild,
		]);

		this.#currentWeaponArray = pushTargetWeaponObjectOnTop(
			this.#installedWeapons,
			this.#weaponSlot,
			sorterArray
		);
		// Render Changes
		this.#weaponPopUpRender();
		this.#addEventListeners();
	};
	// Creates currentArray based on Weapon Slot Type and Size.
	#createCurrentWeaponArray() {
		this.#currentWeaponArray =
			WeaponPopUpCreateCurrentWeaponArray.weaponFilterArray(
				this.#weaponSlot,
				this.#allWeapons
			);
	}

	// Renders After User Clicks on Weapon Button (Weapon Slot)
	#weaponPopUpRender() {
		//? Strange way to render, but it works.
		//? first draw "empty" container then target it with other renders
		WeaponPopUpContainerView.render(this.#userShipBuild);
		WeaponPopUpTableHeaderView.render(this.#userShipBuild);
		WeaponPopUpTableView.render([
			this.#userShipBuild,
			this.#currentWeaponArray,
			this.#weaponSlot,
		]);
	}
	// User Clicks to Add Weapon to Installed Weapon Array
	#addCurrentWeaponToInstalledWeapons = (btn) => {
		const { weaponPopUpId } = btn.dataset;

		new UpdateUserShipBuild(this.getState()).updateWeapons(
			weaponPopUpId,
			this.#weaponSlot.id
		);

		// const updateInstalledWeapons = AddRemoveInstalledWeapon(
		// 	this.#installedWeapons,
		// 	weaponPopUpId,
		// 	this.#weaponSlot.id
		// );
		// const updateOpCost = updateOpCostFromWeaponsAndFighters(
		// 	updateInstalledWeapons,
		// 	this.#allWeapons
		// );

		// console.log(updateOpCost);
		// console.log(ordinancePoints);
		// console.log(ordinancePoints + updateOpCost);

		// this.setUpdateUserShipBuild({
		// 	...this.#userShipBuild,
		// 	installedWeapons: updateInstalledWeapons,
		// 	ordinancePoints: ordinancePoints + updateOpCost,
		// });

		this.#updateData();
		this.#toggleWeaponAndClosePopUp();
		this.#updateOtherComponents();
	};

	// Hover
	#showAdditionalInformationOnHover = (btn) => {
		const { weaponPopUpId } = btn.dataset;
		if (this.#currentlyHoveredWeapon === weaponPopUpId) return; // guard from mouseover event
		this.#currentlyHoveredWeapon = weaponPopUpId;

		const hoveredWeaponObject = weaponSlotIdIntoWeaponSlotObject(
			this.#allWeapons,
			weaponPopUpId
		);
		// Render Hover Container
		// strange implementation, I need wpnOb+wpnSlot for icon render
		WeaponHoverContainerView.render([
			this.#weaponObjectData(hoveredWeaponObject),
			hoveredWeaponObject,
			this.#weaponSlot,
		]);
	};
	// simplified view of all data to weaponHoverrender
	// Old code, needs a reWrite
	#weaponObjectData = (weaponObject) => {
		const information = {
			id: weaponObject.id,
			name: weaponObject.name,
			primaryRole: weaponObject.primaryRoleStr,
			op: weaponObject.oPs,
			turretSprite: weaponObject.additionalData?.turretSprite,
			turretGunSprite: weaponObject.additionalData?.turretGunSprite,
			description: weaponObject.additionalData.description,
		};
		const stats = {
			ammo: {
				perSecond: weaponObject.ammo_sec ?? 1,
				capacity: weaponObject.ammo,
				burstSize: weaponObject.burstSize ?? 1,
			},
			damage: {
				perShot: weaponObject.damageShot ?? 1,
				perSecond: weaponObject.damageSecond,
			},
			flux: {
				perSecond: weaponObject.energySecond,
				perShot: weaponObject.energyShot,
			},
			timing: {
				chargeUp: weaponObject.chargeup,
				chargeDown: weaponObject.chargedown,
				burstDelay: weaponObject.burst_delay ?? 0,
			},
			handling: {
				turnRate: weaponObject.turnRate,
				accuracy: weaponObject.spreadShot,
			},
			projectile: {
				projectileOrBeam: weaponObject.additionalData.specClass, // projectile / beam
				type: weaponObject.type,
			},
			mount: {
				type: weaponObject.additionalData.type.toLowerCase(),
				size: weaponObject.additionalData.size.toLowerCase(),
			},
			range: weaponObject.range,
		};

		const roundFloat = (num) => {
			return Math.round(num * 100) / 100;
		};

		const refireDelay =
			stats.timing.chargeDown +
			stats.timing.chargeUp +
			stats.timing.burstDelay * (stats.ammo.burstSize - 1);

		const burstSizeString =
			stats.timing.burstSize && stats.timing.burstSize > 1
				? `x${stats.ammo.burstSize}`
				: GENERIC_STRING.EMPTY;
		const weaponDescription = information.description.split(".");

		const isWeaponBeam = stats.projectile.projectileOrBeam === "beam";
		const isWeaponProjectile =
			stats.projectile.projectileOrBeam === "projectile";
		//
		const damagePerSecond = Math.round(
			(stats.damage.perShot * stats.ammo.burstSize) / refireDelay
		);
		const fluxPerSecond = isWeaponProjectile
			? Math.round(stats.flux.perShot / refireDelay)
			: stats.flux.perSecond;
		const fluxPerDamage = isWeaponProjectile
			? roundFloat(stats.flux.perShot / stats.damage.perShot)
			: 1;

		// Strings
		const damageString = `${stats.damage.perShot}${burstSizeString}`;
		const refireDelayString = roundFloat(refireDelay);
		const shortWeaponDescription = weaponDescription[0];

		return {
			stats,
			information,
			additionalStats: {
				isWeaponBeam,
				isWeaponProjectile,
				damagePerSecond,
				refireDelay,
				fluxPerSecond,
				fluxPerDamage,
			},
			string: {
				burstSizeString,
				weaponDescription,
				damageString,
				refireDelayString,
				shortWeaponDescription,
			},

			turnRateRating: () => {
				const { turnRate } = stats.handling;
				return turnRate > 40
					? `Excellent  (${turnRate})`
					: turnRate > 25
					? `Very Fast  (${turnRate})`
					: turnRate >= 20
					? `Fast (${turnRate})`
					: turnRate >= 15
					? `Slow (${turnRate})`
					: turnRate < 15
					? `Very Slow (${turnRate})`
					: "Error";
			},
			accuracyRating: () => {
				const { accuracy } = stats.handling;
				return accuracy < 0.25 || !accuracy
					? `Perfect  (${accuracy ? accuracy : `< 0.25`})`
					: accuracy <= 1
					? `Good (${accuracy})`
					: accuracy <= 2
					? `Poor (${accuracy})`
					: accuracy <= 3
					? `Very Poor (${accuracy})`
					: accuracy <= 10
					? `Terrible (${accuracy})`
					: "Error";
			},
			damageTypeEffect: () => {
				const { type } = stats.projectile;
				return type === "KINETIC"
					? ["200% vs Shields", "50% vs Armor"]
					: type === "ENERGY"
					? ["100% vs Shields", "100% vs Armor"]
					: type === "HIGH_EXPLOSIVE"
					? ["50% vs Shields", "200% vs Armor"]
					: type === "FRAGMENTATION"
					? ["25% vs Shields", "25% vs Armor"]
					: "Error with Damage Type Effect";
			},
		};
	};
	// Event Listeners
	#addEventListeners() {
		this.#weaponPopUpEntryHandler();
		this.#weaponPopUpTableHeaderHandler();
		this.#closeWeaponPopUpHandler();
	}
	#weaponPopUpTableHeaderHandler() {
		WeaponPopUpTableHeaderView.addClickHandler(
			EVENT_LISTENER_TARGET.TABLE_HEADER_ENTRY,
			EVENT_LISTENER_TYPE.CLICK,
			this.#weaponTableSorter
		);
	}
	#weaponPopUpEntryHandler() {
		WeaponPopUpTableView.addClickHandler(
			EVENT_LISTENER_TARGET.TABLE_ENTRIES,
			EVENT_LISTENER_TYPE.CLICK,
			this.#addCurrentWeaponToInstalledWeapons
		);
		WeaponPopUpTableView.addClickHandler(
			EVENT_LISTENER_TARGET.TABLE_ENTRIES,
			EVENT_LISTENER_TYPE.HOVER,
			this.#showAdditionalInformationOnHover
		);
	}
	#closeWeaponPopUpHandler() {
		WeaponPopUpContainerView.closePopUpContainerIfUserClickOutside(
			`.${classNames.tableContainer}`,
			WeaponPopUpContainerView._clearRender
		);
	}
}
