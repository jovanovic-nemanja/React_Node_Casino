exports.METHOD = "POST";
exports.ReadOnlyService = 'https://api.test03-fimbet.com/v2.0/ReadOnlyService.asmx';
exports.SecureService = 'https://api.test03-fimbet.com/v2.0/Secure/SecureService.asmx';
// exports.ReadOnlyService = 'https://brk0401w01-externalapi-webservice.test03-fimbet.com/v2.0/ReadOnlyService.asmx';
exports.BASEHEADER = {
    'Content-Type': 'text/xml'
}
exports.SECUREBASEHEADER = {
    'Content-Type': 'application/soap+xml'
}

exports.ListTopLevelEvents = () => {
    var xmlData = '<?xml version="1.0" encoding="utf-8"?>\
    \n<soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">\
    \n  <soap12:Header>\
    \n    <ExternalApiHeader version="2" languageCode="en" username="fimapi001" password="TestIntegration" currency="GBP"  xmlns="http://www.GlobalBettingExchange.com/ExternalAPI/" />\
    \n  </soap12:Header>\
    \n  <soap12:Body>\
    \n    <ListTopLevelEvents xmlns="http://www.GlobalBettingExchange.com/ExternalAPI/">\
    \n    <listTopLevelEventsRequest />\
    \n    </ListTopLevelEvents>\
    \n  </soap12:Body>\
    \n</soap12:Envelope>';
    return xmlData;
}

exports.GetEventSubTreeNoSelections = (ids) => {
    var xmlData = '<?xml version="1.0" encoding="utf-8"?>\
    \n<soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">\
    \n  <soap12:Header>\
    \n    <ExternalApiHeader version="2" languageCode="en" username="fimapi001" password="TestIntegration" currency="GBP"  xmlns="http://www.GlobalBettingExchange.com/ExternalAPI/" />\
    \n  </soap12:Header>\
    \n  <soap12:Body>\
    \n    <GetEventSubTreeNoSelections xmlns="http://www.GlobalBettingExchange.com/ExternalAPI/">\
    \n      <getEventSubTreeNoSelectionsRequest>';
    for(var i = 0 ; i < ids.length ; i ++){
        xmlData += '\n <EventClassifierIds>' + ids[i].Id + '</EventClassifierIds>';
    }
    xmlData += '\n      </getEventSubTreeNoSelectionsRequest>\
    \n    </GetEventSubTreeNoSelections>\
    \n  </soap12:Body>\
    \n</soap12:Envelope>';
    return xmlData
}

exports.GetMarketInformation = (id) => {
    var xmlData = '<?xml version="1.0" encoding="utf-8"?>\
    \n<soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">\
    \n  <soap12:Header>\
    \n    <ExternalApiHeader version="decimal" languageCode="string" username="string" password="string" applicationIdentifier="string" xmlns="http://www.GlobalBettingExchange.com/ExternalAPI/" />\
    \n  </soap12:Header>\
    \n  <soap12:Body>\
    \n    <GetMarketInformation xmlns="http://www.GlobalBettingExchange.com/ExternalAPI/">\
    \n      <getMarketInformationRequest>\
    \n        <MarketIds>' + id + '</MarketIds>\
    \n      </getMarketInformationRequest>\
    \n    </GetMarketInformation>\
    \n  </soap12:Body>\
    \n</soap12:Envelope>';
    return xmlData;
}

exports.GetPrices = (ids) => {
    var xmlData = '<?xml version="1.0" encoding="utf-8"?>\
    \n<soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">\
    \n  <soap12:Header>\
    \n    <ExternalApiHeader version="2" languageCode="en" username="fimapi001" password="TestIntegration" currency="GBP"  xmlns="http://www.GlobalBettingExchange.com/ExternalAPI/" />\
    \n  </soap12:Header>\
    \n  <soap12:Body>\
    \n    <GetPrices xmlns="http://www.GlobalBettingExchange.com/ExternalAPI/">\
    \n      <getPricesRequest ThresholdAmount="0" NumberForPricesRequired="3" NumberAgainstPricesRequired="3">';
    for(var i = 0 ; i < ids.length ; i ++){
        xmlData += '\n<MarketIds>'+ids[i]+'</MarketIds>'
    }
    xmlData += '\n</getPricesRequest>\
    \n    </GetPrices>\
    \n  </soap12:Body>\
    \n</soap12:Envelope>';
    return xmlData;
}

exports.PlaceOrdersNoReceipt = (betData) => {
    var xmlData = '<?xml version="1.0" encoding="utf-8"?>\
    \n<soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">\
    \n  <soap12:Header>\
    \n    <ExternalApiHeader version="2" languageCode="en" username="fimapi001" password="TestIntegration" currency="GBP"  xmlns="http://www.GlobalBettingExchange.com/ExternalAPI/" />\
    \n  </soap12:Header>\
    \n  <soap12:Body>\
    \n    <PlaceOrdersNoReceipt xmlns="http://www.GlobalBettingExchange.com/ExternalAPI/">\
    \n      <placeOrdersNoReceiptRequest>\
    \n        <Orders>\
    \n          <Order \
    \n              SelectionId="' + betData.SelectionId + '" \
    \n              Stake="' + betData.Stack + '" \
    \n              Price="' + betData.Price + '" \
    \n              Polarity="' + betData.Polarity + '" \
    \n              ExpectedSelectionResetCount="'+betData.ExpectedSelectionResetCount+'" \
    \n              ExpectedWithdrawalSequenceNumber="'+betData.WithdrawalSequenceNumber+'" \
    \n              CancelOnInRunning="false" \
    \n              CancelIfSelectionReset="false" \
    \n              PunterReferenceNumber="1" \
    \n           />\
    \n        </Orders>\
    \n        <WantAllOrNothingBehaviour>true</WantAllOrNothingBehaviour>\
    \n      </placeOrdersNoReceiptRequest>\
    \n    </PlaceOrdersNoReceipt>\
    \n  </soap12:Body>\
    \n</soap12:Envelope>';
    return xmlData;
}

exports.GetAccountBalances = () => {
    var xmlData = '<?xml version="1.0" encoding="utf-8"?>\
    \n<soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">\
    \n  <soap12:Header>\
    \n    <ExternalApiHeader version="2" languageCode="en" username="fimapi001" password="TestIntegration" currency="GBP"  xmlns="http://www.GlobalBettingExchange.com/ExternalAPI/" />\  \
    \n  </soap12:Header>\
    \n  <soap12:Body>\
    \n    <GetAccountBalances xmlns="http://www.GlobalBettingExchange.com/ExternalAPI/">\
    \n      <getAccountBalancesRequest />\
    \n    </GetAccountBalances>\
    \n  </soap12:Body>\
    \n</soap12:Envelope>';
    return xmlData
}