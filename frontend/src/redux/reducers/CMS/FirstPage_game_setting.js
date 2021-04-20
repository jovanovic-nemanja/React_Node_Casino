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

 export const FirstPageGameSetting = (state = initialState, action) => {
    switch (action.type) {
      case "FIRSTPAGE_GAME_SETTING_GET_DATA":
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
      case "FIRSTPAGE_GAME_SETTING_GET_ALL_DATA":
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
          )
        }
    
      default:
        return state
    }
  }
  
  