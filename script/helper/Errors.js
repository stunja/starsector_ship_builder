// Class Name => Javascript Class
// Method Name => function name

//
export const ERROR_MSG = {
	//
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
	EVENT_MANAGER: {
		DOM_TARGET_CLASS: (options = {}) =>
			`${errorLocationMarkup(options)} DOM Target Class is Missing`,
		CALLBACK: "callback is Missing",
	},
};
