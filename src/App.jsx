import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

// ————————————————————————————————————————————
// Custom Hooks
// ————————————————————————————————————————————
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  }, [key, value]);

  return [value, setValue];
}

function useInput(initial = "") {
  const [value, setValue] = useState(initial);
  const onChange = (e) => setValue(e.target.value);
  const reset = () => setValue("");
  return { value, onChange, reset, bind: { value, onChange } };
}

// ————————————————————————————————————————————
// Context
// ————————————————————————————————————————————
const TodoContext = createContext(null);

function TodoProvider({ children }) {
  const [todos, setTodos] = useLocalStorage("todos-advanced", []);
  const [filter, setFilter] = useState("all"); // 'all' | 'active' | 'done'

  // Actions
  const addTodo = (text) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setTodos((prev) => [
      { id: crypto.randomUUID(), text: trimmed, done: false, createdAt: Date.now() },
      ...prev,
    ]);
  };

  const toggleTodo = (id) => {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  const removeTodo = (id) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  const clearCompleted = () => {
    setTodos((prev) => prev.filter((t) => !t.done));
  };

  const value = useMemo(
    () => ({ todos, filter, setFilter, addTodo, toggleTodo, removeTodo, clearCompleted }),
    [todos, filter]
  );

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
}

function useTodos() {
  const ctx = useContext(TodoContext);
  if (!ctx) throw new Error("useTodos must be used within <TodoProvider>");
  return ctx;
}

// ————————————————————————————————————————————
// UI Components
// ————————————————————————————————————————————
const FilterButtons = React.memo(function FilterButtons() {
  const { filter, setFilter } = useTodos();
  const base = "px-3 py-1 rounded-xl text-sm border transition-colors";
  const selected = "bg-black text-white border-black";
  const notSelected = "bg-white border-gray-300 hover:bg-gray-100";

  const Btn = ({ id, label }) => (
    <button
      aria-pressed={filter === id}
      onClick={() => setFilter(id)}
      className={`${base} ${filter === id ? selected : notSelected}`}
    >
      {label}
    </button>
  );

  return (
    <div className="flex gap-2 flex-wrap">
      <Btn id="all" label="Todas" />
      <Btn id="active" label="Pendentes" />
      <Btn id="done" label="Concluídas" />
    </div>
  );
});

const TodoStats = React.memo(function TodoStats() {
  const { todos } = useTodos();
  const total = todos.length;
  const done = todos.filter((t) => t.done).length;
  const pending = total - done;
  return (
    <div className="text-sm text-gray-600">
      <span className="mr-3">Total: <strong>{total}</strong></span>
      <span className="mr-3">Pendentes: <strong>{pending}</strong></span>
      <span>Concluídas: <strong>{done}</strong></span>
    </div>
  );
});

const TodoItem = React.memo(function TodoItem({ todo }) {
  const { toggleTodo, removeTodo } = useTodos();
  return (
    <li className="group flex items-center justify-between rounded-2xl border border-gray-200 p-3 shadow-sm hover:shadow-md transition-shadow">
      <label className="flex items-center gap-3 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={todo.done}
          onChange={() => toggleTodo(todo.id)}
          className="h-4 w-4 rounded border-gray-300"
        />
        <span className={`text-sm ${todo.done ? "line-through text-gray-400" : "text-gray-800"}`}>
          {todo.text}
        </span>
      </label>
      <button
        onClick={() => removeTodo(todo.id)}
        className="opacity-70 group-hover:opacity-100 text-xs px-2 py-1 rounded-lg border border-red-200 hover:bg-red-50"
      >
        Remover
      </button>
    </li>
  );
});

const TodoList = React.memo(function TodoList() {
  const { todos, filter } = useTodos();
  const filtered = useMemo(() => {
    if (filter === "active") return todos.filter((t) => !t.done);
    if (filter === "done") return todos.filter((t) => t.done);
    return todos;
  }, [todos, filter]);

  if (!filtered.length) {
    return (
      <p className="text-sm text-gray-500 text-center py-8">
        Nada por aqui… adicione sua primeira tarefa! 📝
      </p>
    );
  }

  return (
    <ul className="space-y-2">
      {filtered.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </ul>
  );
});

function AddTodoForm() {
  const { addTodo, clearCompleted } = useTodos();
  const { bind, reset, value } = useInput("");

  const handleSubmit = (e) => {
    e.preventDefault();
    addTodo(value);
    reset();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
      <input
        type="text"
        {...bind}
        placeholder="Adicionar nova tarefa…"
        className="flex-1 rounded-2xl border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-black"
      />
      <div className="flex gap-2">
        <button type="submit" className="rounded-2xl px-4 py-2 border border-black bg-black text-white hover:opacity-90">
          Adicionar
        </button>
        <button type="button" onClick={clearCompleted} className="rounded-2xl px-4 py-2 border border-gray-300 hover:bg-gray-100">
          Limpar concluídas
        </button>
      </div>
    </form>
  );
}

// ————————————————————————————————————————————
// App Shell
// ————————————————————————————————————————————
export default function App() {
  return (
    <TodoProvider>
      <div className="min-h-screen bg-gray-50 p-6">
        <main className="mx-auto max-w-2xl space-y-6">
          <header className="flex items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Todo List — React Avançado</h1>
              <p className="text-gray-600 text-sm">Hooks • Hook customizado • Context API • Memoização • LocalStorage</p>
            </div>
            <FilterButtons />
          </header>

          <section className="space-y-4">
            <AddTodoForm />
            <TodoStats />
            <TodoList />
          </section>

          <footer className="pt-8 text-center text-xs text-gray-500">
            <p>Dica: os dados são salvos automaticamente no seu navegador (localStorage).</p>
          </footer>
        </main>
      </div>
    </TodoProvider>
  );
}
