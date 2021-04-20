import * as loginAction from "./loginActions"
import { Root} from "../../../authServices/rootconfig"
import jwt from "jwt-simple"
import { history } from "../../../history"
import axios from "axios"
import {key_providers} from "../../../configs/providerconfig"
import { toast } from "react-toastify";
import {LOGIN_URL} from "../../../urls"

export default loginAction

export const getIndex = (arr, arr2, arr3, params = {}) =>{
	if (arr2.length > 0) {
		let startIndex = arr.findIndex(i => i._id === arr2[0]._id) + 1
		let endIndex = arr.findIndex(i => i._id === arr2[arr2.length - 1]._id) + 1
		let finalArr = [startIndex, endIndex]
		return (arr3 = finalArr)
	} else {
		let finalArr = [arr.length - parseInt(params.perPage), arr.length]
		return (arr3 = finalArr)
	}
}

export const get_date  =(time) =>{
	var times = time.split(":");
	if(times.length >= 1){
		if(parseInt(times[0]) > 12){
			let time =convert ((parseInt(times[0]) - 12 )) + ":" +  convert(times[1]) + " PM";
			return time;
		}else{
			let time = convert(parseInt(times[0]))+":" + convert(times[1])  + "  AM";
			return time
		}
	}
	function convert(number){
        if(parseInt(number) > 9){
            return number
        }else{
            return "0" + parseInt(number)
        }
    }
}

export const  get_timestring =(time) =>{
	var hours = time.getHours();
	var minute = time.getMinutes();
	return hours + ":" + minute;
}

export const  get_GGR_value =  (item) =>{
	var totalbet =  item.BET ? item.BET : 0;
	var totalwin =  item.WIN ? item.WIN : 0;
	var totalcancel_bet =  item.CANCEL_BET ? item.CANCEL_BET : 0;
	var totalGGr = (totalbet - totalwin - totalcancel_bet).toFixed(2);
	return totalGGr;
}

export const get_total_ggr_value = (data) =>{
	var totalNum = 0;
	for(var i = 0 ; i < data.length ; i++){
		totalNum += parseFloat(get_GGR_value(data[i]));
	}
	return totalNum.toFixed(2);
}

export const get_total_value = (bool,data) =>{
	var totalNum = 0;
	for(var i = 0 ; i < data.length; i ++){
		totalNum += data[i][bool] ? data[i][bool] : 0;
	}
	return totalNum.toFixed(2);
}

export const Set_reducer = (dispatch,params,rdata,type) =>{
	var rows = set_page(params,rdata);
	var fdata =rows['fdata'];
	var totalPages = rows['totalPages'];
	dispatch({
	  type: type,
	  data: fdata,
	  totalPages:totalPages,
	  params,
	  allData : rdata.data
	})
}  

export const select_string = (bool)=>{
	var  booloptions = key_providers
	var string =  booloptions.find(obj => obj.value === bool);
	return string.label;
}
export const select_color = (bool)=>{
	switch(bool){
        case "1" :{
          return "light-success"
        }
        case "2" :{
          return "light-danger"
        }
        case "3" :{
          return "light-warning"
        }
        case "4" :{
          return "light-primary"
        }
        case "5" :{
          return ""
		}
		default :{
			return;
		}
      }
}

export const Filter = (value,data) =>{
	var filteredData = []
	if(value === "All"){
		filteredData = data;
			return filteredData
	}else{
		filteredData = data
			.filter(item => {
			  let startsWithCondition =!item.TYPE ? null : item.TYPE.toLowerCase().startsWith(value.toLowerCase())
			  let includesCondition =!item.TYPE ? null :item.TYPE.toLowerCase().startsWith(value.toLowerCase())
			if (startsWithCondition) {
				return startsWithCondition
			  } else if (!startsWithCondition && includesCondition) {
				return includesCondition
			  } else return null
			});
			return filteredData
	}
}

export const order_change =(items)=>{
    var newdata = [];
    for(var i = 0 ; i < items.length ; i++){
		var row = items[i];
		row.order = i;
		newdata.push(row);
	}
	return newdata;
}

export const reorder = (list, startIndex, endIndex) => {
	const result = Array.from(list);
	const [removed] = result.splice(startIndex, 1);
	result.splice(endIndex, 0, removed);
	return result
}

