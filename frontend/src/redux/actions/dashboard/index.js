import {AXIOS_REQUEST} from "../auth/index"
import {REVENUE,REVENUE_USERS} from "../../types/dashboard"

export const get_revenus_load = (dates,user)=>{
    return async(dispatch) =>{
        var rdata = await AXIOS_REQUEST("players/get_wallet_mainuser",{startDate : new Date(dates[0]).toDateString(),endDate :new Date(dates[1]).toDateString(),user : user},dispatch,true);
        if(rdata.status){
            dispatch({
                type : REVENUE,
                data : rdata.data
            })
        }else{

        }
    }
}

export const get_user_load = () =>{
    return async(dispatch) =>{
        var rdata = await AXIOS_REQUEST("dashboard/get_user_load",);
        if(rdata.status){
            dispatch({
                type : REVENUE_USERS,
                data : rdata.data
            })
        }else{

        }
    }
}