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
  
 export const pro_credential = (state = initialState, action) => {
    switch (action.type) {
      case "SETTING_PROCREDENTILA_LOAD":
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
      case "SETTING_PROCREDENTILA_SETPAGENATION":
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

      case  "SETTING_PROCREDENTIAL_EDIT" :
        return{
          ...state,edit : action.data
        }
      case "SETTING_PROCREDENTILA_FILTERDATA":
        let value = action.value
        let filteredData = []
        if (value.length) {
          filteredData = state.allData
            .filter(item => {
              let startsWithCondition = true
              let includesCondition =true  
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
  
