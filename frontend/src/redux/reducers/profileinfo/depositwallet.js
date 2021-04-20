
const initialState = {
    data: [],    
  }
  
export  const wallet_deposit = (state = initialState, action) => {
    switch (action.type) {
      case "PROFILEINFOR_DEPOSIT_LOAD":
        return { ...state, data: action.data}
     
    
      default:
        return state
    }
  }
  
  