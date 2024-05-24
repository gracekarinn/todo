"use client";
import React, { useState, useEffect, ChangeEvent } from 'react';
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

interface Task {
    id: number;
    text: string;
}

export default function Dashboard() {
    const [task, setTask] = useState<string>('');
    const [tasks, setTasks] = useState<Task[]>([]);
    const [user, setUser] = useState<any>([]);
    const url = process.env.BACKEND_URL as string;
    const router = useRouter();

    const fetchUser = () => {
    auth.onAuthStateChanged((user) => {
      if (!user) {
        router.push("/");
      } else {
        setUser(user);
      }});
    };

    const fetchTask = async() => {
        try {
            const response = await fetch(url + "?userID=" + user.email)
            const data = await response.json() 
            setTasks(data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchUser()
    }, []);

    useEffect(() => {
        fetchTask()
    }, [user]);

    const addTask = () => {
        if (task.trim()) {
            const newTask: Task = { id: Date.now(), text: task };
            const newTasks = [...tasks, newTask];
            setTasks(newTasks);
            localStorage.setItem('tasks', JSON.stringify(newTasks));
            setTask('');
        }
    };

    const deleteTask = (id: number) => {
        const newTasks = tasks.filter(task => task.id !== id);
        setTasks(newTasks);
        localStorage.setItem('tasks', JSON.stringify(newTasks));
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setTask(e.target.value);
    };

    return (
        <div className="flex-col flex items-center justify-center p-4 bg-white">
            <h1 className="text-2xl font-bold mb-4">To-Do List</h1>
            <div className="mb-4">
                <input
                    type="text"
                    value={task}
                    onChange={handleInputChange}
                    placeholder="Enter a new task"
                    className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                    onClick={addTask}
                    className="ml-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    Add
                </button>
            </div>
            <ul className="list-disc list-inside">
                {tasks.map(task => (
                    <li key={task.id} className="mb-2 flex justify-between items-center">
                        {task.text}
                        <button
                            onClick={() => deleteTask(task.id)}
                            className="ml-4 px-2 py-1 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
