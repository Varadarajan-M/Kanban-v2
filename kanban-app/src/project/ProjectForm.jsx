import React from 'react';

export const ProjectForm = ({ onChange, value }) => {
	return (
		<div className='form-group'>
			<label className='form-label' htmlFor='name' style={{ marginBlock: '8px' }}>
				Project Name
			</label>
			<input
				value={value.name}
				onChange={onChange}
				className='form-input'
				type='text'
				name='name'
				id='name'
				placeholder='Untitled Project'
			/>
		</div>
	);
};

export default ProjectForm;
