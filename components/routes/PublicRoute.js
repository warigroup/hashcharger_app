import MarketNav from "../common/MarketNav";

const PublicRoute = ({ children }) => (
  <main style={{padding: "0px"}}>
    {children}
    
    <MarketNav />
  </main>
);

export default PublicRoute;
