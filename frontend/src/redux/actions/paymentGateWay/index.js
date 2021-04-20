import {AXIOS_REQUEST, set_page} from "../auth/index"
import { toast } from "react-toastify"

export const PaymentconfigLoad = type => {
    return  async(dispatch) => {
      var rdata = await AXIOS_REQUEST("paymentGateWay/PaymentconfigLoad",{type})
          if(rdata.status){
              dispatch({ type: "PAYMENTMENU_CONFIG_DATA", data: rdata.data })
          }else{
              toast.error(rdata.data);
          }
    }
}
  
export const PaymentconfigSave = params => {
    return  async(dispatch) => {
      var rdata = await AXIOS_REQUEST("paymentGateWay/PaymentconfigSave",{params})
      if(rdata.status){
          toast.success(rdata.data);   
      }else{
          toast.error(rdata.data);   
      }
    }
}

export const QpayCheckOut = params => {
    return  async(dispatch) => {
        if(!params.email){
            toast.error('email undefined');   
        }else{
            var rdata = await AXIOS_REQUEST("paymentGateWay/QpayCheckOut",{params})
                if(rdata.status){
                    dispatch({ type: "PAYMENTGATEWAY_QPAY_CHEKOUT_DATA", data: rdata });
                }else{
                    toast.error(rdata.data);   
                }
        }
    }
}

export const QpayResults = order_no => {
    return  async(dispatch) => {
      var rdata = await AXIOS_REQUEST("paymentGateWay/QpayResults",{order_no})
          if(rdata.status){
              dispatch({ type: "PAYMENTGATEWAY_QPAY_RESULTS_DATA", data: rdata.data })
          }else{
              toast.error(rdata.data);   
          }
    }
}


export const getData = (params) => {
  return  async (dispatch) => {
    var rdata = await AXIOS_REQUEST("paymentGateWay/menuload",{})
    if(rdata.status){
      var rows = set_page(params,rdata);
      var fdata =rows['fdata'];
      var totalPages = rows['totalPages'];
      dispatch({ type: "PAYMENTMENU_GET_ALL_DATA", data: rdata.data })
      dispatch({
        type: "PAYMENTMENU_GET_DATA",
        data: fdata,
        totalPages:totalPages,
        params
      })
    }else{
      toast.error("fail")
    }
  }
}

export const filterData = value => {
  return dispatch => dispatch({ type: "PAYMENTMENU_FILTER_DATA", value })
}


export const menudelete = (value,params)=>{
  return async(dispatch)=>{
    var rdata = await AXIOS_REQUEST("paymentGateWay/menudelete",{data : value})
      if(rdata.status){
        var rows = set_page(params,rdata);
        var fdata =rows['fdata'];
        var totalPages = rows['totalPages'];
        dispatch({ type: "PAYMENTMENU_GET_ALL_DATA", data: rdata.data })
        dispatch({
          type: "PAYMENTMENU_GET_DATA",
          data: fdata,
          totalPages:totalPages,
          params
        })
        }else{
          toast.error("fail")
        }
  }
}

export const menusave =(data,params)=>{
    return async(dispatch)=>{
      var rdata = await AXIOS_REQUEST("paymentGateWay/menusave",{data : data})
        if(rdata.status){
          var rows = set_page(params,rdata);
          dispatch({ type: "PAYMENTMENU_GET_ALL_DATA", data: rdata.data })
          var fdata =rows['fdata'];
          var totalPages = rows['totalPages'];
          dispatch({
          type: "PAYMENTMENU_GET_DATA",
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
      var rdata = await AXIOS_REQUEST("paymentGateWay/menuupdate",{data : datas})
        if(rdata.status){
          var rows = set_page(params,rdata);
          var fdata =rows['fdata'];
          dispatch({ type: "PAYMENTMENU_GET_ALL_DATA", data: rdata.data })
          var totalPages = rows['totalPages'];
          dispatch({
              type: "PAYMENTMENU_GET_DATA",
              data: fdata,
              totalPages:totalPages,
              params
          })
        }else{
          toast.error("fail")
        }
    }
}