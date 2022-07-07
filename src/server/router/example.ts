import { createRouter } from "./context";
import { z } from "zod";
import "../../utils/local-storage";

type TodoItem = {
  id: number;
  message: string;
  completed: boolean;
};

type Store = {
  todos: TodoItem[];
};

const store: Store = {
  todos: JSON.parse(global.localStorage?.getItem("todos") || "[]"),
};

export const todoRouter = createRouter().query("get", {
  resolve() {
    return store;
  },
}).mutation("add", {
  input: z.object({
    message: z.string(),
    completed: z.boolean(),
  }),
  resolve(req) {
    store.todos.push({id: Date.now(), ...req.input});
    global.localStorage.setItem("todos", JSON.stringify(store.todos));
    return store;
  }

}).mutation("delete", {
  input: z.object({
    id: z.number(),
  }),
  resolve(req) {
    store.todos = store.todos.filter(todo => todo.id !== req.input.id);
    global.localStorage.setItem("todos", JSON.stringify(store.todos));
    return store;
  }
});
