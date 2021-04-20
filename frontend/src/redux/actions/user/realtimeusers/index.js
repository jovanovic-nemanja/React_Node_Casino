import {AXIOS_REQUEST,set_page} from "../../auth/index"
import { toast } from "react-toastify";

export const getData = (params,date) => {
  return  async(dispatch) => {
    if(date.length === 2){
      var rdata = await AXIOS_REQUEST("players/realtimeusers",{start : date[0],end : date[1]})
          if(rdata.status){
          var rows =  set_page(params,rdata);
          var fdata = rows['fdata'];
          var totalPages = rows['totalPages'];
            dispatch({ type: "REALTIME_GET_DATA",data: fdata,totalPages:totalPages,params,alldata : rdata.data,count : rdata.count})
        }else{
          toast.error("fail")
        }
    }
  }
}

export const filterData = value => {
  return dispatch => dispatch({ type: "REALTIME_FILTER_DATA", value })
}

export const deleteRow = (value,params)=>{
  return async(dispatch)=>{
    var rdata = await AXIOS_REQUEST("players/realtimeusersdelete",{email : value.email})
      if(rdata.status){
        var rows =  set_page(params,rdata);
        var fdata = rows['fdata'];
        var totalPages = rows['totalPages'];
          dispatch({ type: "REALTIME_GET_DATA",data: fdata,totalPages:totalPages,params,alldata : rdata.data,count : rdata.count})
      }else{
        toast.error("fail")
      }
  }
}

export const pagenationchange = (params,data)=>{
  return (dispatch,getState)=>{
    var row = {
      data : getState().userslist.realtimeusers.allData
    }
    var rows =  set_page(params,row)
    var fdata = rows['fdata'];
    var totalPages = rows['totalPages'];
    dispatch({ type:"REALTIME_SET_PAGENATION",data: fdata,totalPages:totalPages,params})
  }
}