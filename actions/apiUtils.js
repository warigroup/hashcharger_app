//// ADDITIONAL PARSING FOR API DATA ////////////

// adds additional items to entries in get_offer API call
export function offerAddUtil(offers) {
  let offeritems = offers.result;
  if (offeritems !== undefined ) {
    offeritems.forEach(function(item, index){
      // this is hashrate that should be displayed to users on table columns
      // triggered offers do not require hashrate measurements, but depend on declared hashrates
      // normal offers we display the 24 hour hashrate
      item.display_hashrate = item.triggered ? item.declared_hashrate : item.measured_hashrate['1440'];
  
    });
  } 
 
  return offers;
};
