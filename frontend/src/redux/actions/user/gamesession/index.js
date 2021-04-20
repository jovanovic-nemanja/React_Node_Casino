import {AXIOS_REQUEST} from "../../auth/index"
import { toast } from "react-toastify";
import {set_page} from "../../auth/index"

export const getData = (params,date) => {
  return  async(dispatch) => {
    if(date.length === 2){
      var rdata = await AXIOS_REQUEST("players/gamesrealtimeusers",{start : date[0],end : date[1]})
        if(rdata.status){
          var rows =  set_page(params,rdata);
          var fdata = rows['fdata'];
          var totalPages = rows['totalPages'];
            dispatch({
              type: "GAMESESSIonREALTIME_GET_DATA",
              data: fdata,
              totalPages:totalPages,
              params,
              allData :rdata.data,count : rdata.count
            })
        }else{
          toast.error("fail")
        }
    }
  }
}

export const filterData = value => {
  return dispatch => dispatch({ type: "GAMESESSIonREALTIME_FILTER_DATA", value })
}

export const deleteRow = (value,params)=>{
  return async(dispatch)=>{
    var rdata = await AXIOS_REQUEST("players/gamesrealtimeusersdelete",{email : value.email})
      if(rdata.status){
        var rows =  set_page(params,rdata);
        var fdata = rows['fdata'];
        var totalPages = rows['totalPages'];
          dispatch({
            type: "GAMESESSIonREALTIME_GET_DATA",
            data: fdata,
            totalPages:totalPages,
            params,
            allData :rdata.data
          })
      }else{

      }
  }
}

export const pagenationchange = (params,data)=>{
  return (dispatch,getState)=>{
    var row = {
      data : getState().userslist.sessionusers.allData
    }
    var rows =  set_page(params,row)
    var fdata = rows['fdata'];
    var totalPages = rows['totalPages'];
    dispatch({ type:"GAMESESSIonREALTIME_PAGENATION",data: fdata,totalPages:totalPages,params})
  }
}