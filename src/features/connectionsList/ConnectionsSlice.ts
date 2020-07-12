import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IClientOptions } from 'mqtt';

type IConnection = {
	id: string;
	name: string;
	options: IClientOptions;
};
type IConnectionsListState = {
	selected: string | undefined;
	byId: Record<string, IConnection>;
};

const connectionsSlice = createSlice({
	name: 'connections',
	initialState: { selected: undefined, byId: {} } as IConnectionsListState,
	reducers: {
		addConnection: (state, action: PayloadAction<IConnection>) => {
			state.byId[action.payload.id] = action.payload;
		},
		deleteConnection: (state, action: PayloadAction<string>) => {
			delete state.byId[action.payload];
		},
		updateConnectionOptions: (
			state,
			action: PayloadAction<{ id: string; updates: Partial<IClientOptions> }>
		) => {
			state.byId[action.payload.id].options = {
				...state.byId[action.payload.id].options,
				...action.payload.updates,
			};
		},
		updateConnectionName: (
			state,
			action: PayloadAction<{ id: string; name: string }>
		) => {
			state.byId[action.payload.id].name = action.payload.name;
		},
	},
});

export const {
	addConnection,
	deleteConnection,
	updateConnectionOptions,
	updateConnectionName,
} = connectionsSlice.actions;

export default connectionsSlice.reducer;
