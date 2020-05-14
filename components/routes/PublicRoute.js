import MarketNav from "../common/MarketNav";

const PublicRoute = ({ children }) => (
  <main className="maincontainer1"
  style={{ padding: "0px", position: "relative", minHeight: "100vh" }}>
    <div className="maincontainer2">
    {children}
    
    <br />
    <br />
    <MarketNav />
    </div>
  </main>
);

export default PublicRoute;
