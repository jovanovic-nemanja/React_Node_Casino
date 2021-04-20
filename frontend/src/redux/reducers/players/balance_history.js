const initialState = {
    data: [],
    params: null,
    allData: [],
    totalPages: 0,
    filteredData: [],
    totalRecords: 0,
    sortIndex: []
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
  
  export  const balance_history = (state = initialState, action) => {
    switch (action.type) {
      case "PLAYERBALANCE_GET_DATA":
        return {
          ...state,
          data: action.data,
          allData : action.allData,
          totalPages: action.totalPages,
          totalRecords: action.allData.length,
          params: action.params,
          sortIndex: getIndex( action.allData, action.data, state.sortIndex, action.params )
        }
      // case "PLAYERBALANCE_GET_ALL_DATA":
      //   return {
      //     ...state,
      //     allData: action.data,
      //     totalRecords: action.data.length,
      //     sortIndex: getIndex(action.data, state.data, state.sortIndex)
      //   }
        case "PLAYERBALANCE_FILTER_DATA":
            let value = action.value.username;
            let data = [];
            if (value.length) {
              data = state.allData.filter(item => {
                    let startsWithCondition =
                    item.username.toLowerCase().startsWith(value.toLowerCase())                  
                    let includesCondition =
                    item.username.toLowerCase().startsWith(value.toLowerCase())
                  if (startsWithCondition) {
                    return startsWithCondition
                  } else if (!startsWithCondition && includesCondition) {
                    return includesCondition
                  } else return null
                })
                .slice(state.params.page - 1, state.params.perPage)
              return { ...state, data }
            } else {
              data = state.allData
              return { ...state, data }
            }
            
      default:
        return state
    }
  }
  
  
  