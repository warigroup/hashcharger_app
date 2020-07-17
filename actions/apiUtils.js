
export function offerAddUtil(offers) {
  let offeritems = offers.result;
  if (offeritems !== undefined ) {
    offeritems.forEach(function(item, index){
      item.display_hashrate = item.triggered ? item.declared_hashrate : item.measured_hashrate['1440'];
    });
  } 
 
  return offers;
};
