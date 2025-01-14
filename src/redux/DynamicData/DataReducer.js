import * as actions from './DataType';


const initialState = {
    data :{}
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actions.DATA:
            return {
                ...state,
                data :{...state.data,...action.payload}
            }
        default:
            return state;
    }
}
export default reducer;