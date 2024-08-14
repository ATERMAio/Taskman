import { useEffect, useState, useRef } from "react";
import { TrashIcon, CheckIcon } from "@heroicons/react/24/outline";
import { useLocalStorageState } from "./useLocalStorageState";

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInstagram,
  faLinkedinIn,
  faFacebookSquare,
} from "@fortawesome/free-brands-svg-icons";

import "./styles.css";
import { useKey } from "./useKey";
import { Timer } from "./Timer";

export default function App() {
  const [tasks, setTasks] = useLocalStorageState([], "tasks");
  const [task, setTask] = useState("");
  const [deadline] = useState("");
  const [status] = useState("Backlog");
  const [taskTime] = useState(0);
  const newTask = { taskId: Date.now(), task, deadline, status, taskTime };
  const taskInput = useRef(null);

  function handleAddTask(task) {
    setTasks((tasks) => [...tasks, task]);
  }

  useEffect(() => {
    taskInput.current.focus();
  }, [setTasks]);

  function handleDeadlineChange(id, newDeadline) {
    setTasks((tasks) =>
      tasks.map((task) =>
        task.taskId === id ? { ...task, deadline: newDeadline } : task
      )
    );
  }

  function handleTimeStore(id, newTime) {
    setTasks((tasks) =>
      tasks.map((task) =>
        task.taskId === id ? { ...task, taskTime: newTime } : task
      )
    );
  }

  function handleStatusChange(id, newStatus) {
    setTasks((tasks) =>
      tasks.map((task) =>
        task.taskId === id ? { ...task, status: newStatus } : task
      )
    );
  }

  function handleCompletion(id) {
    setTasks((tasks) =>
      tasks.map((task) =>
        task.taskId === id ? { ...task, status: "Completed" } : task
      )
    );
  }

  function handleDelete(id) {
    if (window.confirm("Do you really want to delete this task?")) {
      setTasks((tasks) => tasks.filter((task) => task.taskId !== id));
      taskInput.current.focus();
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!task) return;
    handleAddTask(newTask);
    setTask("");
  }

  return (
    <div className="layout">
      <AddTask
        taskInput={taskInput}
        task={task}
        onSubmit={handleSubmit}
        setTask={setTask}
      />
      <Tasks
        tasks={tasks}
        deadlineChange={handleDeadlineChange}
        onDelete={handleDelete}
        onStatusChange={handleStatusChange}
        handleTimeStore={handleTimeStore}
        onCompletion={handleCompletion}
      />
      <>
        <Analytics />
        <SpeedInsights />
        <div className="footer">
          <span className="socialAccounts">
            <span>Follow us on:</span>
            <a href="https://www.instagram.com/atermastudio" target="_blank">
              <FontAwesomeIcon icon={faInstagram} />
            </a>
            <a href="https://www.facebook.com/atermastudio" target="_blank">
              <FontAwesomeIcon icon={faFacebookSquare} />
            </a>
            <a
              href="https://www.linkedin.com/company/atermastudio"
              target="_blank"
            >
              <FontAwesomeIcon icon={faLinkedinIn} />
            </a>
          </span>
          <p className="credits">
            Taskman by{" "}
            <a className="atermaLink" href="https://aterma.io" target="_blank">
              ATERMA Studio
            </a>{" "}
            | Version 0.32a
          </p>
        </div>
      </>
    </div>
  );
}

function AddTask({ task, onSubmit, setTask, taskInput }) {
  useKey("Enter", function () {
    if (document.activeElement === taskInput.current) return;
    taskInput.current.focus();
    setTask("");
  });

  return (
    <div className="addTask">
      <form onSubmit={onSubmit}>
        <div className="taskInput">
          <input
            ref={taskInput}
            onChange={(e) => setTask(e.target.value)}
            value={task}
            placeholder="New Task..."
            type="text"
          />
          {task.length < 15 ? <p className="enterBtn">Enter</p> : ""}
          <button>+</button>
        </div>
      </form>
    </div>
  );
}

function Tasks({
  tasks,
  deadlineChange,
  onDelete,
  onStatusChange,
  handleTimeStore,
  onCompletion,
}) {
  return (
    <>
      {tasks.map((task) => (
        <Task
          key={task.taskId}
          task={task}
          deadlineChange={deadlineChange}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
          handleTimeStore={handleTimeStore}
          onCompletion={onCompletion}
        />
      ))}
    </>
  );
}
function Task({
  task,
  deadlineChange,
  onDelete,
  onStatusChange,
  handleTimeStore,
  onCompletion,
}) {
  const [intervalId, setIntervalId] = useState(null);
  const deadlineRef = useRef(null);

  return (
    <div className="task" key={task.taskId}>
      <div className="topBar">
        <div className="buttons">
          <button className="delete" onClick={() => onDelete(task.taskId)}>
            <TrashIcon className="trashIcon" />
          </button>
          <button
            className="complete"
            onClick={() => onCompletion(task.taskId)}
          >
            <CheckIcon className="trashIcon" />
          </button>
        </div>
        <div className="timer">
          <Timer
            handleTimeStore={handleTimeStore}
            task={task}
            intervalId={intervalId}
            setIntervalId={setIntervalId}
          />
        </div>
      </div>
      <div className="taskName">{task.task}</div>
      <div className={!intervalId ? "bottomBar" : "bottomBar activeTask"}>
        <div>
          {task.deadline === "" ? (
            <button
              className="deadlineSet"
              onClick={() => {
                deadlineChange(
                  task.taskId,
                  new Date().toISOString().split("T")[0]
                );
              }}
            >
              Set Deadline
            </button>
          ) : (
            <input
              className="deadlineSet"
              type="date"
              value={task.deadline}
              ref={deadlineRef}
              onChange={(e) => deadlineChange(task.taskId, e.target.value)}
            />
          )}
        </div>
        <div>
          <select
            value={task.status}
            onChange={(e) => onStatusChange(task.taskId, e.target.value)}
            className="status"
          >
            <option>Backlog</option>
            <option>In Progress</option>
            <option>On Hold</option>
            <option>Completed</option>
          </select>
        </div>
      </div>
    </div>
  );
}
