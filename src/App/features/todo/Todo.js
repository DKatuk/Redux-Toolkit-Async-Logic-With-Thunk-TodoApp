import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { categoryFilter } from "./todoSlice";

import {
  getTodoAsync,
  addTodoAsync,
  deleteTodoAsync,
  toggleTodoAsync,
} from "./Services";

function Todo() {
  const [todoItem, setTodoItem] = useState("");

  const todoArray = useSelector((state) => state.todo.todos);
  console.log("todoArray", todoArray);
  const categoryState = useSelector((state) => state.todo.category);
  const todosStatus = useSelector((state) => state.todo.getTodos.status); //initially "idle"
  const error = useSelector((state) => state.todo.getTodos.error);
  const addTodoStatus = useSelector((state) => state.todo.addTodo.addTodoStatus);
  const addTodoError = useSelector((state) => state.todo.addTodo.addTodoError);
  const dispatch = useDispatch();

  // CATEGORY FILTERING
  let filteredTodos = todoArray;

  if (categoryState === "All") {
    filteredTodos = todoArray;
  } else if (categoryState === "Completed") {
    filteredTodos = todoArray.filter((todo) => todo.completed === true);
  } else if (categoryState === "Active") {
    filteredTodos = todoArray.filter((todo) => todo.completed === false);
  }

  const numberOfTodosLeft = todoArray.filter(
    (todo) => todo.completed === false
  ).length;

  // FETCH TODOS
  useEffect(() => {
    //to fetch todos only once, check if todosStatus equals to idle
    if (todosStatus === "idle") {
      dispatch(getTodoAsync());
    }
  }, [todosStatus, dispatch]);

  // RENDER THE CONTENT BASED ON STATE STATUS
  let todoContent;
  if (todosStatus === "loading") {
    todoContent = "Todos Loading...";
  } else if (todosStatus === "succeeded") {
    todoContent = filteredTodos.map((todo) => (
      <li key={todo.id} className="todo-item">
        <input
          className="checkbox-round"
          type="checkbox"
          onClick={() => handleToggle(todo.id, !todo.completed)}
        />
        {todo.completed ? (
          <label style={{ textDecoration: "line-through" }}>{todo.title}</label>
        ) : (
          <label>{todo.title}</label>
        )}
        <div>
          <button
            onClick={() => handleDelete(todo.id)}
            className="delete-button"
          >
            X
          </button>
        </div>
      </li>
    ));
  } else if (todosStatus === "failed") {
    todoContent = "Failed to fetch";
    console.log("error", error);
  }

  // TO LET USER CONTINUE VIEWING FILTERED TODOS AFTER REFRESHING THE PAGE
  useEffect(() => {
    localStorage.setItem("categoryState", categoryState);
  }, [categoryState]);

  // HANDLE ADD NEW TODO
  const handleTodoSubmit = async () => {
    if (todoItem === "") return;
    await dispatch(addTodoAsync({ title: todoItem }));
    setTodoItem("");
    if (addTodoStatus === "failed") {
      console.log("addTodoError", addTodoError);
    }
  };

  //TOGGLE TODO (CHANGE COMPLETED STATUS)
  const handleToggle = async (id, completed) => {
    await dispatch(toggleTodoAsync({ id, data: { completed } }));
  };

  // HANDLE DELETE A TODO
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this todo?")) {
      await dispatch(deleteTodoAsync(id));
    }
  };

  // HANDLE CLEAR COMPLETED TODOS
  const handleClearCompleted = async () => {
    let completedTodos = todoArray.filter((todo) => todo.completed === true);
    console.log("completedTodos", completedTodos);
    if (window.confirm("Are you sure you want to clear all the completed todos?")) {
      for(let i=0; i<completedTodos.length; i++){
        await dispatch(deleteTodoAsync(completedTodos[i].id));
      }
    } }

  return (
    <div className="App">
      <div className="todos">
        <header>
          <h1>todos</h1>
          <div className="new-todo">
            <input
              onChange={(e) => setTodoItem(e.target.value)}
              className="enter-todo"
              value={todoItem}
              type="text"
              placeholder="What needs to be done?"
              autoFocus
            />
            <button onClick={() => handleTodoSubmit()}>Add Todo</button>
          </div>
        </header>

        <section className="todo-list">
          <ul style={{ listStyle: "none" }}>{todoContent}</ul>
          <div className="todo-info">
            <span>
              {numberOfTodosLeft} Todo{numberOfTodosLeft > 1 ? "s" : ""} Left
            </span>
            <div className="todo-info-buttons">
              <button
                style={{
                  backgroundColor: categoryState === "All" ? "pink" : "",
                }}
                onClick={(e) => {
                  dispatch(categoryFilter(e.target.innerHTML));
                }}
              >
                All
              </button>
              <button
                style={{
                  backgroundColor: categoryState === "Active" ? "pink" : "",
                }}
                onClick={(e) => {
                  dispatch(categoryFilter(e.target.innerHTML));
                }}
              >
                Active
              </button>
              <button
                style={{
                  backgroundColor: categoryState === "Completed" ? "pink" : "",
                }}
                onClick={(e) => {
                  dispatch(categoryFilter(e.target.innerHTML));
                }}
              >
                Completed
              </button>
            </div>
            <button onClick={() => handleClearCompleted()}>
              Clear Completed
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Todo;
