
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
          allData : action.alldata,
          totalPages: action.totalPages,
          totalRecords: action.alldata.length,
          params: action.params,
          sortIndex:  [action.params["skip"] + 1,action.params["skip2"]]
        }
     
    
      default:
        return state
    }
  }
  
  