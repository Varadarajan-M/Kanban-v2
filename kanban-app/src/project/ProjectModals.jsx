import React, { useState, useEffect, useRef } from 'react';
import Modal from '../common/Modal';
import { useDebounceValue, useKeyboardNavigation, useLog, useProjectData } from '../hooks';
import { isNotFalsy, isStrFalsy, isStrEmpty, isArrayEmpty } from '../lib';
import { ProjectForm } from './ProjectForm';
import Icon from '../common/Icon';
import { getSharedUsers, getUserToken, isResOk, shareProject } from '../api/helper';
import { fetchUsers } from './../api/helper';
import Avatar from '../common/Avatar';

// HOC which provides the project details
const withProjectDetails = (Component) => {
	return (props) => {
		const [project, setProject] = useState({ name: '' });

		useEffect(() => {
			if (isNotFalsy(props.defaultValues?.name)) setProject({ name: props.defaultValues.name });
		}, [props.defaultValues?.name]);

		const changeHandler = (e) => setProject((p) => ({ ...p, [e.target.name]: e.target.value }));

		const clearValue = (key) => setProject((p) => ({ ...p, [key]: '' }));

		return <Component project={project} clearValue={clearValue} changeHandler={changeHandler} {...props} />;
	};
};

const AddProjectModal = ({ project, clearValue, changeHandler, ...restProps }) => {
	const { addProject } = useProjectData();
	const onAdd = () => {
		isStrFalsy(project?.name) ? addProject({}) : addProject(project);
		clearValue('name');
		restProps.onBackdropClick();
	};
	const modalProps = { ...restProps, onPrimaryClick: onAdd };
	return (
		<Modal {...modalProps}>
			<ProjectForm value={project} onChange={changeHandler} />
		</Modal>
	);
};

const EditProjectModal = ({ project, clearValue, changeHandler, ...restProps }) => {
	const { editProject } = useProjectData();
	const onEdit = () => {
		editProject(project);
		clearValue('name');
		restProps.onBackdropClick();
	};
	const modalProps = { ...restProps, onPrimaryClick: onEdit };
	return (
		<Modal {...modalProps}>
			<ProjectForm value={project} onChange={changeHandler} />
		</Modal>
	);
};

