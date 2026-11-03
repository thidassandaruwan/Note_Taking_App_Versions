import { Route, Routes } from "react-router";
import HomePage from "./pages/HomePage";
import CreatePage from "./pages/CreatePage";
import NoteDetailPage from "./pages/NoteDetailPage";
import Navbar from "./components/Navbar";
import { useState } from "react";

const App = () => {
  const themeOptions = {
    lightTheme : "lemonade",
    darkTheme : "forest"
  };

  const [theme, setTheme] = useState("lemonade");

  return (
    <div className="relative h-full w-full" data-theme={theme}>
      <Navbar themeOptions={themeOptions} theme={theme} setTheme={setTheme}/>
        <Routes>
          <Route path="/" element={<HomePage/>} />
          <Route path="/create" element={<CreatePage/>} />
          <Route path="/note/:id" element={<NoteDetailPage/>} />
        </Routes>
    </div>
  )
}

export default App