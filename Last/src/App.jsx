import './App.css'
import { StoreProvider } from './context';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomeView from './views/HomeView';
import LoginView from './views/LoginView';
import RegisterView from './views/RegisterView';
import MoviesView from './views/MoviesView';
import ErrorView from './views/ErrorView';
import GenreLogin from './views/GenreView';
import DetailView from './views/DetailView';
import CartView from './views/CartView';
import SearchView from './views/SearchView';
import SettingsView from './views/SettingsView';
function App() {

  return (
    <StoreProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeView />} />
        <Route path="/login" element={<LoginView />} />
        <Route path="/register" element={<RegisterView />} />
        <Route path="/cart" element={<CartView />} />
        <Route path="/settings" element={<SettingsView />} />
        <Route path="/movies" element={<MoviesView />}>  
          <Route path="genre" element={<GenreLogin />}></Route>
          <Route path="genre" element={<GenreLogin />} />
          <Route path="genre/:genre_id" element={<GenreLogin />} />
          <Route path="search" element={<SearchView />}></Route>
          <Route path=":id" element={<DetailView />}></Route>
        </Route>
        
        <Route path="*" element={<ErrorView />} />
      </Routes>
    </BrowserRouter>
    </StoreProvider>
  )
}

export default App
