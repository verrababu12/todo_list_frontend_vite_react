import React, { useState, useEffect } from "react";
import { TbRefresh } from "react-icons/tb";
import { ClipLoader } from "react-spinners";
import TodoItem from "../TodoItem";
import axios from "axios";
import { API_URL } from "../../api";
import "./index.css";
import { useNavigate } from "react-router-dom"; // 👈 for navigation

const apiStatusConstants = {
  initial: "INITIAL",
  loading: "LOADING",
  success: "SUCCESS",
  failure: "FAILURE",
};

const TodoList = () => {
  const [todoList, setTodoList] = useState([]);
  const [todosCount, setTodosCount] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [editingTodoId, setEditingTodoId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial);
  const [searchInput, setSearchInput] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");

  const token = localStorage.getItem("my_todo_project_token");
  const authConfig = { headers: { Authorization: `Bearer ${token}` } };

  const navigate = useNavigate(); // 👈 hook for redirect

  useEffect(() => {
    fetchTodoList();
  }, []);

  const fetchTodoList = async () => {
    setApiStatus(apiStatusConstants.loading);
    try {
      const res = await axios.get(`${API_URL}/api/todos`, authConfig);
      setTodoList(res.data);
      setTodosCount(res.data.length);
      setApiStatus(apiStatusConstants.success);
    } catch (error) {
      console.error("Error fetching todos:", error);
      setApiStatus(apiStatusConstants.failure);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("my_todo_project_token"); // remove token
    navigate("/"); // redirect to login page
  };

  const onAddTodo = async () => {
    if (!userInput.trim()) {
      alert("Enter valid text");
      return;
    }
    const newTodo = {
      text: userInput,
      uniqueNo: todosCount + 1,
      isChecked: false,
    };
    try {
      const res = await axios.post(
        `${API_URL}/api/todos/add-todo`,
        newTodo,
        authConfig
      );
      setTodoList((prevTodos) => [...prevTodos, res.data]);
      setTodosCount((prevCount) => prevCount + 1);
      setUserInput("");
    } catch (error) {
      console.error("Error adding todo:", error);
      alert("Error adding todo");
    }
  };

  const onTodoStatusChange = async (todoId, newCheckedValue) => {
    try {
      const res = await axios.put(
        `${API_URL}/api/todos/${todoId}`,
        { isChecked: newCheckedValue },
        authConfig
      );
      setTodoList((prev) =>
        prev.map((todo) => (todo._id === todoId ? res.data : todo))
      );
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  const onDeleteTodo = async (todoId) => {
    try {
      await axios.delete(`${API_URL}/api/todos/${todoId}`, authConfig);
      setTodoList((prev) => prev.filter((todo) => todo._id !== todoId));
      setTodosCount((prevCount) => prevCount - 1);
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const startEditingTodo = (todo) => {
    setEditingTodoId(todo._id);
    setEditingText(todo.text);
  };

  const handleEditInputChange = (event) => {
    setEditingText(event.target.value);
  };

  const saveEditedTodo = async () => {
    try {
      await axios.put(
        `${API_URL}/api/todos/${editingTodoId}`,
        { text: editingText },
        authConfig
      );
      setEditingTodoId(null);
      setEditingText("");
      fetchTodoList();
    } catch (error) {
      console.error("Error saving edited todo:", error);
      alert("Error saving changes");
    }
  };

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };

  const handleEditKeyPress = (event) => {
    if (event.key === "Enter") {
      saveEditedTodo();
    }
  };

  const renderLoadingView = () => (
    <div className="loading-container">
      <ClipLoader visible="true" height="80" width="80" color="#4fa94d" />
    </div>
  );

  const renderFailureView = () => (
    <div>
      <h1>Something went wrong!</h1>
    </div>
  );

  const onClickRefreshBtn = () => {
    fetchTodoList();
  };

  const renderTodos = () => {
    const filteredTodos = todoList.filter((todo) => {
      const matchesSearch = todo.text
        .toLowerCase()
        .includes(searchInput.toLowerCase());
      const matchesStatus =
        filterStatus === "ALL"
          ? true
          : filterStatus === "COMPLETED"
          ? todo.isChecked
          : !todo.isChecked;
      return matchesSearch && matchesStatus;
    });

    if (filteredTodos.length === 0) {
      return (
        <div className="no-todos-message">
          <p>No todos found</p>
        </div>
      );
    }

    return (
      <ul className="todo-items-container">
        {filteredTodos.map((todo) => (
          <TodoItem
            key={todo._id}
            todo={todo}
            editingTodoId={editingTodoId}
            editingText={editingText}
            onTodoStatusChange={onTodoStatusChange}
            onDeleteTodo={onDeleteTodo}
            startEditingTodo={startEditingTodo}
            onEditInputChange={handleEditInputChange}
            onEditKeyPress={handleEditKeyPress}
            saveEditedTodo={saveEditedTodo}
          />
        ))}
      </ul>
    );
  };

  const listView = () => {
    switch (apiStatus) {
      case apiStatusConstants.loading:
        return renderLoadingView();
      case apiStatusConstants.success:
        return renderTodos();
      case apiStatusConstants.failure:
        return renderFailureView();
      default:
        return null;
    }
  };

  return (
    <div className="background-container">
      <div className="todo-app-container">
        <div className="header-row">
          <h1>Todo List</h1>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>

        <input
          type="text"
          value={userInput}
          onChange={handleInputChange}
          className="todo-input"
          placeholder="What needs to be done?"
        />
        <button onClick={onAddTodo} className="add-todo-button">
          Add Todo
        </button>

        <div className="save-head-container">
          <p>Create Tasks</p>
          <button
            type="button"
            onClick={onClickRefreshBtn}
            className="refresh-button"
            disabled={apiStatus === apiStatusConstants.loading}
          >
            <TbRefresh size={18} />
          </button>
        </div>

        <div className="search-filter-container">
          <input
            type="search"
            className="todo-input"
            placeholder="Search Your Todo"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <div className="filter-dropdown-wrapper">
            <select
              className="todo-filter-select"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="ALL">All</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>
        </div>

        {listView()}
      </div>
    </div>
  );
};

export default TodoList;
