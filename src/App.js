import React from 'react';
import LogsPagination from './components/LogsPagination';
import './App.scss';

//const url = "https://api-project-127082253159-default-rtdb.europe-west1.firebasedatabase.app/data.json";

function App() {
  return (
    <div className="App">
       <LogsPagination />
    </div>
  );
}

export default App;
