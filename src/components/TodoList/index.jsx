import React, { useState, useEffect } from "react";
import TodoItem from "../TodoItem";
import "./index.css";
import { API_URL } from "../../api";
import axios from "axios";

const TodoList = ({ onLogout }) => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const token = localStorage.getItem("project_todo_token");

  const authConfig = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/todos`, authConfig);
      setTodos(res.data);
    } catch (err) {
      console.error(err);
      alert("Error fetching todos");
    }
  };

  const addTodo = async () => {
    if (!newTodo.trim()) return;
    try {
      const res = await axios.post(
        `${API_URL}/api/todos/add-todo`,
        { text: newTodo },
        authConfig
      );
      setTodos([res.data, ...todos]);
      setNewTodo("");
    } catch (err) {
      console.error(err);
      alert("Error adding todo");
    }
  };

  const toggleTodo = async (id, isChecked) => {
    try {
      const res = await axios.put(
        `${API_URL}/api/todos/${id}`,
        { isChecked: !isChecked },
        authConfig
      );
      setTodos(todos.map((t) => (t._id === id ? res.data : t)));
    } catch (err) {
      console.error(err);
      alert("Error updating todo");
    }
  };

  const saveEdit = async (id, text) => {
    try {
      const res = await axios.put(
        `${API_URL}/api/todos/${id}`,
        { text },
        authConfig
      );
      setTodos((prev) => prev.map((t) => (t._id === id ? res.data : t)));
    } catch (err) {
      console.error(err);
      alert("Error editing todo");
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/todos/${id}`, authConfig);
      setTodos(todos.filter((t) => t._id !== id));
    } catch (err) {
      console.error(err);
      alert("Error deleting todo");
    }
  };

  const logout = () => {
    localStorage.removeItem("project_todo_token"); // fixed key
    if (onLogout) onLogout();
    else window.location.reload();
  };

  return (
    <div className="todo-container">
      <div className="todo-header">
        <h2>Your Todos</h2>
        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </div>

      <div className="todo-input">
        <input
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add todo..."
        />
        <button onClick={addTodo}>Add</button>
      </div>

      <ul className="todo-list">
        {todos.map((todo) => (
          <TodoItem
            key={todo._id}
            todo={todo}
            onTodoStatusChange={toggleTodo}
            onDeleteTodo={deleteTodo}
            saveEditedTodo={saveEdit}
          />
        ))}
      </ul>
    </div>
  );
};

export default TodoList;

// import React, { useState, useEffect } from "react";
// import { TbRefresh } from "react-icons/tb";
// import { ClipLoader } from "react-spinners";
// import TodoItem from "../TodoItem";
// import "./index.css";

// const apiStatusConstants = {
//   initial: "INITIAL",
//   loading: "LOADING",
//   success: "SUCCESS",
//   failure: "FAILURE",
// };

// const TodoList = () => {
//   const [todoList, setTodoList] = useState([]);
//   const [todosCount, setTodosCount] = useState(0);
//   const [userInput, setUserInput] = useState("");
//   const [editingTodoId, setEditingTodoId] = useState(null);
//   const [editingText, setEditingText] = useState("");
//   const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial);
//   const [searchInput, setSearchInput] = useState("");
//   const [filterStatus, setFilterStatus] = useState("ALL"); // ALL | COMPLETED | IN_PROGRESS

//   useEffect(() => {
//     fetchTodoList();
//   }, []);

//   const fetchTodoList = async () => {
//     setApiStatus(apiStatusConstants.loading);
//     try {
//       const response = await fetch(
//         "https://todo-list-backend-mongodb.onrender.com/api/todos"
//       );
//       if (!response.ok) {
//         throw new Error("Failed to fetch todos");
//       }
//       const data = await response.json();
//       setTodoList(data);
//       setTodosCount(data.length);
//       setApiStatus(apiStatusConstants.success);
//     } catch (error) {
//       console.error("Error fetching todos:", error);
//       setApiStatus(apiStatusConstants.failure);
//     }
//   };

//   const onAddTodo = async () => {
//     if (!userInput) {
//       alert("Enter valid text");
//       return;
//     }

//     const newTodo = {
//       text: userInput,
//       uniqueNo: todosCount + 1,
//       isChecked: false,
//     };

//     try {
//       const response = await fetch(
//         "https://todo-list-backend-mongodb.onrender.com/api/add-todo",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(newTodo),
//         }
//       );
//       const addedTodo = await response.json();
//       setTodoList((prevTodos) => [...prevTodos, addedTodo]);
//       setTodosCount((prevCount) => prevCount + 1);
//       setUserInput("");
//     } catch (error) {
//       console.error("Error adding todo:", error);
//     }
//   };

//   const onTodoStatusChange = async (todoId, isChecked) => {
//     try {
//       await fetch(
//         `https://todo-list-backend-mongodb.onrender.com/api/todos/${todoId}`,
//         {
//           method: "PUT",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ isChecked }),
//         }
//       );
//       setTodoList((prevTodos) =>
//         prevTodos.map((todo) =>
//           todo._id === todoId ? { ...todo, isChecked } : todo
//         )
//       );
//     } catch (error) {
//       console.error("Error updating todo:", error);
//     }
//   };

