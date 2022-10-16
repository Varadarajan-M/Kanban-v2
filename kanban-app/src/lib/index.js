export const removeKey = (obj, key) => {
	const clone = structuredClone(obj);
	delete clone[[key]];
	return clone;
};

export const setValue = (obj, path, value) => {
	const newObj = obj;
	const patharray = path.split('.');
	const getVal = (obj, patharr, value) => {
		let key = obj[patharr[0]];
		if (typeof key === 'object' && patharr.length > 1) {
			return getVal(key, patharr.slice(1), value);
		}
		return obj;
	};
	let res = getVal(obj, patharray, value);
	res[patharray.at(-1)] = value;
	return newObj;
};

export const reorderList = (list, destIndex, item) => {
	list.splice(list.indexOf(item), 1);
	list.splice(destIndex, 0, item);
	return list;
};

export const removeAndAddToList = (sourceList, destList, destIndex, item) => {
	sourceList.splice(sourceList.indexOf(item), 1);
	destList.splice(destIndex, 0, item);
	return { sourceList, destList };
};

export const isStrEmpty = (v = '') => v.trim().length === 0;

export const isFalsy = (v) => v == undefined || v == null;

export const isNotFalsy = (v) => !isFalsy(v);

export const isStrFalsy = (v) => isFalsy(v) || isStrEmpty(v);

export const isStrNotFalsy = (v) => !isStrFalsy(v);

export const isArrayEmpty = (arr = []) => arr.length === 0;

export const hasKey = (obj = {}, key = '') => obj?.hasOwnProperty(key);

export const getCharacters = (text, numberOfChars = 2) =>
	text
		.split(' ')
		.slice(0, numberOfChars)
		.reduce((acc, character) => acc + character.charAt(0).toUpperCase(), '');

export const withDelay = (fn) => setTimeout(() => fn(), 50);

const colors = [
	'red',
	'#0c8cab',
	'blue',
	'violet',
	'indigo',
	'orange',
	'purple',
	'maroon',
	'magenta',
	'indianred',
	'pink',
	'deeppink',
];

export const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];
