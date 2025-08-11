import React from "react";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import "./index.css";

const TodoItem = ({
  todo,
  editingTodoId,
  editingText,
  onTodoStatusChange,
  startEditingTodo,
  onDeleteTodo,
  onEditInputChange,
  onEditKeyPress,
  saveEditedTodo,
}) => {
  const handleCheckboxChange = () => {
    onTodoStatusChange(todo._id, !todo.isChecked);
  };

  return (
    <>
      <li className="todo-item-container">
        <div className="todo-top-row">
          <div className="todo-left">
            <input
              type="checkbox"
              checked={!!todo.isChecked}
              onChange={handleCheckboxChange}
              className="checkbox-input"
              id={todo._id}
            />

            {editingTodoId === todo._id ? (
              <input
                type="text"
                value={editingText}
                onChange={onEditInputChange}
                onKeyDown={onEditKeyPress}
                onBlur={saveEditedTodo}
                className="edit-input"
                autoFocus
              />
            ) : (
              <label
                htmlFor={todo._id}
                className={`checkbox-label ${todo.isChecked ? "checked" : ""}`}
              >
                {todo.text}
              </label>
            )}
          </div>

          <div className="todo-right">
            {!todo.isChecked && (
              <FaEdit
                className="edit-icon"
                onClick={() => startEditingTodo(todo)}
              />
            )}
            <MdDelete
              className="delete-icon"
              onClick={() => onDeleteTodo(todo._id)}
            />
          </div>
        </div>
      </li>

      <div className="todo-bottom-row">
        <span className="todo-date">
          Created:{" "}
          {new Date(todo.createdAt).toLocaleString("en-IN", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })}
        </span>
        {todo.updatedAt && todo.updatedAt !== todo.createdAt && (
          <span className="todo-date updated">
            Updated:{" "}
            {new Date(todo.updatedAt).toLocaleString("en-IN", {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })}
          </span>
        )}
      </div>
      <br />
    </>
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
