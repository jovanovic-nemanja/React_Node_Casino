const exchgXmlConfig = require("../config/exchgXmlConfig");
const EXCHGCONFIG = require("../config/exchgXmlConfig");
var request = require('request');

var sendRequest = async (body , callback) => {
	var options = {
	  'method': EXCHGCONFIG.METHOD,
	  'url': EXCHGCONFIG.URL,
	  'headers': EXCHGCONFIG.BASEHEADER,
	  body: body
	};
	request(options, async (error, response) => {
	  if(error) {
		callback(false);
		return;
	  }
	  try {
		parser.parseString(response.body , (err , data) => {
		  if(err){
			callback(false);
			return;          
		  }else{
			callback(data['soap:Envelope']['soap:Body'][0]);
			return;
		  }
		})
	  } catch (error) {
		callback(false);
		return;
	  }
	});
}

async function run(){
    await sendRequest(exchgXmlConfig.GetMarketInformation(178244) , async (MarketInformationData) => {
        if(MarketInformationData){
        }
    })
    GetMarketInformation
}
