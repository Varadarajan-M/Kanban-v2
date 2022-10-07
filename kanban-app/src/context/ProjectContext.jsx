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
} from '../api/helper';

import { isStrFalsy, isArrayEmpty, removeKey, setValue } from '../lib';
import { useInstantUpdate, useAuth, useUI } from '../hooks';

export const ProjectContext = createContext({});

const ProjectContextProvider = ({ children }) => {
	const [projectList, setProjectList] = useState([]);
	const [projectDetails, setProjectDetails] = useState({});
	const [saveState, setSaveState] = useState('disabled');
	const [deletedStack, setDeletedStack] = useState({ boards: [], tasks: [] });

	const navigate = useNavigate();
	const { startLoading, stopLoading } = useUI();
	const { clearAuthState } = useAuth();
	const { performInstantUpdate } = useInstantUpdate(setProjectDetails);

	const addProject = async (project) => {
		if (!project.name) return;
		const res = await createProject(project, getUserToken());
		if (isResOk(res)) {
			setProjectList((p) => [res.payload, ...p]);
		}
	};
	const editProject = async (project) => {
		if (!project.name) return;
		const res = await updateProject(projectDetails._id, project, getUserToken());
		if (isResOk(res)) {
			setProjectList((proj) => proj.map((p) => (p._id === projectDetails._id ? { ...p, name: project?.name } : p)));
		}
	};

	const getProjectInfo = async (projectId) => {
		startLoading();
		const res = await getOneProject(projectId, getUserToken());
		if (isResOk(res)) {
			setProjectDetails(res.payload);
			stopLoading();
		} else {
			console.log('Response not okay');
		}
	};

	const getProjectList = async () => {
		const res = await getAllProjects(getUserToken());
		if (isResOk(res)) {
			if (!isArrayEmpty(res?.payload)) {
				getProjectInfo(res?.payload[0]._id);
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
			const tasks = board.tasks.reduce((ac, task, index) => [...ac, { ...task, position: index }], []);
			payload.tasks.push(tasks);
		});
		payload.tasks = payload.tasks.flat();

		const projectId = projectDetails._id;
		const res = await saveProject(projectId, payload, getUserToken());

		if (isResOk(res)) setSaveState('disabled');
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
			}}
		>
			{children}
		</ProjectContext.Provider>
	);
};

export default ProjectContextProvider;
