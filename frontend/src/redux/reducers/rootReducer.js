import { combineReducers } from "redux"
import customizer from "./customizer/"
import auth from "./auth/"
import userslist from "./user/"
import cms from "./CMS/"
import paymentGateWay from "./paymentGateWay"
import Players from "./players"
import dashboard from "./dashboard"
import profileinfo from "./profileinfo"
import promotions from "./promotions"
import roles from "./roles"
import permission from "./permission"
import setting from "./setting"
import balance from "./balance"
import time from "./time"
import pokerRoom from './pokerRoom';

const rootReducer = combineReducers({
  profileinfo: profileinfo,
  customizer: customizer,
  auth: auth,
  cms : cms,
  userslist : userslist,
  paymentGateWay : paymentGateWay,
  Players : Players,
  dashboard : dashboard,
  promotions : promotions,
  roles : roles,
  permission : permission,
  setting : setting,
  balance : balance,
  time : time,
  pokerRoom : pokerRoom
})

export default rootReducer