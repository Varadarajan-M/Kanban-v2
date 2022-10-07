import React from 'react';

const Loader = () => {
	return (
		<div className='loader__container'>
			<div className='lds-ellipsis'>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
			</div>
		</div>
	);
};

export default Loader;
