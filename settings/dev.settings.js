///##########
///##########  WariHash backend API URL
///##########


export const apiurl = "https://devapi2.warihash.org";

///#########
///#########  Mining algorithms. Add or remove mining algorithms here.
///#########

export const algorithms = ["sha256d", "scrypt", "ethash", "handshake"];

///#########
///#########  Miner locations. Add or remove miner locations here.
///#########

export const minerLocations = [ 
    {name: 'North America East (New York)', value: 'NA East'}, 
    {name: 'North America West (San Francisco)', value: 'NA West'},
    {name: 'Europe West (Amsterdam)', value: 'EU West'}    
];

///#########
///#########  Hashrate units for addminers dropdown menus. Add or remove hashrate units here.
///#########

export const hashrateUnits = [ 
    {name: 'KH/s', value: 'K'}, 
    {name: 'MH/s', value: 'M'},
    {name: 'GH/s', value: 'G'},
    {name: 'TH/s', value: 'T'}
];

///#########
///#########  Authentication Token 
///#########

export const authToken = 'Token abc92e1b66edecf39095f8b6c6c32143754d6454'

///#########
///#########  Maintenance Mode. Setting maintenanceMode to "true" will create a maintenance version build.
///#########  Make sure to leave apiurl selected while using maintenance build.
///#########

export const maintenanceMode = "false";

// export const maintenanceMode = "true";

///#########
///#########  Google Analytics, Google tags, Facebook Pixel. "off" will deactivate Google analytics, 
///#########  Google conversion tag, and Facebook Pixel. Set them to "on" when you deploy this app.
///#########  

export const googleAnalytics = "off"; 

// export const googleAnalytics = "on";

export const facebookPixel = "off";

// export const facebookPixel = "on";

///##########
///########## Search Engine Index Option. Setting it to "on" will activate SEO tags. 
///########## Set it to "off" before deploying this app on dev.warihash
///########## 

export const searchEngine = "off";

// export const searchEngine = "on";

///##########
///########## Alpha URL
///########## 

export const alphaURL = "https://devmarket.warihash.org";


///##########
///########## Invoice Expiration Time In Minutes. Set your invoice expiration time here.
///########## 

export const invoiceExpMin = 60;
