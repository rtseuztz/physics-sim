import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import ScreenSaver from './components/ScreenSaver';

function App() {
  enum tabs {
    screensaver, df
  }
  var show = {
    "screensaver": false
  }
  const [currentTab, setCurrentTab] = useState<tabs>(tabs.df)
  function toggleShow(tab: tabs) {
    setCurrentTab(tab);
  }
  return (
    <div className="App">
      <header className="App-header">
        Physics engine
        <ul>
          <li onClick={() => toggleShow(tabs.screensaver)}>Screen Saver</li>
          <li onClick={() => toggleShow(tabs.df)}>Physics</li>
        </ul>
        <ScreenSaver show={currentTab === tabs.screensaver} />
      </header>
    </div>
  );
}

export default App;
