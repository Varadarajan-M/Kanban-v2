import React, { useState, useEffect } from 'react';
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

export default {
	AddProjectModal: withProjectDetails(AddProjectModal),
	EditProjectModal: withProjectDetails(EditProjectModal),
};
