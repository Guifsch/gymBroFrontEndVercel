import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile";
import Workouts from "./pages/Workouts"
import Menu from "./components/Menu";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import PrivateRoute from "./components/PrivateRoute";
import SnackBar from "./components/SnackBar";
import { useSelector } from "react-redux";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const theme = createTheme({
  typography: {
    fontFamily: 'Helvica, Arial, sans-serif',
  },
});

function App() {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <ThemeProvider theme={theme}>
         <CssBaseline />
    <BrowserRouter>
      <SnackBar />
      {currentUser ? <Menu /> : false}
      <Routes>
        {/* Rotas não privadas */}
        <Route path="/" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        {/* Rotas privadas */}
        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/home" element={<Home />} />
          <Route path="/workouts" element={<Workouts />} />
        </Route>
      </Routes>
    </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
