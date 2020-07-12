import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IClientOptions } from 'mqtt';

export type IConnectionOptions = {
	id: string;
	name: string;
	clientId: string;
	protocol: Pick<IClientOptions, 'protocol'>;
	hostname: string;
	port: number;
	path: string;
	username: string;
	password: string;
	connectTimeout: number;
	keepalive: number;
	cleanSession: boolean;
	autoReconnect: boolean;
	protocolVersion: 3 | 5;
	sessionExpiryInterval: number;
	receiveMaximum: number;
	topicAliasMaximum: number;
	ssl_tls: boolean;
	certSign: 'serverSigned' | 'selfSigned';
	caFile: string;
	clientCertFile: string;
	clientKeyFile: string;
	lastWillTopic: string;
	lastWillQoS: 0 | 1 | 2;
	lastWillRetain: boolean;
	lastWillPayload: string;
};

type IConnectionsListState = {
	selected: string | undefined;
	byId: Record<string, IConnectionOptions>;
};

const connectionsSlice = createSlice({
	name: 'connections',
	initialState: { selected: undefined, byId: {} } as IConnectionsListState,
	reducers: {
		addConnection: (state, action: PayloadAction<IConnectionOptions>) => {
			state.byId[action.payload.id] = action.payload;
		},
		deleteConnection: (state, action: PayloadAction<string>) => {
			if (state.selected === action.payload) {
				state.selected = Object.keys(state.byId)[0];
			}
			delete state.byId[action.payload];
		},
		updateConnectionOptions: (
			state,
			action: PayloadAction<{
				id: string;
				updates: Omit<Partial<IConnectionOptions>, 'id'>;
			}>
		) => {
			state.byId[action.payload.id] = {
				...state.byId[action.payload.id],
				...action.payload.updates,
			};
		},
	},
});

export const {
	addConnection,
	deleteConnection,
	updateConnectionOptions,
} = connectionsSlice.actions;

export default connectionsSlice.reducer;
