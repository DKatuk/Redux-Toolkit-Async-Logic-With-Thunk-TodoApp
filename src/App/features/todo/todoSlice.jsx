import { createSlice } from "@reduxjs/toolkit";

import { getTodoAsync, addTodoAsync, deleteTodoAsync, toggleTodoAsync } from "./Services";


export const todoSlice = createSlice({
  name: "todo",
  initialState: {
    todos: [],
    category: localStorage.getItem("categoryState"),
    getTodos: { status: "idle", error: null },
    addTodo: { addTodoStatus: "idle", addTodoError: null },
  },
  reducers: {
    //Previous Reducers here

    // addTodo: {
    //   reducer: (state, action) => {
    //     state.todos.push(action.payload);
    //   },
    //   prepare: ({ title }) => {
    //     return { payload: { id: nanoid(), title, completed: false } };
    //   },
    // },
    // deleteTodo: (state, action) => {
    //   state.todos = state.todos.filter((todo) => todo.id !== action.payload);
    // },
    // toggleTodo: (state, action) => {
    //   const todo = state.todos.find((todo) => todo.id === action.payload);
    //   if (todo) {
    //     todo.completed = !todo.completed;
    //   }
    // },
    // clearCompleted: (state) => {
    //   state.todos = state.todos.filter((todo) => todo.completed === false);
    // },

    categoryFilter: (state, action) => {
      state.category = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      //FETCH TODOS FROM API
      .addCase(getTodoAsync.pending, (state, action) => {
        state.getTodos.status = "loading";
      })
      .addCase(getTodoAsync.fulfilled, (state, action) => {
        state.todos = action.payload;
        state.getTodos.status = "succeeded";
      })
      .addCase(getTodoAsync.rejected, (state, action) => {
        state.getTodos.status = "failed";
        state.getTodos.error = action.error.message;
      })
      // PUT REQUEST - SENDING A NEW TODO TO API
      .addCase(addTodoAsync.pending, (state, action) => {
        state.addTodo.addTodoStatus = "loading";
      })
      .addCase(addTodoAsync.fulfilled, (state, action) => {
        state.addTodo.addTodoStatus = "succeeded";
        state.todos.push(action.payload);
      })
      .addCase(addTodoAsync.rejected, (state, action) => {
        state.addTodo.addTodoStatus = "failed";
        state.addTodo.addTodoError = action.error.message;
      })
      // DELETE REQUEST - DELETING A TODO FROM API
      .addCase(deleteTodoAsync.fulfilled, (state, action) => {
        state.todos = state.todos.filter((todo) => todo.id !== action.payload);
      })
      // TOGGLE TODO - PATCH REQUEST TO API
      .addCase(toggleTodoAsync.fulfilled, (state, action) => {
        const { id, completed } = action.payload;
        const todo = state.todos.find((todo) => todo.id === id);
        if (todo) {
          todo.completed = completed;
        }
      });
  },
});

export const { categoryFilter } = todoSlice.actions;

export default todoSlice.reducer;
