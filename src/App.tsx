import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import MovieTab from "./components/MovieTab"
import DirectorTab from './components/DirectorTab'
import ReviewTab from './components/ReviewTab'
import Home from './components/Home'
import { ReactElement, SyntheticEvent, useState } from 'react';

function App(): ReactElement {

  const [tab, setValue] = useState("1");

  const changeTab = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <>

      <Tabs sx={{ backgroundColor: "rgb(30, 30, 30)"}} value={tab} onChange={changeTab} centered>
        <Tab label="Home" value="1" style={{color:"white"}}/>
        <Tab label="Movies" value="2" style={{color:"white"}} />
        <Tab label="Directors" value="3" style={{color:"white"}} />
        <Tab label="Reviews" value="4" style={{color:"white"}} />
      </Tabs>

      {tab === "1" && <Home />}
      {tab === "2" && <MovieTab />}
      {tab === "3" && <DirectorTab />}
      {tab === "4" && <ReviewTab />}

    </>
  )
}

export default App
