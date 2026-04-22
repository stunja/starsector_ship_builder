// _handleSystemError(className, target) {
// 	throw new Error(`Class ${className}: failed because ${target} is missing`);
// }
export const UI_ERRORS = {
	ELEMENT_NOT_FOUND: (className, element) =>
		`class ${className} failed because ${element} is missing`,
};
