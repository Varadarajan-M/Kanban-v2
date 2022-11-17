import React from 'react';

const EmptyMessage = ({ children, style }) => {
	return (
		<div
			style={{
				width: '100%',
				textAlign: 'center',
				letterSpacing: '1px',
				transition: 'margin-left 0.2s ease-in 0s',
				...style,
			}}
		>
			{children}
		</div>
	);
};

export default EmptyMessage;
