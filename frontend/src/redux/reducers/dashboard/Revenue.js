import {REVENUE,REVENUE_USERS} from "../../types/dashboard"

const initialState = {
    data : {},
    musers : []
}
  
export const Revenue = (state = initialState, action) => {
    switch (action.type) {
        case REVENUE :
            return {...state, data : action.data }
        case REVENUE_USERS :
            return {...state, musers : action.data }
        default:
            return state
    }
}