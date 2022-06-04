import { ThemeProvider } from '@emotion/react';
import { CssBaseline } from '@mui/material';
import { Route, Routes } from 'react-router-dom';
import Continent from './Continent';
import Home from './Home';
import DataProvider from './Provider/DataProvider';
import { theme } from './theme';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <DataProvider>
        <CssBaseline />
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="continent" element={<Continent />} />
        </Routes>
      </DataProvider>
    </ThemeProvider>
  );
}

export default App;
