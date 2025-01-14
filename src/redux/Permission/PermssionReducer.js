import * as actions from './PermssionType';


const initialState = {
    permission :[],
    screens:[]
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actions.SETPERMISSION:
            return {
                ...state,
                permission :action.payload
            }
        case actions.ALLSCREEN:
            return {
                ...state,
                screens :action.payload
            }
        default:
            return state;
    }
}
export default reducer;