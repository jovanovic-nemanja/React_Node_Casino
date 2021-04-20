import {AXIOS_REQUEST} from "../auth/index"
import {set_page} from "../auth/index"
import {FINANCE_TRANSACTIONS_GET,FINANCE_TRANSACTIONS_FILTER} from "../../types/finance"

export const getData = (params,filters) => {
  return  async(dispatch) => {
    let dates = filters.dates;
    if(dates.length > 1){
      let rdata = await AXIOS_REQUEST("paymentGateWay/admindeposittransactionHistoryLoad",{start : dates[0],end :dates[1]},dispatch,true);
        if(rdata.status){
          let allData = rdata.data;
          let filteredData = allData;
          var rowdata = {
            data : filteredData
          }
          var rows =  set_page(params,rowdata);
          var fdata = rows['fdata'];
          var totalPages = rows['totalPages'];
          dispatch({
            type: FINANCE_TRANSACTIONS_GET,
            data: fdata,
            totalPages:totalPages,
            params : rows['params'],
            allData : filteredData
          });
        }
    }
  }
}

export const filterData = (value,bool) => {
  return dispatch => dispatch({ type: FINANCE_TRANSACTIONS_FILTER, value : value,bool : bool })
}

export const pagenationchange = (params,data)=>{
  return (dispatch,getState)=>{
    var row = {
      data : getState().finance.allData
    }
    var rows =  set_page(params,row)
    var fdata = rows['fdata'];
    var totalPages = rows['totalPages']
    dispatch({
      type:FINANCE_TRANSACTIONS_GET,
      data: fdata,
      totalPages:totalPages,
      params
    })
  }
}