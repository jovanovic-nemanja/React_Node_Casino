import { combineReducers } from "redux"
import { fpMng } from "./firstpageMngReducer"
import { livecasinogamelist } from "./livecasinogamelist"
import { firstpagesetting } from "./firstpagesetting"
import { menu } from "./menu"
import { FirstPageGameSetting } from "./FirstPage_game_setting"
import { sports } from "./sports"
import { exchg } from "./exchg"
import { profilemenu } from "./profilemenu"

const cms = combineReducers({
  fpMng,
  livecasinogamelist,
  firstpagesetting,
  menu,
  sports,
  exchg,
  FirstPageGameSetting,
  profilemenu
})

export default cms