//   const onDeleteTodo = async (todoId) => {
//     try {
//       await fetch(
//         `https://todo-list-backend-mongodb.onrender.com/api/todos/${todoId}`,
//         {
//           method: "DELETE",
//         }
//       );
//       fetchTodoList();
//     } catch (error) {
//       console.error("Error deleting todo:", error);
//     }
//   };

//   const startEditingTodo = (todo) => {
//     setEditingTodoId(todo._id);
//     setEditingText(todo.text);
//   };

//   const handleEditInputChange = (event) => {
//     setEditingText(event.target.value);
//   };

//   const saveEditedTodo = async () => {
//     try {
//       await fetch(
//         `https://todo-list-backend-mongodb.onrender.com/api/todos/${editingTodoId}`,
//         {
//           method: "PUT",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ text: editingText }),
//         }
//       );
//       setEditingTodoId(null);
//       setEditingText("");
//       fetchTodoList();
//     } catch (error) {
//       console.error("Error saving edited todo:", error);
//     }
//   };

//   const handleInputChange = (e) => {
//     setUserInput(e.target.value);
//   };

//   const handleEditKeyPress = (event) => {
//     if (event.key === "Enter") {
//       saveEditedTodo();
//     }
//   };

//   const renderLoadingView = () => (
//     <div className="loading-container">
//       <ClipLoader
//         visible={true}
//         height="80"
//         width="80"
//         color="#4fa94d"
//         ariaLabel="rings-loading"
//       />
//     </div>
//   );

//   const renderFailureView = () => (
//     <div>
//       <h1>Something went wrong!</h1>
//     </div>
//   );

//   const onClickRefreshBtn = () => {
//     fetchTodoList();
//   };

//   const renderTodos = () => {
//     const filteredTodos = todoList.filter((todo) => {
//       const matchesSearch = todo.text
//         .toLowerCase()
//         .includes(searchInput.toLowerCase());

//       const matchesStatus =
//         filterStatus === "ALL"
//           ? true
//           : filterStatus === "COMPLETED"
//           ? todo.isChecked
//           : !todo.isChecked;

//       return matchesSearch && matchesStatus;
//     });

//     if (filteredTodos.length === 0) {
//       return (
//         <div className="no-todos-message">
//           <p>No todos found</p>
//         </div>
//       );
//     }

//     return (
//       <ul className="todo-items-container">
//         {filteredTodos.map((todo) => (
//           <TodoItem
//             key={todo._id}
//             todo={todo}
//             editingTodoId={editingTodoId}
//             editingText={editingText}
//             onTodoStatusChange={onTodoStatusChange}
//             onDeleteTodo={onDeleteTodo}
//             startEditingTodo={startEditingTodo}
//             onEditInputChange={handleEditInputChange}
//             onEditKeyPress={handleEditKeyPress}
//             saveEditedTodo={saveEditedTodo}
//           />
//         ))}
//       </ul>
//     );
//   };

//   //   const renderTodos = () => (
//   //     <ul className="todo-items-container">
//   //       {todoList.map((todo) => (
//   //         <TodoItem
//   //           key={todo._id}
//   //           todo={todo}
//   //           editingTodoId={editingTodoId}
//   //           editingText={editingText}
//   //           onTodoStatusChange={onTodoStatusChange}
//   //           onDeleteTodo={onDeleteTodo}
//   //           startEditingTodo={startEditingTodo}
//   //           onEditInputChange={handleEditInputChange}
//   //           onEditKeyPress={handleEditKeyPress}
//   //           saveEditedTodo={saveEditedTodo}
//   //         />
//   //       ))}
//   //     </ul>
//   //   );

//   const listView = () => {
//     switch (apiStatus) {
//       case apiStatusConstants.loading:
//         return renderLoadingView();
//       case apiStatusConstants.success:
//         return renderTodos();
//       case apiStatusConstants.failure:
//         return renderFailureView();
//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="background-container">
//       <div className="todo-app-container">
//         <h1>Todo List</h1>

//         <input
//           type="text"
//           value={userInput}
//           onChange={handleInputChange}
//           className="todo-input"
//           placeholder="What needs to be done?"
//         />
//         <button onClick={onAddTodo} className="add-todo-button">
//           Add Todo
//         </button>

//         <div className="save-head-container">
//           <p>Create Tasks</p>
//           <button
//             type="button"
//             onClick={onClickRefreshBtn}
//             className="refresh-button"
//             disabled={apiStatus === apiStatusConstants.loading}
//           >
//             <TbRefresh size={18} />
//           </button>
//         </div>
//         <div className="search-filter-container">
//           <input
//             type="search"
//             className="todo-input"
//             placeholder="Search Your Todo"
//             value={searchInput}
//             onChange={(e) => setSearchInput(e.target.value)}
//           />

//           <div className="filter-dropdown-wrapper">
//             <select
//               className="todo-filter-select"
//               value={filterStatus}
//               onChange={(e) => setFilterStatus(e.target.value)}
//             >
//               <option value="ALL">All</option>
//               <option value="IN_PROGRESS">In Progress</option>
//               <option value="COMPLETED">Completed</option>
//             </select>
//           </div>
//         </div>

//         {listView()}
//       </div>
//     </div>
//   );
// };

// export default TodoList;
