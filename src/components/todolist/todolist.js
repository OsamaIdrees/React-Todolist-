import * as React from 'react'
import classess from './todolist.module.scss'
import { URL } from '../../constant'
const TodoList = () => {
    const [allTasks, getAllTasks] = React.useState('')
    const [reRun, checkRenRun] = React.useState(false)
    const [updateFlag,setUpdateFlag] = React.useState(false)
    
    const [taskValue,updateTaskValue] = React.useState('')
    const [statusValue,updateStatusValue] = React.useState('')
    const [deadlineValue,updateDeadlineValue] = React.useState('')
    // const status = React.useRef('')
    const task = React.useRef('')
    const deadline = React.useRef('')

    const updatedTaskValue = React.useRef('')
    const updatedStatusValue = React.useRef('')
    const updatedDeadlineValue = React.useRef('')
    React.useEffect(() => {
        const runApi = async () => {
            await fetch(`${URL}/get-all-tasks`, {
                method: "GET",
                headers: {
                    "accept": "application/json",
                    "content-type": "application/json"
                }
            }).then(response => {
                return response.json();
            }).then((data) => {
                let temp = []
                if (data.length !== 0) {
                    data.map((task, key) => {
                        return temp.push(<tr>
                            <td>
                                {task['id']}
                            </td>
                            <td  id={task['id']+"_task"} value={task['task']}>
                                {task['task']}
                            </td>
                            <td id={task['id']+"_status"} value={task['status']}>
                                {task['status']}
                            </td>
                            <td id={task['id']+"_deadline"} value={task['deadline']}>
                                {task['deadline']}
                            </td>
                            <td className={classess.update_button} task_id ={task['id']} message="open" onClick={updateTask}>
                                Update
                            </td>
                            <td onClick={deleteTask} task_id ={task['id']} className={classess.delete_button}>
                                Delete
                            </td>
                        </tr>)
                    })
                    getAllTasks(temp)
                }
                else {
                    getAllTasks(temp)
                }

            })
        }

        runApi();
    }, [reRun])
    const submitTask = (e) => {
        e.preventDefault();
        let body_values = {
            task: task.current.value,
            status: "Incomplete",
            deadline: deadline.current.value
        }
        fetch(`${URL}/add-todo-item`, {
            method: "POST",
            headers: {
                "accept": "application/json",
                "content-type": "application/json"
            },
            body: JSON.stringify(body_values)

        }).then(response => {
            return response.json();
        }).then((data) => {
            if (data.status === true) {
                checkRenRun(!reRun)
            }
            else {
                alert("Something went wrong")
            }
        })
    }
    const deleteTask = (e) =>{
        let task_id = e.target.getAttribute('task_id')
        fetch(`${URL}/delete-todo-task/${task_id}`,{
            method:"GET",
            headers:{
                "accept":"application/json",
                "content-type":"application/json"
            }
        }).then(response=>{
            return response.json()
        }).then((data)=>{
            if(data.status === true){
                checkRenRun(!reRun)
                alert(data.message)
            }
            else{
                alert(data.message)
            }
        })
    }
    const updateTask = async (e) =>{
        e.preventDefault()
        let task_id = e.target.getAttribute("task_id")
        let message = e.target.getAttribute("message")
        if(message !== null){
            sessionStorage.setItem('task_id',task_id)
            updateTaskValue(document.getElementById(task_id+"_task").getAttribute('value'))
            updateStatusValue(document.getElementById(task_id+"_status").getAttribute('value'))
            updateDeadlineValue(document.getElementById(task_id+"_deadline").getAttribute('value'))
            setUpdateFlag(true)
        }
        else{
            let body_keys = {
                id:sessionStorage.getItem('task_id'),
                task:updatedTaskValue.current.value,
                status: updatedStatusValue.current.value,
                deadline:updatedDeadlineValue.current.value
            }
            fetch(`${URL}/update-task`,{
                method:"POST",
                headers:{
                    "accept":"application/json",
                    "content-type":"application/json"
                },
                body:JSON.stringify(body_keys)
            }).then(response=>{
                return response.json()
            }).then((data)=>{
                if(data.status === true){

                    checkRenRun(!reRun)
                }
                else{
                    console.log(data.message)
                }
            })
            setUpdateFlag(false)
        }
        
        
    }
    return <>
        <center>
            <h1>
                Todolist App
            </h1>
        </center>
        <form onSubmit={submitTask} className={classess.form_styling}>
            <label className={classess.label_styling}>
                Task:
            </label>
            <span>
                <input type="text" name="todolist" placeholder="Task to be done" ref={task} className={classess.input_styling} required />
            </span>
            {/* <br /> */}
            <label className={classess.label_styling}>
                Deadline:
            </label>
            <span>
                <input type="text" name="todolist" placeholder="January 1,1990" ref={deadline} className={classess.input_styling} required />
            </span>

            <br />
            <input type="submit" name="add_task" value="Add Task" className={classess.submitButton} />
        </form>
        {
            allTasks.length !== 0 ? <table>
                <thead>
                    <tr>
                        <th>
                            ID
                        </th>
                        <th>
                            Task
                        </th>
                        <th>
                            Status
                        </th>
                        <th>
                            Deadline
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {allTasks}
                </tbody>


            </table> : "No Tasks Added"
        }

        {
            updateFlag === true?<div className={classess.update_form_div}>
               <form onSubmit={updateTask} className={classess.updated_form_styling}>
            <label className={classess.label_styling}>
                Task:
            </label>
            <span>
                <input type="text" name="todolist" placeholder="Task to be done" value={taskValue} onChange={(e)=>updateTaskValue(e.target.value)} ref={updatedTaskValue} className={classess.input_styling} required />
            </span>
            {/* <br /> */}
            <label className={classess.label_styling}>
                Status:
            </label>
            <span>
                <input type="text" name="todolist" placeholder="Status"  value={statusValue} ref={updatedStatusValue} onChange={(e)=>updateStatusValue(e.target.value)} className={classess.input_styling} required />
            </span>
            <label className={classess.label_styling}>
                Deadline:
            </label>
            <span>
                <input type="text" name="todolist" placeholder="January 1,1990" value={deadlineValue}  ref={updatedDeadlineValue} onChange={(e)=>updateDeadlineValue(e.target.value)} className={classess.input_styling} required />
            </span>

            <br />
            <input type="submit" name="add_task" value="Update Task" message="close" className={classess.submitButton} />
        </form> 
        </div>:
            null
        }
        
    </>
}
export default TodoList