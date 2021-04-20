import {AXIOS_REQUEST,set_page,Set_reducer} from "../auth/index"
import {toast} from "react-toastify"


export const getData = (params) => {
  return  async(dispatch) => {
    var rdata = await AXIOS_REQUEST("users/getlist",{},dispatch,true);
      if(rdata.status){
        var permission = rdata.roledata;
        let temp_permission = [];
        for(var i = 0 ; i < permission.length ; i ++)
        {
          let temp = {};
          temp.value = permission[i].id;
          temp.label = permission[i].title;
          temp_permission.push(temp);
        }
        // temp_permission.push({value :playerid,label : "players"})
        dispatch({ type: "PERMISSION_LOAD", data: temp_permission })
        Set_reducer(dispatch,params,rdata,"USER_GET_DATA");
      }else{
        toast.error("fail")
      }
  }
}

export const block_getData = (params,filterData) => {
  return  async(dispatch) => {
    var rdata = await AXIOS_REQUEST("users/blockgetlist",{})
      if(rdata.status){
        Set_reducer(dispatch,params,rdata,"USER_GET_DATA");
      }else{
        toast.error("fail")
      }
  }
}


export const filterData = (value,bool) => {
  return dispatch => dispatch({ type: "USER_FILTER_DATA", value : value,bool : bool })
}

export const signup = (users,params) => {
  return async(dispatch) =>{
    var rdata =  await AXIOS_REQUEST("users/adminregister",{user : users},dispatch,true)
      if(rdata.status){
        toast.success("success");
        Set_reducer(dispatch,params,rdata,"USER_GET_DATA");
      }else{
        toast.error(rdata.data);
      }
  }
}

export const resetpass = (params,row) =>{
  return async dispatch =>{
    var rdata =  await AXIOS_REQUEST("users/adminresetpassword",{user : row},dispatch,true)
    if(rdata.status){
      toast.success("success");
    }else{
      toast.error(rdata.data);
    }
  }    
}

export const multiblockaction = (params,rows) =>{
  return async dispatch =>{
    if (rows.length > 0){
      var rdata =  await AXIOS_REQUEST("users/adminmultiusersblock",{users : rows},dispatch,true)
        if(rdata.status){
          toast.success("success");
          Set_reducer(dispatch,params,rdata,"USER_GET_DATA");
        }else{
          toast.error(rdata.data);
        }
    }else{
      toast.warn("Please select items");
    }
  }    
}

export const multideleteaction = (params,rows) =>{
  return async dispatch =>{
    if (rows.length > 0){
      var rdata =  await AXIOS_REQUEST("users/adminmultiusersdelete",{users : rows},dispatch,true)
        if(rdata.status){
          toast.success("success");
          Set_reducer(dispatch,params,rdata,"USER_GET_DATA");
        }else{
          toast.error(rdata.data);
        }
    }else{
      toast.warn("Please select items");
    }
  }    
}


export const withdrawaction = (data,params,) =>{
  return async dispatch =>{
      var rdata =  await AXIOS_REQUEST("users/users_withdrawlaction",{data : data},dispatch,true)
        if(rdata.status){
          toast.success("success");
          Set_reducer(dispatch,params,rdata,"USER_GET_DATA");
        }else{
          toast.error(rdata.data);
        }
   
  }    
}

export const depositaction = (data,params,) =>{
  return async dispatch =>{
      var rdata =  await AXIOS_REQUEST("users/users_depositaction",{data : data},dispatch,true)
        if(rdata.status){
          toast.success("success");
          Set_reducer(dispatch,params,rdata,"USER_GET_DATA");
        }else{
          toast.error(rdata.data);
        }
   
  }    
}

export const updatesignup = (users,params) => {
  return async(dispatch) =>{
    var rdata = await AXIOS_REQUEST("users/adminusers_again",{newinfor : users},dispatch,true)
      if(rdata.status){
        toast.success("success")
        Set_reducer(dispatch,params,rdata,"USER_GET_DATA");
      }else{
        toast.error(rdata.data);
      }
  }
}

export const pagenationchange = (params)=>{
  return (dispatch,getState)=>{
    var row = {
      data : getState().userslist.users.allData
    }
    var rows =  set_page(params,row)
    var fdata = rows['fdata'];
    var totalPages = rows['totalPages'];
    dispatch({ type:"USER_SET_PAGENATION",data: fdata,totalPages:totalPages,params})
  }
}