const ShareProjectModal = (props) => {
	const { activeProject } = useProjectData();
	const [searchTerm, setSearchTerm] = useState('');
	const [suggestions, setSuggestions] = useState([]);
	const itemRef = useRef(null);
	const [sharedUsers, setSharedUsers] = useState([]);
	const [emptyResultMessage, setEmptyResultMessage] = useState(false);
	const [loading, setLoading] = useState(false);

	// to prevent api calls for each key stroke
	const debouncedSearchTerm = useDebounceValue(searchTerm, 700);

	const getAllSharedUsers = async (projectId) => {
		const res = await getSharedUsers(projectId, getUserToken());
		isArrayEmpty(res?.payload) ? setSharedUsers((_) => []) : setSharedUsers((_) => res.payload[0].users);
	};

	const searchHandler = (e) => {
		const { value } = e.target;
		setSearchTerm((v) => value);
		setCursor(-1);
	};

	const clearSearchTerm = () => setSearchTerm('');
	const onSelection = (idx) => {
		!sharedUsers.find((s) => suggestions[idx]._id === s._id) && setSharedUsers((users) => [...users, suggestions[idx]]);
		clearSearchTerm();
		setSuggestions([]);
	};

	const onEnter = (idx) => suggestions.find((s) => searchTerm === s.username) && onSelection(idx);

	const [cursor, setCursor, keyDownHandler] = useKeyboardNavigation({ onEnter: onEnter, dataset: suggestions });

	const removeSharedUser = (idx) => setSharedUsers((users) => users.filter((_, i) => i !== idx));

	const clearModal = () => {
		clearSearchTerm();
		setEmptyResultMessage(false);
		props.onBackdropClick();
	};
	const shareProjectWithUsers = async () => {
		const users = sharedUsers.map((user) => user._id);
		const res = await shareProject(activeProject, { users }, getUserToken());
		isResOk(res) ? clearModal() : alert(res.error?.message);
	};

	useEffect(() => {
		if (!!suggestions.length && cursor !== -1 && cursor < suggestions.length) {
			setSearchTerm(suggestions[cursor]?.username);
			itemRef.current?.scrollIntoView();
		}
	}, [cursor, suggestions]);

	useEffect(() => {
		props.open ? (document.body.style.overflow = 'hidden') : (document.body.style.overflow = 'auto');
	}, [props.open]);

	useEffect(() => {
		isStrEmpty(searchTerm) && setSuggestions([]);
	}, [searchTerm]);

	// calls api only when the debouncedValue of searchTerm is changed
	useEffect(() => {
		setEmptyResultMessage(false);
		!isStrEmpty(debouncedSearchTerm) &&
			cursor === -1 &&
			fetchUsers(debouncedSearchTerm, getUserToken()).then((res) => {
				if (isResOk(res)) {
					if (isArrayEmpty(res.payload)) {
						setEmptyResultMessage(true);
						setSuggestions([]);
					} else setSuggestions(() => res.payload);
				} else {
					alert(res.error?.message ?? 'Something went wrong');
				}
			});
	}, [debouncedSearchTerm]);

	useEffect(() => {
		if (isNotFalsy(activeProject) && props.open) {
			setLoading(() => true);
			getAllSharedUsers(activeProject);
			setLoading(() => false);
		}
	}, [activeProject, props.open]);

	return (
		<div className='shareProjectModal'>
			<Modal {...props} onPrimaryClick={shareProjectWithUsers} onBackdropClick={clearModal} onSecondaryClick={clearModal}>
				<div className='search-box'>
					<label htmlFor='search'>Share with</label>
					<div className='input-wrapper'>
						<input
							onKeyDown={keyDownHandler}
							onChange={searchHandler}
							value={searchTerm}
							type='text'
							id='search'
							className='form-input'
							autoComplete='off'
							placeholder='Start typing the username...'
						/>
						<Icon tooltip={'Clear '} onClick={clearSearchTerm} type='close' />
					</div>
					{emptyResultMessage ? <small>No user found...</small> : ''}

					<div className='suggestions'>
						{suggestions.map((suggestion, i) => (
							<div
								className='user-suggestion'
								onClick={() => onSelection(i)}
								ref={i === cursor ? itemRef : null}
								key={i}
								style={{ paddingBlock: '10px', paddingLeft: '8px', background: i === cursor ? 'black' : '' }}
							>
								<Avatar text={suggestion.username} />
								<div>
									<p> {suggestion.username} </p>
									<small className='text-gray'> {suggestion.email} </small>
								</div>
							</div>
						))}
					</div>
				</div>
				{!!!suggestions.length && !!sharedUsers.length && !loading && (
					<div className='chip-input-container'>
						<div>
							{sharedUsers.map((user, i) => (
								<span key={i} className='chip'>
									{user.username} <span className='btn btn-clear' onClick={() => removeSharedUser(i)}></span>
								</span>
							))}
						</div>
					</div>
				)}
				{!!!suggestions.length && !!sharedUsers.length && loading && (
					<div
						className='w-100 h-100 d-flex justify-center align-center '
						style={{ marginTop: '-20px', fontWeight: 600 }}
					>
						loading...
					</div>
				)}

				{!!!sharedUsers.length && !!!suggestions.length && !loading && (
					<div
						className='w-100 h-100 d-flex justify-center align-center '
						style={{ marginTop: '-20px', fontWeight: 600 }}
					>
						No users...
					</div>
				)}
			</Modal>
		</div>
	);
};

export default {
	AddProjectModal: withProjectDetails(AddProjectModal),
	EditProjectModal: withProjectDetails(EditProjectModal),
	ShareProjectModal,
};
