import { createContext, useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
	isResOk,
	getUserToken,
	createBoard,
	updateBoard,
	getAllProjects,
	getOneProject,
	saveProject,
	createTask,
	createProject,
	updateProject,
	deleteProject,
} from '../api/helper';

import { isStrFalsy, isArrayEmpty, removeKey, setValue } from '../lib';
import { useInstantUpdate, useAuth, useUI } from '../hooks';
import { isNotFalsy } from './../lib/index';

export const ProjectContext = createContext({});

const ProjectContextProvider = ({ children }) => {
	const [projectList, setProjectList] = useState([]);
	const [projectDetails, setProjectDetails] = useState({});
	const [saveState, setSaveState] = useState('disabled');
	const [deletedStack, setDeletedStack] = useState({ boards: [], tasks: [] });
	const [modifiedBoards, setModifiedBoards] = useState(new Set([]));

	const isSaveDisabled = saveState === 'disabled';

	const [activeProject, setActiveProject] = useState(null);

	const navigate = useNavigate();
	const { startLoading, stopLoading } = useUI();
	const { clearAuthState } = useAuth();
	const { performInstantUpdate } = useInstantUpdate(setProjectDetails);

	const addToModifiedBoards = (boardPosition) => {
		setModifiedBoards((prev) => {
			const prevList = new Set(prev);
			prevList?.add(boardPosition);
			return prevList;
		});
	};

	const removeFromModifiedBoards = (boardPosition) => {
		setModifiedBoards((prev) => {
			const prevList = new Set(prev);
			prevList?.delete(boardPosition);
			return prevList;
		});
	};

	const clearModifiedBoards = () => {
		setModifiedBoards((_) => new Set([]));
	};

	const switchProject = (projectId) => {
		if (!isSaveDisabled) {
			if (window.confirm('Your changes are not saved. Do you want to save and switch project?')) {
				saveChanges();
				setActiveProject(projectId);
			}
			return;
		}
		setActiveProject(projectId);
	};

	const addProject = async (project) => {
		const res = await createProject(project, getUserToken());
		if (isResOk(res)) {
			setProjectList((p) => [res.payload, ...p]);
			isSaveDisabled && setActiveProject(res.payload._id);
		}
	};
	const editProject = async (project) => {
		if (!project.name) return;
		const res = await updateProject(projectDetails._id, project, getUserToken());
		if (isResOk(res)) {
			setProjectList((proj) => proj.map((p) => (p._id === projectDetails._id ? { ...p, name: project?.name } : p)));
			setProjectDetails((proj) => ({ ...proj, name: project?.name }));
		}
	};

	const removeProject = async () => {
		const deletedProjectIdx = projectList.map((p) => p._id).indexOf(projectDetails._id);

		setProjectList((prevProjectList) => prevProjectList.filter((_, index) => index !== deletedProjectIdx));

		let currentFocus = deletedProjectIdx === 0 ? deletedProjectIdx + 1 : deletedProjectIdx - 1;

		projectList.length > 1 ? setActiveProject(projectList[currentFocus]._id) : setActiveProject(null);

		const res = await deleteProject(projectDetails._id, getUserToken());
	};

	const getProjectInfo = async (projectId) => {
		startLoading();
		const res = await getOneProject(projectId, getUserToken());
		if (isResOk(res)) {
			setProjectDetails(res.payload);
			stopLoading();
		} else {
			navigate('/');
		}
	};

	const getProjectList = async () => {
		const res = await getAllProjects(getUserToken());
		if (isResOk(res)) {
			if (!isArrayEmpty(res?.payload)) {
				setActiveProject(res.payload[0]?._id);
				setProjectList(res.payload);
			}
		} else {
			clearAuthState();
			navigate('/login', { replace: true });
		}
	};

	const deleteBoardInfo = useCallback((boardPosition) => {
		setProjectDetails((project) => ({
			...project,
			boards: removeKey(project.boards, boardPosition),
		}));
		setSaveState('enabled');
	}, []);

	const editBoardName = async (boardPosition, value) => {
		if (isStrFalsy(value)) return;
		const boardData = {
			name: value,
		};
		const res = await updateBoard(projectDetails._id, projectDetails.boards[boardPosition]._id, boardData, getUserToken());
		if (!res?.ok) {
			alert(res?.error?.message);
			return;
		}
		performInstantUpdate(setValue(projectDetails, `boards.${boardPosition}.name`, value));
	};

	const addNewBoard = async (value) => {
		if (isStrFalsy(value)) return;
		const board = {
			name: value,
		};
		const res = await createBoard(projectDetails._id, board, getUserToken());

		if (isResOk(res)) {
			setProjectDetails((p) => ({
				...p,
				boards: {
					...p.boards,
					[res?.payload?.position]: {
						...res?.payload,
						tasks: [],
					},
				},
			}));
		} else {
			alert(res?.error?.message);
		}
	};

	const saveChanges = async () => {
		const payload = { tasks: [], deletedStack };
		setSaveState('saving');
		Object.entries(projectDetails.boards).forEach(([key, board]) => {
			if (modifiedBoards.has(key)) {
				const tasks = board.tasks.reduce((ac, task, index) => [...ac, { ...task, position: index }], []);
				payload.tasks.push(tasks);
			}
		});
		payload.tasks = payload.tasks.flat();

		const projectId = projectDetails._id;
		const res = await saveProject(projectId, payload, getUserToken());

		if (isResOk(res)) setSaveState('disabled');
		clearModifiedBoards();
	};

	// task methods

	const addNewTask = async (task, boardPosition) => {
		const newTask = {
			item: task,
		};
		const res = await createTask(projectDetails.boards[boardPosition]._id, newTask, getUserToken());
		if (isResOk(res)) {
			setProjectDetails((project) => ({
				...project,
				boards: {
					...project.boards,
					[boardPosition]: {
						...project.boards[boardPosition],
						tasks: [...project.boards[boardPosition]?.tasks, res.payload],
					},
				},
			}));
		}
	};

	const deleteTask = (task, boardPosition) => {
		setProjectDetails((project) => ({
			...project,
			boards: {
				...project.boards,
				[boardPosition]: {
					...project.boards[boardPosition],
					tasks: project.boards[boardPosition].tasks.filter((t) => t._id !== task._id),
				},
			},
		}));
		setSaveState('enabled');
	};

	const editTask = (boardPosition, taskId, value) => {
		if (isStrFalsy(value)) return;

		setProjectDetails((project) => ({
			...project,
			boards: {
				...project.boards,
				[boardPosition]: {
					...project.boards[boardPosition],
					tasks: project.boards[boardPosition].tasks.map((task) =>
						task._id === taskId ? { ...task, item: value } : task,
					),
				},
			},
		}));
		setSaveState('enabled');
	};

	const updateListOrder = (key, taskArray) => {
		setProjectDetails((project) => ({
			...project,
			boards: {
				...project.boards,
				[key]: {
					...project.boards[key],
					tasks: taskArray,
				},
			},
		}));
		setSaveState('enabled');
	};

	useEffect(() => {
		if (isNotFalsy(activeProject)) getProjectInfo(activeProject);
	}, [activeProject]);

	useEffect(() => {
		const beforeUnloadListener = (event) => {
			event.preventDefault();
			return (event.returnValue = 'Are you sure you want to exit?');
		};
		if (saveState === 'enabled') {
			window.addEventListener('beforeunload', beforeUnloadListener, {
				capture: true,
			});
		}

		if (saveState === 'disabled') {
			setDeletedStack({ boards: [], tasks: [] });
		}

		return () =>
			window.removeEventListener('beforeunload', beforeUnloadListener, {
				capture: true,
			});
	}, [saveState]);

	return (
		<ProjectContext.Provider
			value={{
				deleteBoardInfo,
				editBoardName,
				addNewBoard,
				saveState,
				setSaveState,
				deletedStack,
				setDeletedStack,
				saveChanges,
				addNewTask,
				deleteTask,
				editTask,
				updateListOrder,
				getProjectInfo,
				getProjectList,
				projectDetails,
				projectList,
				addProject,
				editProject,
				switchProject,
				removeProject,
				activeProject,
				addToModifiedBoards,
				removeFromModifiedBoards,
			}}
		>
			{children}
		</ProjectContext.Provider>
	);
};

export default ProjectContextProvider;
