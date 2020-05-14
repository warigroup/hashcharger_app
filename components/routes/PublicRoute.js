import MarketNav from "../common/MarketNav";

const PublicRoute = ({ children }) => (
  <main 
  style={{ padding: "0px", position: "relative", minHeight: "100vh" }}>
    {children}
    
    <br />
    <br />
    <MarketNav />
  </main>
);

export default PublicRoute;
