import { createContext, useState } from 'react';

export const UIContext = createContext({
	loading: false,
	showSidebar: false,
});

const UIContextProvider = ({ children }) => {
	const [loading, setLoading] = useState(false);
	const [showSidebar, setShowSidebar] = useState(true);

	const startLoading = () => setLoading(true);
	const stopLoading = () => setLoading(false);
	const isLoading = loading;

	const toggleSidebar = () => setShowSidebar(!showSidebar);
	const closeSidebar = () => setShowSidebar(false);
	const openSidebar = () => setShowSidebar(true);

	return (
		<UIContext.Provider
			value={{
				isLoading,
				startLoading,
				stopLoading,
				showSidebar,
				toggleSidebar,
				closeSidebar,
				openSidebar,
			}}
		>
			{children}
		</UIContext.Provider>
	);
};

export default UIContextProvider;
