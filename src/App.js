import './App.css';
import { StrictMode } from "react";
import FileUploadPage from './upload.js'

function App() {
  return (
    <StrictMode>
    <div className="container">
      <div className="header">Legal AI</div>  
      <FileUploadPage />
    </div>
    </StrictMode>
  );
}

export default App;
