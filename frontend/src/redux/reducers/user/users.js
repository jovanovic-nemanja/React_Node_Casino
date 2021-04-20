import {getIndex} from "../../actions/auth/index"

const initialState = {
    data: [],
    params: null,
    allData: [],
    totalPages: 0,
    filteredData: [],
    totalRecords: 0,
    sortIndex: []
  }
  
export  const users = (state = initialState, action) => {
    switch (action.type) {
      case "USER_GET_DATA":
        return {
          ...state,
          data: action.data,
          allData : action.allData,
          totalPages: action.totalPages,
          totalRecords: action.allData.length,
          params: action.params,
          sortIndex: getIndex( action.allData, action.data, state.sortIndex, action.params )
        }
      case "USER_SET_PAGENATION":
        return {
          ...state,
          data: action.data,
          totalPages: action.totalPages,
          params: action.params,
          sortIndex: getIndex( state.allData, action.data, state.sortIndex, action.params )
        }
      case "USER_FILTER_DATA":
        let value = (action.value);
        let bool = (action.bool).toString();
        let data = [];
        if (value.length) {
          data = state.allData.filter(item => {
            let startsWithCondition = false;
            let includesCondition = false;
            if(bool === "date"){
              var date = new Date(item.date);
              var date1 = new Date(value[0]);
              var date2 = new Date(value[1]);
              if(date >= date1 && date <= date2){
                startsWithCondition = true;
                includesCondition = true;
              }else{
                startsWithCondition = false;
                includesCondition = false;
              }
            }else{
              value = value.toString();
              var uitem = (item[bool]).toString();
              startsWithCondition = uitem.toLowerCase().startsWith(value.toLowerCase());
              includesCondition = uitem.toLowerCase().includes(value.toLowerCase());
            }
            if (startsWithCondition) {
              return startsWithCondition
            } else if (!startsWithCondition && includesCondition) {
              return includesCondition
            } else return null
          }).slice(state.params.page - 1, state.params.perPage)
          return { ...state, data }
        } else {
          data = state.data
          return { ...state, data }
        }
    
      default:
        return state
    }
  }
  
  