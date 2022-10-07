import React from 'react';
import Navbar from '../navbar/Navbar';
import Boards from '../boards/Boards';
import ProjectContextProvider from '../context/ProjectContext';
import ProjectSidebar from '../project/ProjectSidebar';
import UIContextProvider from '../context/UIContext';

const UserData = () => {
	return (
		<UIContextProvider>
			<ProjectContextProvider>
				<Navbar />
				<ProjectSidebar />
				<Boards />
			</ProjectContextProvider>
		</UIContextProvider>
	);
};
export default UserData;
