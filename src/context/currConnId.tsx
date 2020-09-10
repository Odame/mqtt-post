import { useContext } from 'react';
import {
	buildContextProvider,
	createDataContext,
	createSetterContext,
} from './utils';

// TODO: Remember the currently selected connection when the application is closed

const CurrConnectionIdContext = createDataContext<string>();
const CurrConnectionIdSetterContext = createSetterContext<string>();
export const CurrConnectionIdProvider = buildContextProvider<string>(
	CurrConnectionIdContext,
	CurrConnectionIdSetterContext,
	undefined
);

/** Hook which returns a function to get the currently selected connection's id  */
export const useSelectedConnectionId = () => {
	const currConnectionId = useContext(CurrConnectionIdContext);
	return currConnectionId!;
};

/** Hook which returns a function that sets the currently selected connection's id */
export const useCurrConnectionIdSetter = () => {
	const setCurrConnectionId = useContext(CurrConnectionIdSetterContext);
	return setCurrConnectionId;
};
