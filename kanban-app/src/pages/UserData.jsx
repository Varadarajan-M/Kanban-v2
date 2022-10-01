import React from 'react';
import Navbar from '../user-boards/Navbar';
import Boards from '../user-boards/Boards';
import { BoardDataContextProvider } from '../context/BoardDataContext';
import ProjectSidebar from '../project/ProjectSidebar';

const UserData = () => {
	return (
		<BoardDataContextProvider>
			<Navbar />
			<ProjectSidebar />
			<Boards />
		</BoardDataContextProvider>
	);
};
export default UserData;
