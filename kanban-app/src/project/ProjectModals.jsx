import React, { useState, useEffect, useRef } from 'react';
import Modal from '../common/Modal';
import { useProjectData } from '../hooks';
import { isNotFalsy } from '../lib';
import { ProjectForm } from './ProjectForm';

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
		addProject(project);
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
	const [searchTerm, setSearchTerm] = useState('');
	const [sharedUsers, setSharedUsers] = useState(props.sharedUsers ?? []);
	const [suggestions, setSuggestions] = useState([]);
	const [cursor, setCursor] = useState(-1);
	const itemRef = useRef(null);

	const DEMO_USERS = [
		{
			username: 'joey',
			email: 'joey@gmail.com',
		},
		{
			username: 'ross',
			email: 'ross@gmail.com',
		},
		{
			username: 'phoebe',
			email: 'phoebe@gmail.com',
		},
		{
			username: 'mike',
			email: 'mike@gmail.com',
		},
		{
			username: 'chandler',
			email: 'chandler@gmail.com',
		},
	];

	const searchHandler = (e) => {
		const { value } = e.target;
		setSearchTerm((v) => value);

		setSuggestions((_) => DEMO_USERS.filter((u) => u.username?.toLowerCase().includes(value.toLowerCase())));
	};

	const onSelect = (idx) => {
		setSharedUsers((users) => [...users, suggestions[idx].username]);
		setSearchTerm('');
		setSuggestions([]);
		setCursor(-1);
	};

	const keyUpHandler = (e) => {
		switch (e.key) {
			case 'Backspace':
				setCursor(-1);
				break;
			case 'Enter':
				if (cursor > -1 && cursor < suggestions.length && suggestions.find((s) => searchTerm === s.username)) {
					setSharedUsers((users) => [...users, suggestions[cursor].username]);
					setSearchTerm('');
					setSuggestions([]);
					setCursor(-1);
				}
				break;
			case 'ArrowDown':
				if (cursor < suggestions.length - 1) {
					setCursor((c) => c + 1);
				} else if (cursor === suggestions.length - 1) {
					setCursor((c) => 0);
				} else {
					return;
				}
				break;
			case 'ArrowUp':
				if (cursor > 0) {
					setCursor((c) => c - 1);
				} else if (cursor === 0) {
					setCursor((c) => suggestions.length - 1);
				} else {
					return;
				}
				break;
			default:
				return;
		}
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

	return (
		<div className='shareProjectModal'>
			<Modal {...props}>
				<div className='search-box'>
					<label htmlFor='search'>Share with</label>
					<input
						onKeyDown={keyUpHandler}
						onChange={searchHandler}
						value={searchTerm}
						type='text'
						id='search'
						className='form-input'
						autoComplete='off'
					/>

					<div className='suggestions'>
						{suggestions.map((suggestion, i) => (
							<p
								onClick={() => onSelect(i)}
								ref={i === cursor ? itemRef : null}
								key={i}
								style={{ paddingBlock: '10px', paddingLeft: '8px', background: i === cursor ? 'black' : '' }}
							>
								{' '}
								{suggestion.username}{' '}
							</p>
						))}
					</div>
				</div>
				{!!!suggestions.length && !!sharedUsers.length && (
					<div className='chip-input-container'>
						<div>
							{sharedUsers.map((user, i) => (
								<span key={i} className='chip'>
									{user} <span className='btn btn-clear'></span>
								</span>
							))}
						</div>
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
