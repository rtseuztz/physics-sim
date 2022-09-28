import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import ScreenSaver from './components/ScreenSaver';
import BallPit from './components/BallPit';
import Space from './components/Space';

function App() {
  enum tabs {
    screensaver, ballpit, space
  }
  var show = {
    "screensaver": false
  }
  const [currentTab, setCurrentTab] = useState<tabs>(tabs.screensaver);
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
      case tabs.ballpit:
        return <BallPit />
      case tabs.space:
        return <Space />
    }
  }
  return (
    <div className="App">
      <header className="App-header">
        Physics Engine
        <button onClick={() => toggleShow(tabs.screensaver)}>ScreenSaver</button>
        <button onClick={() => toggleShow(tabs.ballpit)}>BallPit</button>
        <button onClick={() => toggleShow(tabs.space)}>Space</button>
        {switchTab()}
      </header>
    </div>
  );
}

export default App;
