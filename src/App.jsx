import { BrowserRouter, Routes, Route } from "react-router-dom";
import { FilterProvider } from "./contexts/FilterContext";
import MainGridWrapper from "./components/MainGridWrapper";

function App() {
  return (
    <div>
      <FilterProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MainGridWrapper />} />
          </Routes>
        </BrowserRouter>
      </FilterProvider>
    </div>
  );
}

export default App;
