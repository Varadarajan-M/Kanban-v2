import { useContext, useState } from 'react';
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
