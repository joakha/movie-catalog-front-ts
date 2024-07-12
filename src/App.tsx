import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import DirectorTab from './components/DirectorTab'
import Home from './components/Home'
import { SyntheticEvent, useState } from 'react';

function App() {

  const [tab, setValue] = useState("1");

  const changeTab = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <>

      <Tabs sx={{ backgroundColor: "rgb(30, 30, 30)" }} value={tab} onChange={changeTab} centered>
        <Tab label="Home" value="1" style={{ color: "white" }} />
        <Tab label="Directors" value="2" style={{ color: "white" }} />
      </Tabs>

      {tab === "1" && <Home />}
      {tab === "2" && <DirectorTab />}

    </>
  )
}

export default App
