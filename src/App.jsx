import { useState } from 'react'
import './scss/main.scss'
import Form from './components/Form'
import Results from './components/Results'

function App() {
 const [showResults, setShowResults] = useState(false);

 const showRes = () => {
  setShowResults(prev => !prev)
 }
  return (
    <div className="container">
      <h1>Train schedule</h1>
      {!showResults ? 
       <Form showRes={showRes}/> : 
       <Results showRes={showRes}/>
      } 
    </div>
  )
}

export default App
