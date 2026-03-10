import Papa from "papaparse";
import {
	renameKeysFromCSVdata,
	convertStringsIntoNumbersCSVdata,
} from "../helper/helper_functions.js";

export const cvsFetcher = {
	fetch: async function (url) {
		const csvData = await this.fetchData(url);
		const convertedData = await this.papaDataConverter(csvData);
		const dataWithConvertedKeys = convertedData.map(renameKeysFromCSVdata);
		const exportData = convertStringsIntoNumbersCSVdata(dataWithConvertedKeys);
		return exportData;
	},
	fetchData: async function (url) {
		const res = await fetch(url);

		if (!res.ok) {
			throw new Error(`HTTP error! status: ${res.status}`);
		}
		return await res.blob();
	},
	papaDataConverter(data) {
		return new Promise((resolve, reject) => {
			Papa.parse(data, {
				header: true,
				complete: (results) => {
					resolve(results.data);
				},
				error: (err) => {
					reject(err);
				},
			});
		});
	},
};
export const jsonFetcher = {
	fetch: async function (url) {
		const csvData = await this.fetchData(url);
		const dataNormalized = JSON.parse(csvData);
		return dataNormalized;
	},
	fetchData: async function (url) {
		const res = await fetch(url);

		if (!res.ok) {
			throw new Error(`HTTP error! status: ${res.status}`);
		}
		return await res.text();
	},
};
