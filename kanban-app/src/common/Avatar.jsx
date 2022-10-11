import React from 'react';
import { getCharacters } from '../lib';

const Avatar = React.forwardRef(({ text, onClick }, ref) => {
	return (
		<svg
			onClick={onClick}
			style={{ cursor: 'pointer' }}
			ref={ref}
			xmlns='http://www.w3.org/2000/svg'
			width='40px'
			height='40px'
			viewBox='0 0 64 64'
			version='1.1'
		>
			<circle fill='#202124' width='40' height='40' cx='32' cy='32' r='32' />
			<text
				x='50%'
				y='50%'
				style={{
					color: '#ffffff',
					lineHeight: 1,
					fontFamily:
						"-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
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
