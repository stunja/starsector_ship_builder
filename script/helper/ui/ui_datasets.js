const combineDataSet = (datasetTitle, datasetId) =>
	`${datasetTitle}="${datasetId}"`;

const TITLE = {
	MAIN_POPUP: {
		WIPE_WARNING: "data-wipe-warning",
	},
};
const ID = {
	CONTINUE: "continue",
	RETURN: "return",
};
const UI_DATASETS = {
	MAIN_POPUP: {
		WIPE_WARNING: {
			CONTINUE: combineDataSet(TITLE.MAIN_POPUP.WIPE_WARNING, ID.CONTINUE),
			RETURN: combineDataSet(TITLE.MAIN_POPUP.WIPE_WARNING, ID.RETURN),
		},
	},
};

export default UI_DATASETS;
