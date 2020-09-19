import React, { useContext } from 'react';

const SidePaneCollapsedStateContext = React.createContext(false);
SidePaneCollapsedStateContext.displayName = 'SidePaneCollapsedStateContext';

export const SidePaneCollapsedStateContextProvider =
	SidePaneCollapsedStateContext.Provider;

export const useIsSidePaneCollapsed = () => {
	const collapsed = useContext(SidePaneCollapsedStateContext);
	return collapsed;
};
