const CryptoJS = require('crypto-js');
const BASECONTROL = require("../basecontroller");
const moment= require('moment');
const { BalanceUpdate, PayoutOrder } = require("./init")
const { GamePlay } = require("../../models/users_model");
const { Paymentconfig, TransactionsHistory, WithdrawHistory, PaymentMethod } = require("../../models/paymentGateWayModel");
const PAYMENTCONFIG = require("../../config/paymenterror.json");
const Request = require("request");

const profileId = "8FDB433B67584652A4320BDD5056E63A";
const SecretWord = "1b5595f6a5";
const MerchantCode = "3855";
const MerchantPassword = "aL85GkICPV1Bx0";
const CurrencyCode = "356";
const LanguageCode = 'en';
const BaseUrl = "https://www.apsp.biz/pay/fp5a/Checkout.aspx";
const tokenGetUrl = "https://apsp.biz/merchanttools/MerchantTools.svc/BuildXMLToken";

const RedirectionUrl = "https://cms.kasagames.com/admin/paymentGateWay/ApcoPayRedirection";
const StatusUrl = "https://cms.kasagames.com";
// const StatusUrl = "https://cms.kasagames.com/admin/paymentGateWay/ApcoPayStatus";
const FailedUrl = "https://kasagames.com/admin/paymentGateWay/ApcoPayFailed";

exports.ApcoCheckout = async (req , res , next) => {
  const { value , email , Oref } = req.body;  

  var xmlData =
    '<Transaction hash="'+SecretWord+'">' +
    '<RedirectionURL>'+RedirectionUrl+'</RedirectionURL>' +
    '<status_url urlEncode="true">'+StatusUrl+'</status_url>' +
    '<FailedRedirectionURL>'+FailedUrl+'</FailedRedirectionURL>' +
    '<ProfileID>'+profileId+'</ProfileID>' +
    '<ActionType>1</ActionType>' +
    '<Value>'+value+'</Value>' +
    '<Curr>'+CurrencyCode+'</Curr>' +
    '<Lang>'+LanguageCode+'</Lang>' +
    '<ORef>'+Oref+'</ORef>' +
    '<Email>'+email+'</Email>' +
    '<Address/>' +
    '<RegCountry/>' +
    '<UDF1/>' +
    '<UDF2/>' +
    '<UDF3/>' +
    '<TEST/>' +
    '</Transaction>';

  var encodedXmlData = encodeURIComponent(xmlData);

  var xmlTokenFetchData = {
    'MerchID': MerchantCode,
    'MerchPass': MerchantPassword,
    'XMLParam': encodedXmlData
  }

  let options = {
    'method': 'POST',
    'url': tokenGetUrl,
    'headers': {
        'Content-Type': 'application/json'
    },
  }

  console.log(options , req.body , xmlData ,encodedXmlData)

  Request.post({...options, body : JSON.stringify(xmlTokenFetchData) }, async (error, response) => {
    if (error){
      return res.json({ status : false, data : "failed"})
    }else{
      if(response.statusCode == 400){
          return res.json({ status : false, data : "failed"})
      }else{
        var resultData = JSON.parse(response.body)
        var fastUrl = resultData.BaseURL + resultData.Token;
        res.json({status : true , data : fastUrl});
        return next();
      }
    }
  });
}

exports.ApcoPayRedirection = async(req , res , next) => {
  console.log("here is ApcoPayRedirection");
  console.log(req.body);
  console.log("===============================================================");

  res.send(true);
  next();
}
exports.ApcoPayStatus = async(req , res , next) => {
  console.log("here is ApcoPayStatus");
  console.log(req.body);
  console.log("===============================================================");

  res.send(true);
  next();
}
exports.ApcoPayFailed = async(req , res , next) => {
  console.log("here is ApcoPayFailed");
  console.log(req.body);
  console.log("===============================================================");

  res.send(true);
  next();
}