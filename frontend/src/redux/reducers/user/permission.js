import {permissionload,permissionget,permissionfilter} from "../../types/players"
import {getIndex} from "../../actions/auth/index"

const initialState = {
    data: [],
    params: null,
    allData: [],
    totalPages: 0,
    filteredData: [],
    totalRecords: 0,
    sortIndex: [],
    permissiondata : []
  }

  export const permission = (state = initialState, action) => {
    switch (action.type) {
      case permissionget:
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
      case permissionload:
        return {
          ...state,
          allData: action.data,
          totalRecords: action.data.length,
          sortIndex: getIndex(action.data, state.data, state.sortIndex)
        }
        
      case "PERMISSION_LOAD":
        return {
          ...state,
          permissiondata: action.data,
        }
      case "SIDBAR_LOAD_DATA":
        return {
          ...state,
          sidebarLoadData: action.data,
        }
        
      case permissionfilter:
        let value = action.value
        let filteredData = []
        if (value.length) {
          filteredData = state.allData
            .filter(item => {
              let startsWithCondition =
                item.username.toLowerCase().startsWith(value.toLowerCase()) ||
                item.email.toLowerCase().startsWith(value.toLowerCase()) ||
                item.firstname.toLowerCase().startsWith(value.toLowerCase()) ||
                item.lastname.toLowerCase().startsWith(value.toLowerCase()) ||
                item.currency.toLowerCase().startsWith(value.toLowerCase())
  
              let includesCondition =
              item.username.toLowerCase().includes(value.toLowerCase()) ||
              item.email.toLowerCase().includes(value.toLowerCase()) ||
              item.firstname.toLowerCase().includes(value.toLowerCase()) ||
              item.lastname.toLowerCase().includes(value.toLowerCase()) ||
              item.currency.toLowerCase().includes(value.toLowerCase())
  
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
  
