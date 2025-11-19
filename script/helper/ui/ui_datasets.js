const combineDataSet = (datasetTitle, datasetId) =>
	`${datasetTitle}="${datasetId}"`;

const TITLE = {
	NAV: {
		FORM: {
			BUTTONS: "data-nav-button-type",
		},
		DROPDOWN: "data-ship-id",
	},
	MAIN_POPUP: {
		WIPE_WARNING: "data-wipe-warning",
	},
};
const ID = {
	CONTINUE: "continue",
	RETURN: "return",
	SEARCH: "search",
	SAVE: "save",
};

const UI_DATASETS = {
	ONLY_ID: { ...ID },
	NAV: {
		FORM: {
			SEARCH: combineDataSet(TITLE.NAV.FORM.BUTTONS, ID.SEARCH),
			SAVE: combineDataSet(TITLE.NAV.FORM.BUTTONS, ID.SAVE),
		},
		DROPDOWN: {
			_BASE: TITLE.NAV.DROPDOWN,
			FUNC: (input) => {
				return combineDataSet(TITLE.NAV.DROPDOWN, input);
			},
		},
	},
	MAIN_POPUP: {
		WIPE_WARNING: {
			CONTINUE: combineDataSet(TITLE.MAIN_POPUP.WIPE_WARNING, ID.CONTINUE),
			RETURN: combineDataSet(TITLE.MAIN_POPUP.WIPE_WARNING, ID.RETURN),
		},
	},
};

export default UI_DATASETS;
