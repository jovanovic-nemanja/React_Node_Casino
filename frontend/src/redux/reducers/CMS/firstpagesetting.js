const initialState = {
    logoimg: null,
    trackingcode: null,
    paymentmethodimgs: null,
    providerimgs: null,
  }


export const firstpagesetting = (state = initialState, action) => {
    switch (action.type) {
      case "FirstpageSetting_logo": {
        return { ...state, logoimg: action.data }
      }
      case "FirstpageSetting_Favicon" :{
        return { ...state, favicon : action.data}
      }
      case "FirstpageSetting_trackingcode": {
        return { ...state, trackingcode : action.data }
      }
      case "FirstpageSetting_footertext" :{
        return { ...state, footertext : action.data}
      }
      case "FirstpageSetting_cmsfootertext" :{
        return { ...state, cmsfootertext : action.data}
      }
      case "FirstpageSetting_title" :{
        return { ...state, title : action.data}
      }
      case "FirstpageSetting_appurl" :{
        return { ...state, appurl : action.data}
      }
      case "FirstpageSetting_paymentmethod": {
        return { ...state, paymentmethodimgs : action.data }
      }
      case "FirstpageSetting_providerimg": {
        return { ...state, providerimgs : action.data }
      }
      case "FirstpageSetting_ALL": {
        return { ...state, 
          logoimg : action.data.logoimg,
          favicon : action.data.favicon,
          footertext : action.data.footertext,
          title : action.data.title,
          appurl : action.data.appurl,
          trackingcode : action.data.trackcode,
          paymentmethodimgs : action.data.payment,
          providerimgs : action.data.provider,
          cmsfootertext : action.data.cmsfootertext,
        }
      }
      default: {
        return state
      }
    }
  }
  