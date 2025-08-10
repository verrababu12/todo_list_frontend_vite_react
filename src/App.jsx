import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Signup from "./components/SignUp";
import Login from "./components/Login";
import TodoList from "./components/TodoList";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("project_todo_token");
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={<Navigate to="/login" />} /> */}
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/todos"
          element={
            <PrivateRoute>
              <TodoList />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
