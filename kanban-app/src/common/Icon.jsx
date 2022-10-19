import React from 'react';

const Icon = ({ type, tooltip, onClick, className, disabled }) => {
	const classes = `${className ?? 'icn'} material-symbols-outlined custom-icon`;
	return (
		<span
			style={{ pointerEvents: disabled ? 'none' : 'auto', opacity: disabled ? '0.5' : '1' }}
			onClick={onClick}
			title={tooltip}
			role='button'
			className={classes}
		>
			{type}
		</span>
	);
};

export default Icon;
