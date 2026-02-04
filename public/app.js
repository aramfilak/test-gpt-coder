const { useEffect, useMemo, useState } = React;

function App() {
  const [todos, setTodos] = useState([]);
  const [summary, setSummary] = useState({ total: 0, completed: 0, remaining: 0 });
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(true);

  const sortedTodos = useMemo(() => {
    return [...todos].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [todos]);

  async function loadTodos() {
    setLoading(true);
    const response = await fetch('/api/todos');
    const data = await response.json();
    setTodos(data.todos ?? []);
    setSummary(data.summary ?? { total: 0, completed: 0, remaining: 0 });
    setLoading(false);
  }

  async function addTodo(event) {
    event.preventDefault();
    if (!title.trim()) {
      return;
    }
    await fetch('/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title })
    });
    setTitle('');
    await loadTodos();
  }

  async function toggleTodo(id) {
    await fetch(`/api/todos/${id}/toggle`, { method: 'POST' });
    await loadTodos();
  }

  async function deleteTodo(id) {
    await fetch(`/api/todos/${id}`, { method: 'DELETE' });
    await loadTodos();
  }

  useEffect(() => {
    loadTodos();
  }, []);

  return (
    <>
      <header>
        <h1>NestJS React Todo</h1>
        <p>React frontend with a NestJS MVC backend.</p>
      </header>

      <section className="card">
        <form className="todo-form" onSubmit={addTodo}>
          <label htmlFor="title">New todo</label>
          <div className="field">
            <input
              id="title"
              name="title"
              type="text"
              placeholder="What needs to be done?"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
            />
            <button type="submit">Add</button>
          </div>
        </form>
      </section>

      <section className="card">
        <div className="summary">
          <div>
            <strong>{summary.total}</strong>
            <span>Total</span>
          </div>
          <div>
            <strong>{summary.completed}</strong>
            <span>Done</span>
          </div>
          <div>
            <strong>{summary.remaining}</strong>
            <span>Remaining</span>
          </div>
        </div>

        <ul className="todo-list">
          {loading && <li className="empty">Loading todos...</li>}
          {!loading && sortedTodos.length === 0 && (
            <li className="empty">No tasks yet. Add one above.</li>
          )}
          {sortedTodos.map((todo) => (
            <li key={todo.id} className={`todo-item ${todo.status === 'done' ? 'done' : ''}`}>
              <div className="todo-title">
                <span>{todo.title}</span>
                <small>Added {new Date(todo.createdAt).toLocaleString()}</small>
              </div>
              <div className="todo-actions">
                <button type="button" className="ghost" onClick={() => toggleTodo(todo.id)}>
                  {todo.status === 'done' ? 'Undo' : 'Complete'}
                </button>
                <button type="button" className="danger" onClick={() => deleteTodo(todo.id)}>
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
