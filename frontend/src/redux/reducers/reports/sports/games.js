import {ReposrtSportsGamesLoad,ReposrtSportsGamesGetData} from "../../../types"

const initialState = {
  data: [],
  params: null,
  allData: [],
  totalPages: 0,
  filteredData: [],
  totalRecords: 0,
  sortIndex: [0,0]
}
  
export  const sprotsgames = (state = initialState, action) => {
    switch (action.type) {
      case ReposrtSportsGamesGetData:
        return {
          ...state,
          toptbl: action.data,
        }

      case ReposrtSportsGamesLoad:

        return {
          ...state,
          data: action.data,
          totalPages: action.totalPages,
          params: action.params["params"],
          sortIndex : [action.params["skip"] + 1,action.params["skip2"]],
          totalRecords: action.totalRecords,
        }
      default:
        return state
    }
  }
  
  