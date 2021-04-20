import {AXIOS_REQUEST} from "../auth/index"
import {toast} from "react-toastify"


export const get_accountStatement =(date,user) =>{
    return async dispatch =>{
        var row = Object.assign({},date,{email : user.email})
        var rdata = await AXIOS_REQUEST("players/get_accountstatement",{row},dispatch,true)
        if(rdata.status){
            dispatch({
                type : "PROFILEINFOR_ACCOUNTSTATEMENT_LOAD",
                data : rdata.data
            })
        }else{

        }        
    }
}

export const profile_update = (users) =>{
    return async dispatch =>{
        var rdata = await AXIOS_REQUEST("players/profile_userupdate",{users : users},dispatch,true)
        if(rdata.status){
            toast.success("successfully updated");
            dispatch({
                type : "PROFILEINFOR_PROFILE_LOAD",
                data : rdata.data
            })
        }else{

        }
    }
}

export const profile_load = (user) =>{
    return async(dispatch) =>{
        var response = await AXIOS_REQUEST("players/profile_userload",{user});
        if(response.status){
            var row = Object.assign({},response.data);
            dispatch({
                type : "PROFILEINFOR_PROFILE_LOAD",
                data : row
            })
        }else{
          // alert(response.data.data)
        }
      }
}

export const transactionHistoryLoad = (email,params) => {
    return  async(dispatch) => {
        var res = await AXIOS_REQUEST("paymentGateWay/deposit_withdrawlhistoryload",email)
        if(res.status){
            // console.log(res);
            dispatch({ type : "PROFILEINFOR_DEPOSIT_LOAD", data : res.data })
        }else{  
            
        }
    }
}

export const WithdrawHistoryLoad = (email) => {
    return  async(dispatch) => {
        var res = await AXIOS_REQUEST("paymentGateWay/WithdrawHistoryLoad",email)
        if(res.status){
            dispatch({ type : "PROFILEINFOR_WITHDRAWL_LOAD", data : res.data })
        }else{
            // toast.error(res.data);   
        }
        
    }
}

export const reports_email_load = (datas) => {
    return  async(dispatch) => {
        var rdata = await AXIOS_REQUEST("reports/adminreports_email_load",datas)
        if(rdata.status){
            dispatch({ type: "PROFILEINFOR_MYBETS_LOAD",result : rdata.result,data : rdata.data });
        }else{
            // toast.error('No Record');   
        }
    }
}

export const satta_history_load = (datas) => {
    return  async(dispatch) => {
        var rdata = await AXIOS_REQUEST("satta/adminbethistory_email_load",datas)
        if(rdata.status){
            dispatch({
                type: "PROFILEINFOR_SATTA_LOAD",
                result : rdata.result,
                data : rdata.data
            });
        }else{
            // toast.error('No Record');   
        }
    }
}

export const mywallet_infor = (row,date) =>{
    return async dispatch =>{
        var rdata = await AXIOS_REQUEST("players/get_wallet_mainuser",{user: row,startDate : new Date(date[0]).toDateString(),endDate :new Date(date[1]).toDateString()});
        if(rdata.status){
            dispatch({
                type: "PROFILEINFOR_MYWALLET_LOAD",
                result : rdata.result,
                data : rdata.data
            });
        }else{
            // toast.error('No Record');   
        }
    }
}

export const get_wallet_profit = (e,user) =>{
    return async dispatch =>{
        var rdata = await AXIOS_REQUEST("players/get_wallet_profit",{start:e[0],end : e[1],user:user});
        if(rdata.status){
            dispatch({
                type: "PROFILEINFOR_MYWLLET_TOTAL",
                data : rdata.data
            });
        }else{
            
        }
    }
}

export const get_bets_profit = (e,user) =>{
    return async dispatch =>{
        var rdata = await AXIOS_REQUEST("players/get_bets_profit",{start:e[0],end : e[1],user:user});
        if(rdata.status){
            dispatch({
                type: "PROFILEINFOR_MYBETS_TOTAl",
                data : rdata.data
            });
        }else{
            
        }
    }
}