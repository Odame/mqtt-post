import { useContext } from 'react';
import {
	buildContextProvider,
	createDataContext,
	createSetterContext,
	buildContextProviderHOC,
} from './utils';

// TODO: Remember the currently selected connection when the application is closed

const CurrConnectionIdContext = createDataContext<string | null>();
const CurrConnectionIdSetterContext = createSetterContext<string | null>();
const CurrConnectionIdProvider = buildContextProvider<string | null>(
	CurrConnectionIdContext,
	CurrConnectionIdSetterContext,
	null
);

export const withSelectedConnectionId = buildContextProviderHOC(
	CurrConnectionIdProvider
);

/** Hook which returns a function to get the currently selected connection's id  */
export const useSelectedConnectionId = () => {
	const currConnectionId = useContext(CurrConnectionIdContext);
	return currConnectionId as string | null;
};

/** Hook which returns a function that sets the currently selected connection's id */
export const useCurrConnectionIdSetter = () => {
	const setCurrConnectionId = useContext(CurrConnectionIdSetterContext);
	return setCurrConnectionId!;
};
