import {AXIOS_REQUEST,set_page,} from "../auth/index"
import { toast } from "react-toastify";
import {permissionload,permissionget,permissionfilter} from "../../types/players"
import confirm from "reactstrap-confirm"
 
export const getData = (params) => {
  return  async (dispatch) => {
    var rdata = await AXIOS_REQUEST("users/role_menuload",{})
    if(rdata.status){
      var rows = set_page(params,rdata);
      var fdata =rows['fdata'];
      var totalPages = rows['totalPages'];
      dispatch({ type: permissionload, data: rdata.data })
      dispatch({
        type: permissionget,
        data: fdata,
        totalPages:totalPages,
        params
      })
    }else{
      toast.error("fail")
    }
  }
}

export const getDataAgain = (params) => {
  return  async (dispatch) => {
    var rdata = await AXIOS_REQUEST("users/role_menuload_permission",{})
    if(rdata.status){
      var permission = rdata.data;
      let temp_permission = [];
      for(var i = 0 ; i < permission.length ; i ++)
      {
        let temp = {};
        temp.value = permission[i].id;
        temp.label = permission[i].title;
        temp_permission.push(temp);
      }
      dispatch({ type: "PERMISSION_LOAD", data: temp_permission })
    }else{
      toast.error("fail")
    }
  }
}

export const filterData = value => {
  return dispatch => dispatch({ type: permissionfilter, value })
}


export const menudelete = (value,params)=>{
  return async(dispatch)=>{
    var result =  await confirm();
    if(result){
      var rdata = await AXIOS_REQUEST("users/role_menudelete",{data : value})
        if(rdata.status){
          var rows = set_page(params,rdata);
          var fdata =rows['fdata'];
          var totalPages = rows['totalPages'];
          dispatch({ type: permissionload, data: rdata.data })
          dispatch({
            type: permissionget,
            data: fdata,
            totalPages:totalPages,
            params
          })
          }else{
            toast.error("fail")
          }
    }else{

    }
  }
}

export const menusave =(data,params)=>{
    return async(dispatch)=>{
      var rdata = await AXIOS_REQUEST("users/role_menusave",{data : data})
        if(rdata.status){
          var rows = set_page(params,rdata);
          dispatch({ type: permissionload, data: rdata.data })
          var fdata =rows['fdata'];
          var totalPages = rows['totalPages'];
          dispatch({
          type: permissionget,
          data: fdata,
          totalPages:totalPages,
          params
          })
        }else{
          toast.error("fail")
        }
    }
}

export const menuupdate = (datas,params)=>{
    return async(dispatch)=>{
      var rdata = await AXIOS_REQUEST("users/role_menuupdate",{data : datas})
        if(rdata.status){
          var rows = set_page(params,rdata);
          var fdata =rows['fdata'];
          dispatch({ type: permissionload, data: rdata.data })
          var totalPages = rows['totalPages'];
          dispatch({
              type: permissionget,
              data: fdata,
              totalPages:totalPages,
              params
          })
        }else{
          toast.error("fail")
        }
    }
}

export const pagenationchange = (params,data)=>{
  return (dispatch,getState)=>{
    var row = {
      data : getState().userslist.permission.allData
    }
    var rows =  set_page(params,row)
    var fdata = rows['fdata'];
    var totalPages = rows['totalPages']
    dispatch({
      type:permissionget,
      data: fdata,
      totalPages:totalPages,
      params
    })
  }
}


export const sidebarSave = (params)=>{
  return async(dispatch)=>{
    var rdata = await AXIOS_REQUEST("users/sidebarSave",params)
      if(rdata.status){
        toast.success("success")
      }else{
      }
  }
}

export const sidebarLoad = (params) => {
  return  async (dispatch) => {
    var rdata = await AXIOS_REQUEST("users/sidebarLoad",params)
    if(rdata.status){
      dispatch({ type: "SIDBAR_LOAD_DATA", data: rdata.data.sidebar })
    }else{
      toast.error("fail")
    }
  }
}