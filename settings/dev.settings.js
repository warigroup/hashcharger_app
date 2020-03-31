///##########
///##########  WariHash backend API URL
///##########


export const apiurl = "https://devapi.warihash.org";

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

export const alphaURL = "https://dev.warihash.org";


///##########
///########## Invoice Expiration Time In Minutes. Set your invoice expiration time here.
///########## 

export const invoiceExpMin = 30;
