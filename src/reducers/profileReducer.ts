import createReducer from '../utils/createReducer';
import {
    GET_USERS_ME_SUCCESS,
} from '../actions/types';
import {ILoginResponse, User} from '../models/ILoginResponse.ts';

export interface IProfileState {
    user: ILoginResponse
}
const initialState: IProfileState = {
    user: new User(),
};
const profileReducer = createReducer(
    {
        ...initialState,
    },
    {
        [GET_USERS_ME_SUCCESS](state: IProfileState, action: any) {
            return {
                ...state,
                user: {...action.payload},
            };
        },
    },
);
export default profileReducer;
