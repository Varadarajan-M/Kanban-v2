import React, { useState, useRef, useEffect } from 'react';

export function MenuContainer(props) {
	return <div className='custom-menu-container d-flex'>{props.children}</div>;
}

export function Menu(props) {
	const ref = useRef(null);
	useEffect(() => {
		const menuRef = ref?.current;
		if (menuRef) {
			menuRef.focus();
		}
	}, []);

	return (
		<div ref={ref} onBlur={props.onBlur} tabIndex={0} className='custom-menu active'>
			<ul>{props.children}</ul>
		</div>
	);
}

export function MenuItem(props) {
	return <li onClick={props.onClick}>{props.children}</li>;
}
