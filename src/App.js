import Header from "./components/Header";
import Tasks from "./components/Tasks";
import AddTask from "./components/AddTask";
import {useEffect, useState} from "react";


function App() {
    const [tasks, setTasks] = useState([])
    const [showAddTask, setShowAddTask] = useState(false)

    useEffect(() => {
        const getTasks = async () => {
            const tasksFromServer = await fetchTasks()
            setTasks(tasksFromServer)
        }

        getTasks()
    }, [])

    // Fetch Tasks
    const fetchTasks = async () => {
        const res = await fetch("http://localhost:5000/tasks")
        return await res.json()
    }

    // Add Task
    const addTask = (task) => {
        const id = Math.floor(Math.random() * 1000) + 1
        const newTask = {...task, id}
        setTasks([...tasks, newTask])
    }

    // Delete Task action zaczyna sie najwyzej i schodzi nizej: App.js -> Tasks.js -> Task.js
    const deleteTask = (id) => {
        setTasks(tasks.filter((task) => task.id !== id))
    }

    // Toggle Reminder
    const toggleReminder = (id) => {
        setTasks(
            tasks.map((task) =>
            task.id === id ? {...task, reminder: !task.reminder} : task
            )
        )
    }

    return (
        <div className="container">
            <Header
                title="Task Tracker"
                onAdd={() => setShowAddTask(!showAddTask)}
                showAdd={showAddTask}
            />
            {showAddTask && <AddTask onAdd={addTask} />}
            {tasks.length > 0 ?
                <Tasks tasks={tasks} onDelete={deleteTask} onToggle={toggleReminder}/>
                : "No tasks yet."}
        </div>
    );
}

export default App;

