import React, { useState } from "react";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import "./index.css";

const TodoItem = ({
  todo,
  onTodoStatusChange,
  onDeleteTodo,
  saveEditedTodo,
}) => {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(todo.text);

  const handleToggle = () => onTodoStatusChange(todo._id, todo.isChecked);

  const startEdit = () => {
    setEditing(true);
    setText(todo.text);
  };

  const finishEdit = async () => {
    if (text.trim() && text !== todo.text) {
      await saveEditedTodo(todo._id, text);
    }
    setEditing(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleString();
  };

  return (
    <li className={`todo-item ${todo.isChecked ? "completed" : ""}`}>
      <input
        type="checkbox"
        checked={!!todo.isChecked}
        onChange={handleToggle}
      />
      <div className="todo-main">
        {editing ? (
          <input
            className="edit-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onBlur={finishEdit}
            onKeyDown={(e) => e.key === "Enter" && finishEdit()}
            autoFocus
          />
        ) : (
          <>
            <span className="todo-text" onDoubleClick={startEdit}>
              {todo.text}
            </span>
            <small className="todo-date">{formatDate(todo.createdAt)}</small>
          </>
        )}
      </div>

      {!todo.isChecked && (
        <button className="icon-btn" onClick={startEdit}>
          <FaEdit />
        </button>
      )}
      <button className="icon-btn" onClick={() => onDeleteTodo(todo._id)}>
        <MdDelete />
      </button>
    </li>
  );
};

export default TodoItem;

// import React from "react";
// import { FaEdit } from "react-icons/fa";
// import { MdDelete } from "react-icons/md";
// import "./index.css";

// const TodoItem = ({
//   todo,
//   editingTodoId,
//   editingText,
//   onTodoStatusChange,
//   startEditingTodo,
//   onDeleteTodo,
//   onEditInputChange,
//   onEditKeyPress,
//   saveEditedTodo,
// }) => {
//   const handleCheckboxChange = () => {
//     onTodoStatusChange(todo._id, !todo.isChecked);
//   };

//   const handleEditClick = () => {
//     startEditingTodo(todo);
//   };

//   const handleDeleteClick = () => {
//     onDeleteTodo(todo._id);
//   };

//   return (
//     <>
//       <li className="todo-item-container">
//         <input
//           type="checkbox"
//           checked={!!todo.isChecked}
//           onChange={handleCheckboxChange}
//           className="checkbox-input"
//           id={todo._id}
//         />

//         {editingTodoId === todo._id ? (
//           <input
//             type="text"
//             value={editingText}
//             onChange={onEditInputChange}
//             onKeyDown={onEditKeyPress}
//             onBlur={saveEditedTodo}
//             className="edit-input"
//             autoFocus
//           />
//         ) : (
//           <label
//             htmlFor={todo._id}
//             className={`checkbox-label ${todo.isChecked ? "checked" : ""}`}
//           >
//             {todo.text}
//           </label>
//         )}
//         {!todo.isChecked && (
//           <div className="edit-icon-container">
//             <FaEdit className="edit-icon" onClick={handleEditClick} />
//           </div>
//         )}
//         <div className="delete-icon-container" onClick={handleDeleteClick}>
//           <MdDelete className="delete-icon" />
//         </div>
//       </li>
//     </>
//   );
// };

// export default TodoItem;
