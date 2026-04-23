export const UI_ERRORS = {
	ISSUE: {
		MARKUP: (file) => `[${file}.js] - Markup issue`,
	},
	MISSING: {
		CLASS: (file) => `[${file}.js] - Cant find className`,
		ELEMENT: (file, element) =>
			`[${file}.js] - Cant find Target Element [${element}]`,
	},
};
