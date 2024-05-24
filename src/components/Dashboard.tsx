"use client";
import React, { useState, useEffect, ChangeEvent } from 'react';
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Navbar from './Navbar';
import { Category } from './constant';
import { toast } from 'sonner';

interface Task {
    name: string;
    category: string;
    userID: string;
}

interface Category {
    id: number;
    name: string;
}

export default function Dashboard() {
    const [task, setTask] = useState<string>('');
    const [tasks, setTasks] = useState<any[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [user, setUser] = useState<any>(null);
    const url = process.env.BACKEND_URL as string;
    const [filter, setFilter] = useState<string>('all');
    const router = useRouter();

    const fetchUser = () => {
        auth.onAuthStateChanged((user) => {
            if (!user) {
                router.push("/");
            } else {
                setUser(user);
            }
        });
    };

    const fetchTasks = async () => {
        if (user) {
            try {
                const response = await fetch(`${url}?userID=${user.email}`);
                const data = await response.json();
                setTasks(data);
            } catch (error) {
                console.log(error);
            }
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    useEffect(() => {
        fetchTasks();
    }, [user]);

    const addTask = async () => {
        if (task.trim() && selectedCategory) {
            const newTask: Task = { name: task, category: selectedCategory, userID: user.email };
            console.log(newTask) 
            console.log(JSON.stringify(newTask))
            try {
                const response = await fetch(url, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(newTask)
                });
                const data = await response.json();
                const newTasks = [...tasks, data];
                setTasks(newTasks);
                toast.success("Sukses untuk ditambahkan!");
            } catch (error) {
                toast.error("Terjadi kesalahan, coba lagi nanti.");
                console.log(error);
            }
            setTask('');
        }
    };

    const deleteTask = async(id: string) => {
        const targetUrl = `${url}/${id}`
        try {
            const response = await fetch(targetUrl, {
                method: "DELETE",
                })
            setTasks((prevData) =>
                prevData.filter((data) => 
                    data.id !== id 
                )
            )
            toast.success("Yeay kehapus!");
        } catch (error) {
            toast.error("Terjadi kesalahan, coba lagi nanti.");
            console.log(error);
        }
    };

    const toggleTaskStatus = async (id: string, finished: boolean) => {
        const targetUrl = `${url}/${id}`
        try {
            const response = await fetch(targetUrl, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({finish: finished})
            })
        const data = await response.json(); 
        setTasks((prevData) => 
            prevData.map((task) => 
                task.id === data.id ? {...task, finish: finished} : task
            )
        )
        toast.success("Sukses mengubah status!")
        } catch (error) {
            toast.error("Terjadi kesalahan, coba lagi nanti.");
            console.log(error);
        }
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setTask(e.target.value);
    };

    const handleCategoryChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setSelectedCategory(e.target.value);
    };

    const handleFilterChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setFilter(e.target.value);
    };

    const filteredTasks = tasks.filter(task => {
        if (filter === 'finished') {
            return task.finish;
        } else if (filter === 'unfinished') {
            return !task.finish;
        } else {
            return true;
        }
    });

    return (
        <div className="min-h-screen bg-black"
            style ={{
            backgroundImage: 'url(/header.png)',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center center'}}>
            <Navbar />
            <main className="p-4">
                <div className="max-w-2xl mx-auto bg-black bg-opacity-70 shadow-lg rounded-lg p-6">
                    <div className="mb-6">
                        <h2 className="text-2xl text-white font-semibold mb-4">Add Task</h2>
                        <div className="space-y-4 md:space-y-0 md:flex md:space-x-4">
                            <input 
                                type="text" 
                                value={task} 
                                onChange={handleInputChange} 
                                placeholder="Add a new task"
                                className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                             <select 
                                value={selectedCategory} 
                                onChange={handleCategoryChange} 
                                className="px-1 py-2 border rounded-lg"
                            >
                                <option value="">Select Category</option>
                                {Category.map(category => (
                                    <option key={category.id} value={category.value}>
                                        {category.label}
                                    </option>
                                ))}
                            </select>
                            <button 
                                onClick={addTask}
                                className="bg-blue-500 text-white mx-2 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-700"
                            >
                                Add Task
                            </button>
                        </div>
                    </div>
                    <div className="mb-6">
                        <h2 className="text-2xl font-semibold mb-4 text-white">Filter Tasks</h2>
                        <select 
                            value={filter} 
                            onChange={handleFilterChange} 
                            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">All</option>
                            <option value="finished">Finished</option>
                            <option value="unfinished">Unfinished</option>
                        </select>
                    </div>
                    <ul className="space-y-4 overflow-scroll">
                    {filteredTasks.map((task, index) => (
                            <li key={index} className="flex items-center justify-between p-4 w-fit sm:w-full bg-gray-800 rounded-lg">
                                <span 
                                    className={`flex-1 text-white ${task.finish ? 'line-through text-gray-500' : ''}`}
                                >
                                    {task.name} -  <span className="text-sm text-gray-400">{task.category}</span>
                                </span>
                                <button 
                                    onClick={() => toggleTaskStatus(task.id, !task.finish)}
                                    className={`ml-2 px-4 py-2 rounded ${task.finish ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'}`}
                                >
                                    {task.finish ? 'Finished' : 'Not finished'}
                                </button>
                                <button 
                                    onClick={() => deleteTask(task.id)}
                                    className="ml-2 px-4 py-2 bg-red-500 text-white rounded"
                                >
                                    Delete
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </main>
        </div>
    );
}
