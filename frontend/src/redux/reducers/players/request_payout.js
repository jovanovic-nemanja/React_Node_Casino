import {REQUESTPAYOUT_GET,REQUESTPAYOUT_PAGENATIONS} from "../../types/players"

const initialState = {
    data: [],
    params: null,
    allData: [],
    totalPages: 0,
    filteredData: [],
    totalRecords: 0,
    sortIndex: [],
    total : {},
  }
  
  
  const getIndex = (arr, arr2, arr3, params = {}) => {
    if (arr2.length > 0) {
      let startIndex = arr.findIndex(i => i.id === arr2[0].id) + 1
      let endIndex = arr.findIndex(i => i.id === arr2[arr2.length - 1].id) + 1
      let finalArr = [startIndex, endIndex]
      return (arr3 = finalArr)
    } else {
      let finalArr = [arr.length - parseInt(params.perPage), arr.length]
      return (arr3 = finalArr)
    }
  }
  
export  const request_payout = (state = initialState, action) => {
    switch (action.type) {
      case REQUESTPAYOUT_GET:
        return {
          ...state,
          data: action.data,
          totalPages: action.totalPages,
          params: action.params,
          sortIndex: getIndex(
            action.allData,
            action.data,
            state.sortIndex,
            action.params,
            ),
            allData: action.allData,
            totalRecords: action.allData.length,
            total : action.total
        }

        case REQUESTPAYOUT_PAGENATIONS:
          return {
            ...state,
            data: action.data,
            totalPages: action.totalPages,
            params: action.params,
            sortIndex: getIndex( state.allData, action.data, state.sortIndex, action.params )
          }
        
      default:
        return state
    }
  }
  
  
