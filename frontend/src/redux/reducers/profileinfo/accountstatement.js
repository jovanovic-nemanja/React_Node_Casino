var initdata = {
    load :[],
   
 }

export const accountstatement = (state =initdata, action) => {
  switch (action.type) {
 
    case "PROFILEINFOR_ACCOUNTSTATEMENT_LOAD": {
      return { ...state, load: action.data }
    }

    default: {
      return state
    }
  }
}
