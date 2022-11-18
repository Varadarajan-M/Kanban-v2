import {
	LOGIN_URL,
	SIGN_UP_URL,
	PROJECT_URL,
	SAVE_PROJECT_URL,
	BOARD_URL,
	TASK_URL,
	SHARED_PROJECTS_URL,
	SHARE_PROJECT_URL,
	FETCH_USERS_URL,
	CLONE_PROJECT_URL,
} from './constants';
import { isStrNotFalsy } from '../lib';

// Local Storage

export const getUserToken = () => localStorage.getItem('authToken') ?? null;

export const getEmail = () => localStorage.getItem('authEmail') ?? null;

export const getUserName = () => localStorage.getItem('authUser') ?? null;

export const doesUserExist = () => isStrNotFalsy(getUserToken());

export const setToken = (v) => localStorage.setItem('authToken', v);

export const setEmail = (v) => localStorage.setItem('authEmail', v);

export const setUserName = (v) => localStorage.setItem('authUser', v);

// http

export const makeHttpReq = async (url, options = {}) => {
	try {
		const res = await fetch(url, options);
		const data = await res.json();
		return data;
	} catch (err) {
		console.log(err);
	}
};

export const makeHttpOptions = (method = 'GET', body = {}, authToken = null) => {
	const options = {
		method,
		headers: {
			'Content-Type': 'application/json',
			...(authToken !== null && { Authorization: `Bearer ${authToken}` }),
		},
		...(method !== 'GET' && { body: JSON.stringify(body) }),
	};
	return options;
};

export const isResOk = (res) => res?.ok;

export const login = async (userCreds, setAuthState) => {
	const res = await makeHttpReq(LOGIN_URL, makeHttpOptions('POST', userCreds));
	if (isResOk(res)) {
		setAuthState({
			isAuthenticated: true,
			user: {
				email: res?.payload?.email,
				username: res?.payload?.username,
			},
		});
		setEmail(res?.payload?.email);
		setToken(res?.payload?.token);
		setUserName(res?.payload?.username);
	}
	return res;
};
export const signup = async (userCreds) => {
	const res = await makeHttpReq(SIGN_UP_URL, makeHttpOptions('POST', userCreds));
	return res;
};

export const getAllProjects = async (accessToken) => {
	const res = await makeHttpReq(PROJECT_URL, makeHttpOptions('GET', {}, accessToken));
	return res;
};
export const getAllSharedProjects = async (accessToken) => {
	const res = await makeHttpReq(SHARED_PROJECTS_URL, makeHttpOptions('GET', {}, accessToken));
	return res;
};

export const getOneProject = async (projectId, accessToken) => {
	const res = await makeHttpReq(`${PROJECT_URL}/${projectId}`, makeHttpOptions('GET', {}, accessToken));
	return res;
};

export const createProject = async (body, accessToken) => {
	const res = await makeHttpReq(`${PROJECT_URL}`, makeHttpOptions('POST', body, accessToken));
	return res;
};

export const updateProject = async (projectId, body, accessToken) => {
	const res = await makeHttpReq(`${PROJECT_URL}/${projectId}`, makeHttpOptions('PATCH', body, accessToken));
	return res;
};

export const saveProject = async (projectId, body, accessToken) => {
	const res = await makeHttpReq(`${SAVE_PROJECT_URL}/${projectId}`, makeHttpOptions('PUT', body, accessToken));
	return res;
};

export const deleteProject = async (projectId, accessToken) => {
	const res = await makeHttpReq(`${PROJECT_URL}/${projectId}`, makeHttpOptions('DELETE', {}, accessToken));
	return res;
};

export const getSharedUsers = async (projectId, accessToken) => {
	const res = await makeHttpReq(`${PROJECT_URL}/${projectId}/sharedusers`, makeHttpOptions('GET', {}, accessToken));
	return res;
};

export const createBoard = async (projectId, body, accessToken) => {
	const res = await makeHttpReq(`${BOARD_URL}/${projectId}`, makeHttpOptions('POST', body, accessToken));
	return res;
};

export const updateBoard = async (projectId, boardId, body, accessToken) => {
	const res = await makeHttpReq(`${BOARD_URL}/${projectId}/${boardId}`, makeHttpOptions('PATCH', body, accessToken));
	return res;
};

export const createTask = async (boardId, body, accessToken) => {
	const res = await makeHttpReq(`${TASK_URL}/${boardId}`, makeHttpOptions('POST', body, accessToken));
	return res;
};

export const editTask = async (taskId, projectId, item, accessToken) => {
	const res = await makeHttpReq(`${TASK_URL}/${taskId}/project/${projectId}`, makeHttpOptions('PUT', { item }, accessToken));
	return res;
};

export const shareProject = async (projectId, body, accessToken) => {
	const res = await makeHttpReq(`${SHARE_PROJECT_URL}/${projectId}`, makeHttpOptions('PUT', body, accessToken));
	return res;
};

export const fetchUsers = async (name, accessToken) => {
	const res = await makeHttpReq(`${FETCH_USERS_URL}/?name=${name}`, makeHttpOptions('GET', {}, accessToken));
	return res;
};

export const cloneProject = async (projectId, accessToken) => {
	const res = await makeHttpReq(`${CLONE_PROJECT_URL}/${projectId}`, makeHttpOptions('POST', {}, accessToken));
	return res;
};
export const fetchOneUser = async (userId, accessToken) => {
	const res = await makeHttpReq(`${FETCH_USERS_URL}/${userId}`, makeHttpOptions('GET', {}, accessToken));
	return res?.payload ?? undefined;
};

export const unshareProject = async (projectId, accessToken) => {
	const res = await makeHttpReq(`${SHARE_PROJECT_URL}/${projectId}`, makeHttpOptions('DELETE', {}, accessToken));
	return res;
};
