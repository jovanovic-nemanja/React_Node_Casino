//////////---------------players--------------------
export const players_kyc_optinos = {
    "0" : 'BankSlip',
    "1" : 'IdentityDocument',
    "2" : 'passport',
    "3" : 'DriversLicense',
    "4" : 'IBAN',
    "5" : 'SocialId',
    "6" : 'other',
}
export const test = [
    { value: true, label: "Test" },
    { value: false, label: "Both" },
  ];


export const providerconfig = {
    "CASINO/SLOTS" : "1",
    "LIVECASINO" : "2",
    "VIRTUALGAMES" : "3",
    "POKER" : "4",
    "COCKFIGHT" : "5",
    "ANIMAL" : "6"
};

export const providerconfig_key = {
    "1" : "CASINO/SLOTS",
    "2" : "LIVECASINO",
    "3" : "VIRTUALGAMES",
    "4" : "POKER",
    "5" : "COCKFIGHT",
    "6" : "ANIMAL"
};

export const key_providers =[
    {label : "CASINO/SLOTS",value : "1"},
    {label : "LIVECASINO",value : "2"},
    {label : "VIRTUALGAMES",value : "3"},
    {label : "POKER",value : "4"},
    {label : "COCKFIGHT",value : "5"},
    {label : "ANIMAL",value : "6"},
]

export const money_option = [
    { value : "1" ,label : "Fixed Monthly"},  
    {value :  "2" ,label  : "Fixed Annnual"},
    {value :  "3"  ,label : "Rake"},
    {value :  "4"  ,label : "GGR" },
    {value :  "5"  ,label : "MMG < GGR"},
]

export const value_options = {
    "1" : "Fixed Monthly",
    '2' : "Fixed Annnual",
    "3" : "Rake",
    "4" : "GGR",
    "5" : "MMG < GGR",
}

export const value_moneys1 = {
    "1" : "USD",
    "2" : "INR",
    "3" : "EUR",
    // "4" : "%"
}

export const moneys_option1 = [
    {label : "USD",value : "1"},
    {label : "INR",value : "2"},
    {label : "EUR",value : "3"},
]

export const moneys_option2 = [
    {label : "%",value : "4"},   
]

export  const status_options = [
    { value: "allow", label: "allow" },
    { value: "pending", label: "pending" },
    { value: "block", label: "block" },
]

export const Playerstate_options = [
    {value : "0",label : "All"},
    {value : "1",label : "Real"},
    {value : "2",label : "test"}
]


export const Bonus_options =[
    {value : "0",label : "Both"},
    {value : "1",label : "yes"},  
    {value : "2",label : "No"}  
]

export const currency_options = [
    {value : "0",label : "All"},
    {value : "1",label : "Indian Rupee"},
]

export const basic_options = [
    {value : "0",label : "All"},
]

export const Payment_options = [
    {value : "0",label : "All"},
    
]

export const PaymentState_options = [
    {value : "pending",label : "pending"},
    {value : "failed",label : "failed"},
    {value : "success",label : "success"}
]
export const PaymentType_options = [
    {value : "netcents",label : "netcents"},
    {value : "YaarPay",label : "YaarPay"},
    {value : "Qpay",label : "Qpay"}
]

export const gender = [
    { value: "Male", label: "Male" },
    { value: "FeMale", label: "FeMale" },
]

export const Amount_Types = [
    { value : "1",label : "CASH"},
    { value : "2",label : "BONUS"}
]

export const Object_AmountTypes = {
    1 : "CASH",
    2 : "BONUS"
}

export const Bonus_types = [
    { value : 1,label : "SPORTS"},
    { value : 2,label : "CASINO"},
]

export const pagenation_set =[
    10,25,50,100
]

// export const rolesoptions = [
//     { label :  "CMS admin",value : "CMS admin"},
//     { label :  "Super agent",value : "Super agent"},
//     { label :  "UI/UX editor",value : "UI/UX editor"},
//     { label :  "accounts",value : "accounts"},
//     { label :  "admin",value : "admin"},
//     { label :  "affiliates",value : "affiliates"},
//     { label :  "casino Manager",value : "casino Manager"},
//     { label :  "players",value : "players"},
//     { label :  "promotion Manager",value : "promotion Manager"},
//     { label :  "risk Manager",value : "risk Manager"},
//     { label :  "sportsbook Manager",value : "sportsbook Manager"},
//     { label :  "superadmin",value : "superadmin"},
// ]

export const selectedStyle = {
    rows: {
        selectedHighlighStyle: {
            backgroundColor: "rgba(115,103,240,.05)",
            color: "#7367F0 !important",
            boxShadow: "0 0 1px 0 #7367F0 !important",
            "&:hover": {
            transform: "translateY(0px) !important"
            }
        }  
    }
}

export const playerid = "1602594948425"

export const bazaartype = [
    { label : "regular" ,value :  "1"},
    { label : "king-bazaar" ,value :  "2"},
    { label : "starline" ,value :  "3"},
]

export const postCalled = [
    { label : "Open and Close" ,value :  "3"},
    // { label : "Only Open" ,value :  "1"},
    // { label : "Only Close" ,value :  "2"},
]

export const postCalled1 = [
    { label : "Only Open" ,value :  "1"},
]

export const postCalled2 = [
    { label : "Open, Close and Interval" ,value :  "4"},
]

export const postCalled3 = [
    { label : "Only Open" ,value :  "1"},
    { label : "Only Close" ,value :  "2"},
    { label : "Open and Close both" ,value :  "3"},
    { label : "Open, Close and Interval" ,value :  "4"},
]

export const ownerShip = [
    { label : "Ownership" ,value :  "1"},
    { label : "Partnership" ,value :  "2"},
]

export const Bazaartype = {
    "1" : "regular",
    "2" : "king-bazaar",
    "3" : "starline"
  }

export const PaymentStatus_bool = {
    Approve :"Approve",
    Reject : "Reject",
    Paid : "Paid",
    pending : "pending",
    Onhold : "OnHold"
}

export const Bazaartype_key = {
    "regular" : "1",
    "king-bazaar" : "2",
    "starline" : "3"
}

export const Gamelist  = [
    "BAZAAR Name",
    "Result",
    "result announcer",
    "Single Ank",
    "Jodi",
    "Single Pana",
    "Double Pana",
    "Tripple Pana",
    "Half Sangam",
    "Full Sangam",
]

export const games_id_key = {
    "Jodi" : "5fc934917dd9d342e2dd42c5",
    "single ank" : "5fc930b87dd9d342e2dd42c3",
    "single pana" : "5fc9e0b980a8e211dea0ddaa",
    "double pana" : "5fc9e0c480a8e211dea0ddab",
    "tripple pana" : "5fcdb81c65fd7c228d9d2224",
    "half sangam" : "5fcf027188835f04b5f2f86b",
    "full sangam" : "5fcf028888835f04b5f2f86c"
}

export const roomType = [
    { value: 'NL Holdem', label: 'NL Holdem' },
    { value: 'PL Holdem', label: 'PL Holdem' },
    { value: 'NL 6+ Holdem', label: 'NL 6+ Holdem' },
    { value: 'PL Omaha', label: 'PL Omaha' },
    { value: 'PL Five Card Omaha', label: 'PL Five Card Omaha' }
]