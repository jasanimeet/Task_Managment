import React, { useState } from "react";
import Devextrim from "./Devextrim";
import DevExtrimIndex2 from './DevExtrimIndex2';
import DevExtrimTwo from "./DevExtrimTwo";

const App = () => {
  const [selectedView, setSelectedView] = useState("Option 1");
  const [selectedData, setSelectedData] = useState("");
  const option1task = (data) => {
    setSelectedView(data);
    setSelectedData("")
  }
  return (
    <div>
      <div 
      style={{ 
        display: "flex",
        // alignItems: "center", 
        position: 'absolute',
        zIndex: '10',
        // justifyContent: 'center'
        marginTop: '10px',  
        width: '165px', }}
      >

        <div style={{ marginRight: "20px" }}>
          {/* Option 1 */}
          <span
            style={{
              padding: "4px",
              border: selectedView === "Option 1" ? "2px solid blue" : "2px solid gray",
              borderRadius: "5px",
              cursor: "pointer",
            }}
            onClick={() => option1task('Option 1')}
          >
            Report 1
          </span>
        </div>
        <div>
          {/* Option 2 */}
          <span
            style={{
              padding: "4px",
              border: selectedView === "Option 2" ? "2px solid blue" : "2px solid gray",
              borderRadius: "5px",
              cursor: "pointer",
            }}
            onClick={() => option1task("Option 2")}
          >
            Report 2
          </span>
        </div>
      </div>
      {selectedView === "Option 2" ? <DevExtrimTwo selectedData={selectedData} setSelectedData={setSelectedData}/> : <Devextrim setSelectedView={setSelectedView} setSelectedData={setSelectedData}/>}
    </div>
  );
};

export default App;
