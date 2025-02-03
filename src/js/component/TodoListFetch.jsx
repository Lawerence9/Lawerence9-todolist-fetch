import React, { useEffect, useState } from "react";

export const TodoListFetch = () => {

    const host = "https://playground.4geeks.com/todo"
    const user = "AlvaroD"
    const [newTask, setNewTask] = useState('')
    const [editTask, setEditTask] = useState('')
    const [isDone, setIsdone] = useState(false)
    const [todos, setTodos] = useState([])
    const [hoveredTask, setHoveredTask] = useState(null)
    const [editForm, setEditForm] = useState(null)
    const [editTaskText, setEditTaskText] = useState("")
    const [isEditing, setIsEditing] = useState(false); 

    const getTodos = async () => {
        const uri = `${host}/users/${user}`
        const options = {
            method: 'GET'
        }

        const response = await fetch(uri, options);
        if (!response.ok) {
            console.log('Error', response.status, response.statusText);
            return
        }
        const data = await response.json()
        setTodos(data.todos)
    }

    const addTodos = async () => {
        const dataToSend = {
            label: newTask,
            is_done: false
        }
        const uri = `${host}/todos/${user}`
        const options = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dataToSend)
        }
        const response = await fetch(uri, options)
        if (!response.ok) {
            console.log('Error', response.status, response.statusText);
            return
        }
        const data = await response.json()
        getTodos()
    }

    const modifyTodos = async (id) => {
        const dataToSend = {
            label: editTaskText,
            is_done: isDone
        }
        const uri = `${host}/todos/${id}`
        const options = {
            method: 'PUT',
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(dataToSend)
        }
        const response = await fetch(uri, options)
        if (!response.ok) {
            console.log('Error', response.status, response.statusText);
            return
        }
        const data = await response.json()
        await getTodos()
        handleCancel()
    }

    const deleteTodos = async (id) => {
        const uri = `${host}/todos/${id}`
        const options = {
            method: 'DELETE',
            headers: {
                "Content-type": "application/json"
            }
        }
        const response = await fetch(uri, options)
        if (!response.ok) {
            console.log('Error', response.status, response.statusText);

            return
        }
        if (editTask === id) {
            handleCancel()
        }
        setTodos((prevTodos) => prevTodos.filter((task) => task.id !== id));
    }

    const handleSubmitAdd = (event) => {
        event.preventDefault()
        addTodos()
        setNewTask('')
    }

    const handleEditClick = (task) => {
        setEditForm(true)
        setEditTask(task.id)
        setEditTaskText(task.label)
        setIsdone(task.is_done)
        setIsEditing(true)
    }

    const handleSubmitEdit = async (event) => {
        event.preventDefault();
        if (!editTask) {
            return
        }
        await modifyTodos(editTask)
        handleCancel()
    }

    const handleCancel = (event) => {
        event?.preventDefault()
        setEditForm(false);
        setEditTask(null);
        setEditTaskText('');
        setIsdone(false);
        setIsEditing(false)
    }

    const handleDelete = (id, event) => {
        event.preventDefault()
        deleteTodos(id)
    }

    useEffect(() => {
        getTodos()
    }, [])

    return (
        <div className="container">
            <div className="row d-flex justify-content-center">
                <h1 className="text-primary text-center">
                    Todo List with Fetch
                </h1>

                <form className={`col ${isEditing ? "d-none" : ""}`} onSubmit={handleSubmitAdd} action="">
                    <div className="">
                        <label className="form-label">Add task</label>
                        <input className="form-control" type="text" onChange={event => setNewTask(event.target.value)} value={newTask} />
                    </div>
                </form>

                <form className="" action="">
                    <div className={editForm === true ? null : "d-none"} >
                        <div className="col mb-3">
                            <label htmlFor="exampleInputEmail1" className="form-label">Edit task</label>
                            <input type="text" className="form-control" value={editTaskText} onChange={(element) => setEditTaskText(element.target.value)} />
                        </div>
                        <div>
                            <input 
                                type="checkbox" 
                                className="form-check-input" 
                                id="completed" 
                                onChange={event => setIsdone(event.target.checked)} 
                                checked={isDone} 
                            />
                            <label className="form-check-label mx-1" htmlFor="exampleCheck1">Completed</label>
                        </div>
                        <div className="mt-4">
                            <button type="submit" className="btn btn-primary mx-1" onClick={handleSubmitEdit}>Submit</button>
                            <button type="button" className="btn btn-secondary mx-1" onClick={handleCancel}>Cancel</button>
                        </div>
                    </div>
                </form>

                <div className="mt-3 col">
                    <h1 className="text-success text-center">Todos list</h1>
                    <ul className="list-group col">
                        {todos.map((element) => (
                            <li 
                                onMouseEnter={() => setHoveredTask(element.id)} 
                                onMouseLeave={() => setHoveredTask(null)} 
                                key={element.id} 
                                className="list-group-item d-flex justify-content-between"
                            >
                                <div>
                                    {element.is_done ? (
                                        <i className="fa-solid fa-check text-success mx-1"></i>
                                    ) : (
                                        <i className="fa-solid fa-ban text-danger mx-1"></i>
                                    )}
                                    {element.label}
                                </div>
                                <div className={hoveredTask === element.id ? null : "d-none"}>
                                    <i className="fa-solid fa-pen-to-square text-success mx-1" onClick={() => handleEditClick(element)}></i>
                                    <i className="fa-solid fa-trash text-danger mx-1" onClick={(event) => handleDelete(element.id, event)}></i>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}
