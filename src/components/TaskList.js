import React, { useEffect, useState } from 'react'
import TaskForm from './TaskForm'
import Task from './Task'
import { toast } from 'react-toastify';
import { URL } from '../App';
import 'react-toastify/dist/ReactToastify.css'
import axios from "axios";
import loadingImg from "../assets/Hourglass.gif";
const TaskList = () => {
    const[formData, setFormData] = useState({
        name: "",
        completed: false
    });
    const[tasks,setTasks] = useState([]);
    const[completedTasks,setCompletedTasks] = useState([]);
    const[isLoading,setIsLoading] = useState(false);
    const[isEditing,setIsEditing] = useState(false);
    const[taskID,setTaskID] = useState("");
    const {name} = formData

    const handleInputChange = (e) => {
        const {name ,value} = e.target
        setFormData({...formData,[name]:value});
    };
    const getTasks = async() => {
        setIsLoading(true);
        try{
            const {data} = await axios.get(`${URL}/api/tasks`);
            console.log(data);
            // setTasks(data);
            setTasks(data);
            setIsLoading(false);
        } catch(error){
            toast.error(error.message);
            setIsLoading(false);
        }
    }
    useEffect(() => {
        getTasks();
        
    },[]);
    const createTask = async (e) => {
        e.preventDefault();
        if(name===""){
            return toast.error("Input feild cannot be empty");
        }
        try{
            await axios.post(`${URL}/api/tasks`,formData);
            setFormData({...formData,name: ""})
            toast.success("Task added successfully");
            getTasks();
        } catch(error){
            toast.error(error.message);
        }
    }



    const deleteTask = async(id) => {
        try{
            await axios.delete(`${URL}/api/tasks/${id}`);
            getTasks();
        }catch(error){
            toast.error(error.message);
        }
    }

    const getSingleTask = async (task) => {
        setFormData({name:task.name, completed:false});
        setTaskID(task._id);
        setIsEditing(true);
    }

    const updateTask = async (e) => {
        e.preventDefault();
        if(name===""){
            return toast.error("Input feild can not be empty");

        }
        try{
            await axios.put(`${URL}/api/tasks/${taskID}`,formData);
            setFormData({...formData,name: ""})
            toast.success("Task updated successfully");
            setIsEditing(false);
            setTaskID("");
            getTasks();
        }catch(error){
            toast.error(error.message);
        }

    }

    const setToComplete = async(task) => {
        const newFormData = {name: task.name , completed: true};
        try{
            await axios.put(`${URL}/api/tasks/${task._id}`,newFormData);
            toast.success("Hurray!!! You completed a Task");
            getTasks();
        }catch(error){
            toast.error(error.message);
        }
    }
    useEffect(() => {
        const cTask = tasks.filter((task) => {
            return task.completed === true;
        })
        setCompletedTasks(cTask);
    },[tasks])
    return (
        <div>
            <h2>Task Manager</h2>
            <TaskForm name={name} handleInputChange={handleInputChange} createTask={createTask} isEditing={isEditing} updateTask={updateTask}/>
            {tasks.length>0 && (
                <div className='--flex-between --pb'>
                <p>
                    <b>Total Tasks(s):</b> {tasks.length}
                </p>
                <p>
                    <b>Completed Task(s):</b> {completedTasks.length}
                </p>
                </div>
            )}
            
            {isLoading && (
                <div className='--flex-center'>
                    <img src={loadingImg} alt="Loading" />
                </div>
            )}
            <hr />
            
            {
                !isLoading && tasks.length !== 0 ? (
                    <>
                    {tasks.map((task, index) => {
                        return (
                            <Task key={task._id} task={task} index={index} deleteTask={deleteTask} getSingleTask={getSingleTask} setToComplete={setToComplete}/>
                        )
                    })}
                    </>
                    
                ) : (
                    <p className='--py'>
                        No task Added. Please add a task
                    </p>
                )
            }
            
        </div>
    )
}

export default TaskList
