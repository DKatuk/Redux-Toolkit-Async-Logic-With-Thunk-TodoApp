import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getTodoAsync = createAsyncThunk(
  "todo/fetchTodosAsync",
  async () => {
    const response = await axios(
      `${process.env.REACT_APP_API_BASE_ENDPOINT}/todos`
    );
    return response.data;
  }
);

export const addTodoAsync = createAsyncThunk(
  "todo/AddTodoAsync",
  async (data) => {
    const response = await axios.post(
      `${process.env.REACT_APP_API_BASE_ENDPOINT}/todos`,
      data
    );
    return response.data;
  }
);

export const deleteTodoAsync = createAsyncThunk(
  "todo/deleteTodoAsync",
  async (id) => {
    const response = await axios.delete(
      `${process.env.REACT_APP_API_BASE_ENDPOINT}/todos/${id}`
    );
    //we don't want to return the whole todo object, just the id of the todo which was deleted
    return id;
  }
);

export const toggleTodoAsync = createAsyncThunk(
  "todo/toggleTodoAsync",
  async ({ id, data }) => {
    const response = await axios.patch(
      `${process.env.REACT_APP_API_BASE_ENDPOINT}/todos/${id}`,
      data
    );
    return response.data;
  }
);
