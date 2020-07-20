import { User } from '../../models/User';

export interface UsersState {
    users: User[];
    status: 'idle' | 'loading' | 'error';
    error?: string;
    userProfile: User
}
