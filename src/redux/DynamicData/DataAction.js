import * as actions from './DataType';

export const setdata = data => {
    return {
        type: actions.DATA,
        payload: data
    }
}