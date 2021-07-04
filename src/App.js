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

    // Fetch Task
    const fetchTask = async (id) => {
        const res = await fetch(`http://localhost:5000/tasks/${id}`)
        return await res.json()
    }

    // Add Task
    const addTask = async (task) => {
        const res = await fetch(
            "http://localhost:5000/tasks",
            {
                method: "POST",
                headers: {"Content-type": "application/json"},
                body: JSON.stringify(task)
            })

        const data = await res.json()

        setTasks([...tasks, data])
    }

    // Delete Task action zaczyna sie najwyzej i schodzi nizej: App.js -> Tasks.js -> Task.js
    const deleteTask = async (id) => {
        await fetch(
            `http://localhost:5000/tasks/${id}`,
            {method: "DELETE"}
        )

        setTasks(tasks.filter((task) => task.id !== id))
    }

    // Toggle Reminder
    // na backendzie
    const toggleReminder = async (id) => {
        const taskToToggle = await fetchTask(id)
        const updTask = {...taskToToggle, reminder: !taskToToggle.reminder}

        const res = await fetch(
            `http://localhost:5000/tasks/${id}`,
            {
                method: "PUT",
                headers: {"Content-type": "application/json"},
                body: JSON.stringify(updTask)
            }
        )

        const data = await res.json()

        // na frontendzie
        setTasks(
            tasks.map((task) =>
            task.id === id ? {...task, reminder: data.reminder} : task
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

