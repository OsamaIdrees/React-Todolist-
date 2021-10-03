import * as React from 'react'
import classess from './todolist.module.scss'
import { URL } from '../../constant'
const TodoList = () => {
    const [allTasks, getAllTasks] = React.useState('')
    const [reRun, checkRenRun] = React.useState(null)
    const task = React.useRef('')
    // const status = React.useRef('')
    const deadline = React.useRef('')
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
                            <td>
                                {task['task']}
                            </td>
                            <td>
                                {task['status']}
                            </td>
                            <td>
                                {task['deadline']}
                            </td>
                            <td className={classess.update_button}>
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
                checkRenRun('task_added')
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
                checkRenRun('task_deleted')
                alert(data.message)
            }
            else{
                alert(data.message)
            }
        })
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


    </>
}
export default TodoList