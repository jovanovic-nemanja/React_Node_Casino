import {AXIOS_REQUEST,set_page} from "../auth/index"
import confirm from "reactstrap-confirm"

export const Set_reducer = (dispatch,rdata,params) =>{
    var rows =  set_page(params,rdata);
    var fdata = rows['fdata'];
    var totalPages = rows['totalPages'];
    dispatch({ type: "SETTING_PROCREDENTILA_LOAD",data: fdata,totalPages:totalPages,params : rows['params'],allData : rdata.data});
}

export const update = (data,item) =>{
    return async dispatch =>{
        await AXIOS_REQUEST("settings/setting_procredential_update",{data : data,item : item});
        
        window.location.reload();
        // if(rdata.status){
        //     dispatch({type:"SETTING_PROCREDENTIAL_EDIT",data : rdata.data})
        // }else{

        // }
    }
}

export const getData = (params) =>{
    return async dispatch =>{
        var rdata = await AXIOS_REQUEST("settings/setting_procredential_load",{});
        if(rdata.status){
            dispatch({type:"SETTING_PROCREDENTIAL_EDIT",data : rdata.data})
            // Set_reducer(dispatch,rdata,params)
        }else{
        }
    }
}

export const provider_save = (row,params) =>{
    return async dispatch =>{
        var rdata = await AXIOS_REQUEST("settings/setting_procredential_save",{data : row});
        if(rdata.status){
            Set_reducer(dispatch,rdata,params)
        }else{
            
        }
    }
}

export const provider_update = (row,params) =>{
    return async dispatch =>{
        var rdata = await AXIOS_REQUEST("settings/setting_procredential_update",{data : row});
        if(rdata.status){
            Set_reducer(dispatch,rdata,params)
        }else{
            
        }
    }
}

export const provider_delete = (row,params) =>{
    return async dispatch =>{
        var result  = await confirm();
        if(result){
            var rdata = await AXIOS_REQUEST("settings/setting_procredential_delete",{data : row});
            if(rdata.status){
                Set_reducer(dispatch,rdata,params)
            }else{
                
            }
        }else{
        }
    }
}

export const pagenationchange = (params,data)=>{
    return (dispatch,getState)=>{
      var row = {
        data : getState().setting.pro_credential.allData
      }
      var rows =  set_page(params,row)
      var fdata = rows['fdata'];
      var totalPages = rows['totalPages']
      dispatch({
        type:'SETTING_PROCREDENTILA_SETPAGENATION',
        data: fdata,
        totalPages:totalPages,
        params
      })
    }
}