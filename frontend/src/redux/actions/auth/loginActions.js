import { history } from "../../../history"
import axios from "axios"
import { Root} from "../../../authServices/rootconfig"
import {AXIOS_REQUEST} from "./index"
import {LOGIN_URL} from "../../../urls"
import{setSession,url_path,fake_session} from "./index"
import { toast } from "react-toastify"
import io from 'socket.io-client'

const BASEURL = Root.adminurl

export const get_userinfor =(user) =>{
  return async(dispatch) =>{
    var response = await AXIOS_REQUEST("users/get_userinfor",{user});
    if(response.status){
      return dispatch({
        type : "PROFILE_USER",
        data : response.data
      })
    }else{
    }
  }
}

export const loginWithJWT = user => {
  return async(dispatch) => {
    var rdata = await AXIOS_REQUEST("users/adminlogin",{username: user.email,password: user.password},dispatch,true);
    if(rdata.status){
      toast.success("Successfully logged In");
      console.log(rdata)
       setSession(rdata.data);
      window.sessionStorage.setItem("activeitem","1612096323945");
      window.sessionStorage.setItem("activeGroups",JSON.stringify(["1601932220849"]));
      window.location.assign("/");
    }else{
      toast.error(rdata.error)
    }
      
  }
}

export const setSidebar = () => {
  return async dispatch => {
    var rdata = await AXIOS_REQUEST("users/adminsidebar_load");
    if(rdata.status){
      dispatch({ 
        type : "SIDEVAR_DATA",
        data : rdata.data,
        array : rdata.array
      })
    }else{

    }
  }
}

export const logoutWithJWT = () => {
  return async dispatch => {
    await AXIOS_REQUEST("users/logout",);
    fake_session();
    dispatch({ type : "LOGIN_WITH_JWT", payload :false});
    history.push(LOGIN_URL);
  }
}

export const session_checked = (decoded)=>{
  return async(dispatch) =>{
    
    console.log(decoded)
    var user = await AXIOS_REQUEST("users/get_userinfor",{token : decoded});
    var userdata = user.data;
    dispatch({ type : "PROFILE_USER",data : userdata});

    Root.socket = io(Root.admindomain,{query:{ authtoken : decoded}});
    Root.socket.on("destory",(dd)=>{
      fake_session();
      window.location.assign(LOGIN_URL);
    });

    
    Root.socket.on("datetime",(date)=>{ 
      dispatch({ type : "SET_DATE" ,data : date });      
    });
  
    Root.socket.on("balance",(barray)=>{
      if(barray.data){
        dispatch({  type : "GETBALANCE",  data : barray.data });
      }
    });
    var rdata =  await AXIOS_REQUEST("users/get_themeinfor",{data : userdata.email})
    if(rdata.status){
      dispatch({ type : "THEMSET", theme : rdata.data })
    }
    if(url_path() === LOGIN_URL ){
      history.push("/");
    }
    return true;
  }
}

export const changeRole = role => {
  return dispatch => dispatch({ type: "CHANGE_ROLE", userRole: role })
}

export const getuserslist = () =>{
  return async(dispatch) => {
    var rdata = await AXIOS_REQUEST("users/getlist",{})
      if(rdata.status){
        dispatch({ type: "USERSLIST", payload: rdata.data })
      }else{
        toast.error("fail")
      }
  }
}

export const getuserslist_delete = () =>{
  return async(dispatch) =>{
    var rdata = await AXIOS_REQUEST("users/getlist",{});
      if(rdata.status){
        dispatch({type : "DELETEDUSERSLIST",payload : rdata.data})
      }else{
        toast.error("Fail")
      }
  }
}

export const deleteuser = (user) =>{
  return async(dispatch)=>{
    var rdata = await AXIOS_REQUEST("users/delete",{user : user})
      if(!rdata.status){
        return dispatch({ type: "USERSLIST", payload: rdata.data })
      }else{
      }
  }
}

export const kycdoclist = () =>{
  return async(dispatch) =>{
    var rdata = await AXIOS_REQUEST("files/getkycdoclist",{})
      if(rdata.status){
        return dispatch({
          type : "KYCDOCLIST",
          payload : rdata.data
        })
      }else{
      }
  }
}

export const kycdoccheck =(data)=>{
  return async(dispatch) =>{
    var rdata = await AXIOS_REQUEST("files/checkkycdoc",{data : data})
      if(rdata.status){
        return dispatch({
          type : "KYCDOCLIST",
          payload : rdata.data
        })
      }else{
      }
  }
}

export const kycdocreject =(data)=>{
  return async(dispatch) =>{
    var rdata = await AXIOS_REQUEST("files/rejectkycdoc",{data : data})
      if(rdata.status){
        return dispatch({
          type : "KYCDOCLIST",
          payload : rdata.data
        })
      }else{
      }
  }
}

export const kycdownload = (data) => {
  return dispatch => {
    axios.get(BASEURL + "file/download/"+ data.filename+"/"+data.originalname,).then( response =>{
    })
  }
}

export const changepassword =(user) =>{
  return async(dispatch) =>{
    var rdata = await AXIOS_REQUEST("users/adminchangepassword",{user : user})
      if(rdata.status){
        setSession(rdata.token);
        window.location.assign("/");
      }else{
      }
  }
}

export const themeinforsave = (data)=>{
  return async(dispatch)=>{
    var rdata = await AXIOS_REQUEST("users/save_themeinfor",{data : data})
    if(rdata.status){
      dispatch({
        type : "THEMSET",
        theme : rdata.data
      })
    }else{
      toast.error("Fail")
    }
  }
}

export const role_update = () =>{
  return async dispatch =>{
    var rdata = await AXIOS_REQUEST("users/role_load",{});
    if(rdata.status){
      dispatch({
        type : "USERSROLE",
        data : rdata.data
      })
    }else{

    }
  }
}

export const savePokerGridAPI = data => {
  return async dispatch => {
    var response = await AXIOS_REQUEST("users/save_pokergrid_api", data);
    if (response.status) {
      toast.success("Successfully saved!");
    } else {
      toast.error(response.data)
    }
  }
}

export const loadPokerAPI = data => {
  return async dispatch => {
    var response = await AXIOS_REQUEST("users/load_pokergrid_api", data);
    if (response.status) {
      dispatch({
        type: "POKER_API_DATA",
        data: response.data
      })
    }
  }
}

export const updatePokerGridAPI = data => {
  return async dispatch => {
    var response = await AXIOS_REQUEST("users/update_pokergrid_api", data);
    if (response.status) {
      toast.success("Successfully updated!");
    } else {
      toast.error(response.data)
    }
  }
}