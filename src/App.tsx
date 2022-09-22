import React from 'react';
import logo from './logo.svg';
import './App.css';
import ScreenSaver from './components/ScreenSaver';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        Physics engine
        <ul>
          <li>Screen Saver</li>
          <li>Physics</li>
        </ul>
        <ScreenSaver />
      </header>
    </div>
  );
}

export default App;
