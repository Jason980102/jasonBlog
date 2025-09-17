import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './components/layout/ThemeProvider';
import { LangProvider } from './components/layout/LangProvider';
import { Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './components/Home';
import Projects from './components/Projects';
import TravelRecord from './components/TravelRecord';
import Certificate from './components/Certificate';


const App: React.FC = () => {
  return (
    <LangProvider>
      <ThemeProvider>
        <Router>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/travel-record" element={<TravelRecord />} />
              <Route path="/TravelRecord" element={<Navigate to="/travel-record" replace />} />
              <Route path="/certificate" element={<Certificate />} />
            </Route>
          </Routes>
        </Router>
      </ThemeProvider>
    </LangProvider>
  );
};

export default App;
