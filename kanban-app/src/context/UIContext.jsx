import { createContext, useState } from 'react';

export const UIContext = createContext({
	loading: false,
	showSidebar: false,
});

const UIContextProvider = ({ children }) => {
	const [loading, setLoading] = useState(false);
	const [showSidebar, setShowSidebar] = useState(false);

	const startLoading = () => setLoading(true);
	const stopLoading = () => setLoading(false);
	const isLoading = loading;

	const toggleSidebar = () => setShowSidebar(!showSidebar);

	return (
		<UIContext.Provider
			value={{
				isLoading,
				startLoading,
				stopLoading,
				showSidebar,
				toggleSidebar,
			}}
		>
			{children}
		</UIContext.Provider>
	);
};

export default UIContextProvider;
