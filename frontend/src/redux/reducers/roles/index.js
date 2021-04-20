import {ROLES_GET_DATA,ROLES_GET_FILTER_DATA,ROLES_GET_ALL_DATA,ROLES_DATA} from "../../types/permission";
import {getIndex} from "../../actions/auth/index"

const initialState = {
    data: [],
    params: null,
    allData: [],
    totalPages: 0,
    filteredData: [],
    totalRecords: 0,
    sortIndex: [],
    rolesdata : []
}

 const Roles = (state = initialState, action) => {
    switch (action.type) {
      case ROLES_GET_DATA:
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
      
      case ROLES_DATA :
        return {
          ...state,
          rolesdata : action.roles
        }

      case ROLES_GET_ALL_DATA:
        return {
          ...state,
          allData: action.data,
          totalRecords: action.data.length,
          sortIndex: getIndex(action.data, state.data, state.sortIndex)
        }
      case ROLES_GET_FILTER_DATA:
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
              item.username.toLowerCase().startsWith(value.toLowerCase()) ||
              item.email.toLowerCase().startsWith(value.toLowerCase()) ||
              item.firstname.toLowerCase().startsWith(value.toLowerCase()) ||
              item.lastname.toLowerCase().startsWith(value.toLowerCase()) ||
              item.currency.toLowerCase().startsWith(value.toLowerCase())
  
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

  export default Roles