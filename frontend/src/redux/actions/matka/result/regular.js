import {AXIOS_REQUEST,} from "../../auth/index"
import { toast } from "react-toastify";
import confirm from "reactstrap-confirm"
import {MatkaResultREGULAR_GETDATA} from "../../../types"


function reduxload(rdata,dispatch){
  var data = rdata.data;
  var totalPages = rdata.pageset["totalPages"];
  var pages = rdata.pageset;
  var totalRecords = rdata.pageset["totalRecords"]
  dispatch({
      type: MatkaResultREGULAR_GETDATA,
      data: data,
      totalPages:totalPages,
      params : pages,
      totalRecords : totalRecords,
      bazaarlist : rdata.bazaars,
      numberoptions : rdata.numberoptions

  });
}

export const getData = (params,filters) => {
  return  async (dispatch) => {
    var rdata = await AXIOS_REQUEST("satta/get_result",{filters,params},dispatch,true);
    if(rdata.status){
      console.log(rdata)
        reduxload(rdata,dispatch)
    }else{
      toast.error("fail")
    }
  }
}

export const menusave =(data,params,filters)=>{
    return async(dispatch)=>{
      var rdata = await AXIOS_REQUEST("satta/create_result",{data, filters, params},dispatch,true)
        if(rdata.status){
          reduxload(rdata,dispatch)

        }else{
          toast.error(rdata.data)
        }
    }
}

export const menudelete = (value,params,date)=>{
  return async(dispatch)=>{
    var result = await confirm();
    if(result){
      var rdata = await AXIOS_REQUEST("satta/delete_result",{data : value,query : date},dispatch,true)
        if(rdata.status){
          reduxload(rdata,dispatch)
        }else{
            toast.error("fail")
        }
    }
  }
}


export const menuupdate = (data,params,filters)=>{
    return async(dispatch)=>{
      var rdata = await AXIOS_REQUEST("satta/update_result",{data, filters, params},dispatch,true)
        if(rdata.status){
          reduxload(rdata,dispatch)
        }else{
          toast.error("fail")
        }
    }
}

export const todayresult = (params,filters) =>{
  return async(dispatch)=>{
    var rdata = await AXIOS_REQUEST("satta/today_result",{params,filters},dispatch,true);
    if(rdata.status){
      reduxload(rdata,dispatch)
    }else{
      toast.error("fail")
    }
  }
}

export const allresult = (params,filters) =>{
  return async(dispatch)=>{
    var rdata = await AXIOS_REQUEST("satta/all_result",{params,filters},dispatch,true)
      if(rdata.status){
        reduxload(rdata,dispatch)
      }else{
        toast.error("fail")
      }
  }
}

export const revenuCalc = (row) => {
  return async dispatch => {
    let rdata = await AXIOS_REQUEST("satta/revenCalc",{row});
    if (rdata.status) {
      return rdata.data
    } else {
      return []
    }
  }
}