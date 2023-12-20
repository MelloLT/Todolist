import { createSignal, onMount } from "solid-js";

function App() {
  const [tasks, setTasks] = createSignal([]);
  const [newTask, setNewTask] = createSignal("");
  const [editMode, setEditMode] = createSignal(-1);
  const [editedTask, setEditedTask] = createSignal("");

  onMount(() => {
    const storedTasks = localStorage.getItem("tasks");
    if (storedTasks) {
      const parsedTasks = JSON.parse(storedTasks);
      setTasks(parsedTasks);
    }
  });

  function addTask() {
    if (newTask().trim() !== "") {
      const trimmedTask = newTask().trim();
      const updatedTasks = [
        ...tasks(),
        { content: trimmedTask, completed: false },
      ];
      setTasks(updatedTasks);
      localStorage.setItem("tasks", JSON.stringify(updatedTasks));
      setNewTask("");
    }
  }

  function deleteTask(index) {
    setTasks((prevTasks) => prevTasks.filter((_, i) => i !== index));
    localStorage.setItem("tasks", JSON.stringify(tasks()));
  }

  function toggleTaskCompleted(index) {
    setTasks((prevTasks) => {
      const updatedTasks = [...prevTasks];
      const task = updatedTasks.splice(index, 1)[0];
      task.completed = !task.completed;
      if (task.completed) {
        updatedTasks.unshift(task);
      } else {
        updatedTasks.push(task);
      }
      localStorage.setItem("tasks", JSON.stringify(updatedTasks));
      return updatedTasks;
    });
  }

  function startEditing(index) {
    setEditMode(index);
    setEditedTask(tasks()[index].content);
  }

  function finishEditing(index) {
    if (editedTask().trim() !== "") {
      setTasks((prevTasks) => {
        const updatedTasks = [...prevTasks];
        updatedTasks[index].content = editedTask().trim();
        localStorage.setItem("tasks", JSON.stringify(updatedTasks));
        return updatedTasks;
      });
      setEditMode(-1);
    }
  }

  return (
    <div class="h-screen flex flex-col">
      <div class="items-center flex-grow flex flex-col">
        <div class="shadow-md px-20 pt-5 pb-5 mb-8">
          <h1 class="font-bold text-4xl mb-4">Todo List</h1>
          <input
            className="w-full py-2 px-3 focus:outline-none mb-4 shadow appearance-none border dark:border-transparent"
            type="text"
            value={newTask()}
            onInput={(e) => setNewTask(e.target.value)}
          />
          <button
            onClick={addTask}
            class="font-semibold py-2 px-5 w-full text-2xl"
          >
            Add new task
          </button>

          {tasks().map((task, index) => (
            <div class="w-full mt-5 py-2 px-3 mb-4 shadow appearance-none border dark:border-transparent flex items-center justify-between">
              <li class="list-none" key={index}>
                {editMode() === index ? (
                  <textarea
                    cols={80}
                    rows={20}
                    type="text"
                    class="focus:outline-none"
                    value={editedTask()}
                    onInput={(e) => setEditedTask(e.target.value)}
                    onBlur={() => finishEditing(index)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        finishEditing(index);
                      }
                    }}
                    autoFocus
                  />
                ) : (
                  <>
                    <input
                      type="checkbox"
                      checked={task.completed}
                      class="mr-2"
                      onChange={() => toggleTaskCompleted(index)}
                    />
                    <span
                      class="flex-grow"
                      style={{
                        textDecoration: task.completed
                          ? "line-through"
                          : "none",
                      }}
                      onClick={() => startEditing(index)}
                    >
                      {task.content}
                    </span>
                  </>
                )}
              </li>
              <button onClick={() => deleteTask(index)}>Delete</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
