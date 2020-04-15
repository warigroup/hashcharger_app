import MarketNav from "../common/MarketNav";

const PublicRoute = ({ children }) => (
  <main 
  style={{ padding: "0px", position: "relative", minHeight: "100vh" }}>
    {children}
    
    <MarketNav />
  </main>
);

export default PublicRoute;
