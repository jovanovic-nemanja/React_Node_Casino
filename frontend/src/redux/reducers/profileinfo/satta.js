var initdata = {
    data :[],
    result : null
 }

export const Satta = (state =initdata, action) => {
  switch (action.type) {
 
    case "PROFILEINFOR_SATTA_LOAD": {
      return { ...state, data: action.data ,result : action.result}
    }

    default: {
      return state
    }
  }
}
