export const UI_ERRORS = {
	ISSUE: {
		MARKUP: (file) => `[${file}.js] - Markup issue`,
	},
	MISSING: {
		CLASS: (file) => `[${file}.js] - Cant find className`,
		ELEMENT: (file, element) =>
			`[${file}.js] - Cant find Target Element [${element}]`,
	},
	LISTEN: {
		LISTEN_BEFORE_RENDER: (file) =>
			`[${file}.js] - Listener fires before renderer / before mounted`,
	},
	NOT_IMPLEMENTED: {
		METHOD: (file, methodName) =>
			`[${file}.js] - method [${methodName}()] was not implemented`,
	},
};
