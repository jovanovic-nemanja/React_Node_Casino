var initdata = {
    data :[],
    result : null,
    total : []
 }

export const mybets = (state =initdata, action) => {
  switch (action.type) {
 
    case "PROFILEINFOR_MYBETS_LOAD": {
      return { ...state, data: action.data ,result : action.result}
    }

    case "PROFILEINFOR_MYBETS_TOTAl": {
      return { ...state, total: action.data}
    }

    default: {
      return state
    }
  }
}