export const setSession =async (string)=>{
	await localStorage.setItem(Root.token,string);
	return true;
}

export const deleteSession = ()=>{
	localStorage.removeItem(Root.token);
	return true;
}

export const validateUsername = (fld) =>{
        
	var error = "";

	if (fld === "") {
		error = "You didn't enter a username.\n";
		toast.error(error);
		return false;

	}else {

	}
	return true;
}



export const getSession =()=>{
	var session =  sessioninfor();
	if(session){
		return session;
	}else{
		return false;
	}
}

export const url_path = ()=>{
	return history.location.pathname;
}

export const sessioninfor = ()=>{
	let auth = localStorage.getItem(Root.token);
	return auth
}



export const jwt_ed = (string) =>{
	return jwt.encode(string,"admin");
}

export const jwt_de = (string) =>{
	return jwt.decode(string,"admin");
}

export const fake_session = () =>{
	localStorage.removeItem(Root.token);
}

export const set_page = (params,rdata)=>{
	let { page, perPage } = params;
	let totalPages = Math.ceil(rdata.data.length / perPage);
	let fdata = [];
	let newparams = {};
	if (page !== undefined && perPage !== undefined) {
		let calculatedPage = (page - 1) * perPage;
		let calculatedPerPage = page * perPage;
	  	if(calculatedPage > rdata.data.length){
			totalPages = Math.ceil(rdata.data.length / perPage);
			fdata = rdata.data.slice(0, perPage);
			newparams['page'] = 0;
			newparams['perPage'] = perPage;
		}else{
			fdata = rdata.data.slice(calculatedPage, calculatedPerPage);
			newparams = params;
		}
	}else {
		totalPages = Math.ceil(rdata.data.length / 10);
		fdata = rdata.data.slice(0, 10);
		newparams = params;
	}
	if(fdata.length === 0){
		newparams['page'] = 0;
		newparams['perPage'] = 10;
		fdata = rdata.data.slice(0, 10);
	}
	return {fdata : fdata,totalPages : totalPages,params : newparams}
}

export const instance = axios.create({
    baseURL: Root.adminurl,
    timeout: 50000,
    headers: {
		authorization: `${encodeURIComponent(sessioninfor())}`,
		"Content-Type": "application/json",
		"device": window.innerWidth,
		"user-device" : "web",
    },
});

export const AXIOS_REQUEST =async (url,inputdata,dispatch,loading) =>{
	try{
		if(loading){
			dispatch({type : "HOMEPAGELOADIN",data : true})
		}

		var	Response =  await instance.post( url , inputdata );
		if(loading){
			setTimeout(()=>{
				dispatch({type : "HOMEPAGELOADIN",data : false})

			},100)
		}
		if(Response.data){
			if(Response.data.session){
				fake_session();
				window.location.assign(LOGIN_URL);
			}else{
				return Response.data
			}
		}else{
			return {status : false,data : "error"}
		}
	}catch(e){
		if(loading){
			dispatch({type : "HOMEPAGELOADIN",data : false})
		}
		return {status : false,data : "error"}
	}
}

export const authinstance = axios.create({
    baseURL: Root.adminurl,
    timeout: 50000,
    headers: {
		authorization: `${sessioninfor()}`,
		"Content-Type": "application/json",
		"device": window.innerWidth,
		"user-device" : "web",
    },
});

export const instance_file = axios.create({
    baseURL: Root.adminurl,
    timeout: 150000000,
    headers: {
		authorization: `${sessioninfor()}`,
		// session : `${getSession()._id}`,
      "Content-Type": "application/json",
      "device": window.innerWidth,
    },
});

export const AXIOS_REQUEST_FILE =async (url,inputdata,dispatch,loading) =>{
	try{
		if(loading){
			dispatch({type : "HOMEPAGELOADIN",data : true})
		}
		var Response =  await instance_file.post(url,inputdata);
		if(loading){
			dispatch({type : "HOMEPAGELOADIN",data : false})
		}
		if(Response.data){
			return Response.data;
		}else{
			return {status : false,data : "error"}
		}
	}catch(e){
		if(loading){
			dispatch({type : "HOMEPAGELOADIN",data : false})
		}
		return {status : false,data : "server error"}
	}
}

