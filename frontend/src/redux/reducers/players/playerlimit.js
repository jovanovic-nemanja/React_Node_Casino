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
  
  export const playerlimit = (state = initialState, action) => {
    switch (action.type) {
      case "PLAYERLIMITS_DATA":
        return {
          ...state,
          data: action.data,
          totalPages: action.totalPages,
          params: action.params,
          sortIndex: getIndex(
            action.allData,
            action.data,
            state.sortIndex,
            action.params
          ),
          allData: action.allData,
          totalRecords: action.allData.length,
        }
      case "PLAYERLIMITS_SET_PAGENATION":
        return {
          ...state,
          data: action.data,
          totalPages: action.totalPages,
          params: action.params,
          sortIndex: getIndex(
            state.allData,
            action.data,
            state.sortIndex,
            action.params
          ),
        }

        case "PLAYERLIMITS_FILTER_DATA":
          let value = action.value;
          let bool = action.bool + "";
            let filteredData = []
            if (value.length) {
              filteredData = state.allData.filter(item => {
                let startsWithCondition = false;
                let includesCondition = false;
                if(bool === "date"){
                  var date = new Date(item.date);
                  var date1 = new Date(value[0]);
                  var date2 = new Date(value[1]);
                  if(date >= date1 && date <= date2){
                    startsWithCondition = true;
                    includesCondition = true;
                  }
                }else{
                  var uitem = item[bool] + "";
                  startsWithCondition = uitem.toLowerCase().startsWith(value.toLowerCase());
                  includesCondition = uitem.toLowerCase().startsWith(value.toLowerCase());
                }
    
                if (startsWithCondition) {
                  return startsWithCondition
                } else if (!startsWithCondition && includesCondition) {
                  return includesCondition
                } else return null
              })
              .slice(state.params.page - 1, state.params.perPage)
    
              return { ...state, filteredData }
            } else {
              filteredData = state.data
              return { ...state, filteredData }
            }
            
      default:
        return state
    }
  }
  
  