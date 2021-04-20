import {AXIOS_REQUEST, Set_reducer, set_page} from "../auth/index"
import {toast} from "react-toastify"
// import {} from "../auth/index"
// import {history} from "../../../history"

export const createPokerRoom = (data, params) => {
    return async dispatch => {
        var response = await AXIOS_REQUEST("/poker/createPokerRoom", data);
        if (response.status) {
            toast.success("Room is created successfully!");
            Set_reducer(dispatch,params,response,"POKER_ROOMS");
        } else {
            toast.error(response.data);
        }
    }
}

export const getData = (params) => {
    return async dispatch => {
        var rdata = await AXIOS_REQUEST("poker/getRoomList",{},dispatch,true);
        if(rdata.status){
            Set_reducer(dispatch,params,rdata,"POKER_ROOMS");
        }
    }
}

export const deleteData = (data, params) => {
    return async dispatch => {
        var response = await AXIOS_REQUEST("/poker/deletePokerRoom", data);
        if (response.status) {
            if (response.status) {
                toast.success("Room is deleted successfully!");
                Set_reducer(dispatch,params,response,"POKER_ROOMS");
            } else {
                toast.error(response.data);
            }
        }
    }
}

export const updatePokerRoom = (data, params) => {
    return async dispatch => {
        var response = await AXIOS_REQUEST("/poker/updatePokerRoom", data);
        if (response.status) {
            toast.success("Room is updated successfully!");
            Set_reducer(dispatch,params,response,"POKER_ROOMS");
        } else {
            toast.error(response.data);
        }
    }
}

export const filterData = (value,bool) => {
    return dispatch => dispatch({ type: "POKER_ROOM_FILTER_DATA", value : value,bool : bool })
}

export const pagenationchange = (params)=>{
    return (dispatch,getState)=>{
        var row = {
            data : getState().userslist.users.allData
        }
        var rows =  set_page(params,row)
        var fdata = rows['fdata'];
        var totalPages = rows['totalPages'];
        dispatch({ type:"POKER_ROOM_SET_PAGENATION",data: fdata,totalPages:totalPages,params})
    }
}