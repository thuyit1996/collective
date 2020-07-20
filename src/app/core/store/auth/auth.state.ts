export interface AuthState {
	user: any,
	status: 'idle' | 'loading' | 'error',
	error?: string,
	isRegister?: boolean,
	registerPayload?: any,
}