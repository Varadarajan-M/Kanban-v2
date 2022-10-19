import React, { useState, useRef, useEffect } from 'react';
import { withDelay } from '../lib';

export function MenuContainer(props) {
	const classes = `custom-menu-container d-flex ${props.className ? props.className : ''}`;
	return <div className={classes}>{props.children}</div>;
}
export function Menu(props) {
	const ref = useRef(null);
	const [className, setClassName] = useState('custom-menu');

	const setActiveClass = () => setClassName('custom-menu active');

	useEffect(() => {
		const menuRef = ref?.current;
		if (menuRef) {
			menuRef.focus();
			withDelay(setActiveClass);
		}
	}, []);

	return (
		<div ref={ref} onBlur={props.onBlur} tabIndex={0} className={className} style={{ ...props?.style }}>
			<ul>{props.children}</ul>
		</div>
	);
}

export function MenuItem(props) {
	return <li onClick={props.onClick}>{props.children}</li>;
}
