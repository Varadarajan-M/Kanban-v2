import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ProjectContext } from '../context/ProjectContext';
import { UIContext } from './../context/UIContext';

// context hooks
export const useAuth = () => useContext(AuthContext);

export const useProjectData = () => useContext(ProjectContext);

export const useUI = () => useContext(UIContext);

// temp hooks
export const useInstantUpdate = (setterFn) => {
	const [loading, setLoading] = useState(true);

	const performInstantUpdate = (updatedData) => {
		setterFn(updatedData);
		setTimeout(() => setLoading(!loading), 100);
	};

	return { performInstantUpdate };
};

export const useKeyboardNavigation = ({ onEnter, dataset }) => {
	const [cursor, setCursor] = useState(-1);

	const keyDownHandler = (e) => {
		switch (e.key) {
			case 'Backspace':
				setCursor(-1);
				break;
			case 'Enter':
				if (cursor > -1 && cursor < dataset.length) {
					onEnter(cursor);
					setCursor(-1);
				}
				break;
			case 'ArrowDown':
				if (cursor < dataset.length - 1) {
					setCursor((c) => c + 1);
				} else if (cursor === dataset.length - 1) {
					setCursor((c) => 0);
				} else {
					return;
				}
				break;
			case 'ArrowUp':
				if (cursor > 0) {
					setCursor((c) => c - 1);
				} else if (cursor === 0) {
					setCursor((c) => dataset.length - 1);
				} else {
					return;
				}
				break;
			default:
				return;
		}
	};

	return [cursor, setCursor, keyDownHandler];
};

export const useLog = (value) => {
	useEffect(() => {
		console.log(`Value changed, new value: ${JSON.stringify(value, null, 2)}`);
	}, [value]);
};

export const useDebounceValue = (value, ms) => {
	const [debouncedValue, setDebouncedValue] = useState(value);
	useEffect(() => {
		let timer = setTimeout(() => setDebouncedValue(value), ms);
		return () => clearTimeout(timer);
	}, [value, ms]);
	return debouncedValue;
};
