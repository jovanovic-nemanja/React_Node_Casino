import {AXIOS_REQUEST} from "../../auth/index"
import { toast } from "react-toastify";
import {set_page} from "../../auth/index"

export const Set_reducer = (dispatch,rdata,params) =>{
  var rows = set_page(params,rdata);
  var fdata =rows['fdata'];
  var totalPages = rows['totalPages'];
  dispatch({
    type: "PLAYERLIMITS_DATA",
    data: fdata,
    totalPages:totalPages,
    params,
    allData : rdata.data
  })
}

export const getData = (params) => {
  return  async (dispatch) => {
    var rdata = await AXIOS_REQUEST("players/playerlimit_load",{},dispatch,true)
    if(rdata.status){
      Set_reducer(dispatch,rdata,params)
    }else{
      toast.error("fail")
    }
  }
}

export const filterData = value => {
  return dispatch => dispatch({ type: "PLAYERLIMITS_FILTER_DATA", value })
}

export const menuupdate = (datas,params)=>{
    return async(dispatch)=>{
      var rdata = await AXIOS_REQUEST("players/playerlimit_update",{data : datas},dispatch,true)
        if(rdata.status){
          Set_reducer(dispatch,rdata,params)
        }else{
          toast.error("fail")
        }
    }
}

export const pagenationchange = (params,data)=>{
  return (dispatch,getState)=>{
    var row = {
      data : getState().Players.playerlimit.allData
    }
    var rows =  set_page(params,row)
    var fdata = rows['fdata'];
    var totalPages = rows['totalPages']
    dispatch({
      type:"PLAYERLIMITS_SET_PAGENATION",
      data: fdata,
      totalPages:totalPages,
      params
    })
  }
}