import React, { useState } from 'react';
import './App.css';
import Cron from './Cron';

function App() {
  const [cornExp, updateCornExp] = useState('');
  return (
    <div className="App">
      <p>Expression: {cornExp}</p>
      <Cron
        name='triggerPeriod'
        selectedDate={new Date()}
        onChange={ data => {
          updateCornExp(data.value);
        }}
        value={cornExp}
      />
    </div>
  );
}

export default App;
