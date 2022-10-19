import React, { useState } from 'react';
import { getCharacters, getRandomColor } from '../lib';

const Avatar = React.forwardRef(({ text, onClick }, ref) => {
	const [avatarFill] = useState(getRandomColor);
	return (
		<svg
			onClick={onClick}
			style={{ cursor: 'pointer', transition: 'none' }}
			ref={ref}
			xmlns='http://www.w3.org/2000/svg'
			width='40px'
			height='40px'
			viewBox='0 0 64 64'
			version='1.1'
		>
			<circle fill={avatarFill} width='40' height='40' cx='32' cy='32' r='32' />
			<text
				x='50%'
				y='50%'
				style={{
					color: '#ffffff',
					lineHeight: 1,
				}}
				alignmentBaseline='middle'
				textAnchor='middle'
				fontSize='26'
				fontWeight='400'
				dy='.1em'
				dominantBaseline='middle'
				fill='#ffffff'
			>
				{getCharacters(text)}
			</text>
		</svg>
	);
});

export default React.memo(Avatar);
