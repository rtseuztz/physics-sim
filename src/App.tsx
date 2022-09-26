import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import ScreenSaver from './components/ScreenSaver';
import BallPit from './components/BallPit';

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
  /**
   * Switch between tabs, hiding all but the current tab
   */
  function switchTab(): JSX.Element {
    switch (currentTab) {
      case tabs.screensaver:
        return <ScreenSaver />
      case tabs.df:
        return <BallPit />
    }
  }
  return (
    <div className="App">
      <header className="App-header">
        Physics Engine
        <button onClick={() => toggleShow(tabs.screensaver)}>ScreenSaver</button>
        <button onClick={() => toggleShow(tabs.df)}>BallPit</button>
        {switchTab()}
      </header>
    </div>
  );
}

export default App;
