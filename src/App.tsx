import CoverMaker from './components/CoverMaker';
import Navbar from './components/Navbar';
import { ThemeProvider } from './context/ThemeContext';
import './index.css';

function App() {
  return (
    <ThemeProvider>
      <div className="app">
        <Navbar />
        <div className="app-content">
          <CoverMaker />
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
