import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Form from './Quote/Form';
import Results from './Quote/Results';
import Compare from './Quote/Compare';

/* 
* Coded by: Tae Jung
*
*/

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Form />} /> 
          <Route path="/results" element={<Results />} /> 
          <Route path="/results/compare" element={<Compare />} /> 
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
