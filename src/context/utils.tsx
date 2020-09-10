import React, { useContext, useState } from 'react';

export function buildContextHook<T>(context: React.Context<T>) {
	return () => {
		const contextValue = useContext(context);
		if (contextValue === undefined)
			throw Error(
				`This hook can only be used in the scope of ${
					context.displayName || 'Context'
				}.Provider`
			);

		return contextValue!;
	};
}

export function createDataContext<T>(displayName?: string) {
	const context = React.createContext<T | undefined>(undefined);
	context.displayName = displayName;
	return context;
}
export function createSetterContext<T>(displayName?: string) {
	const context = React.createContext<
		undefined | React.Dispatch<React.SetStateAction<T | undefined>>
	>(undefined);
	context.displayName = displayName;
	return context;
}

export function buildContextProvider<T>(
	dataContext: React.Context<T | undefined>,
	setterContext: React.Context<
		undefined | React.Dispatch<React.SetStateAction<T | undefined>>
	>,
	initialValue?: T
): React.FunctionComponent {
	return React.memo((props) => {
		const [state, setState] = useState<T | undefined>(initialValue);
		return (
			<setterContext.Provider value={setState}>
				<dataContext.Provider value={state}>
					{props.children}
				</dataContext.Provider>
			</setterContext.Provider>
		);
	});
}
