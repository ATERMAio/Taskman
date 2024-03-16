import { useEffect, useState } from "react";
import { PlayIcon, PauseIcon } from "@heroicons/react/24/outline";
import { Statistic } from "antd";

export function Timer({ task, handleTimeStore, intervalId, setIntervalId }) {
  const [timeElapsed, setTimeElapsed] = useState(task.taskTime);
  let lastUpdate = Date.now();

  const startTimer = () => {
    if (!intervalId) {
      lastUpdate = Date.now();
      setIntervalId(
        setInterval(() => {
          const now = Date.now();
          setTimeElapsed((prevTime) => prevTime + (now - lastUpdate));
          lastUpdate = now;
        })
      );
    }
  };

  useEffect(() => handleTimeStore(task.taskId, timeElapsed), [timeElapsed]);

  const pauseTimer = () => {
    clearInterval(intervalId);
    setIntervalId(null);

    const now = Date.now();
    setTimeElapsed((prevTime) => prevTime + (now - lastUpdate));
    lastUpdate = now;

    handleTimeStore(task.taskId, timeElapsed);
  };

  const formatValue = (value) => {
    const hours = Math.floor(value / 3600000);
    const minutes = Math.floor((value % 3600000) / 60000);
    const seconds = Math.floor((value % 60000) / 1000);

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <>
      <Statistic
        value={timeElapsed}
        formatter={formatValue}
        className="timerNumbers"
      />
      {!intervalId ? (
        <button className="timerBtns start" onClick={startTimer}>
          <PlayIcon className="timerBtn" />
        </button>
      ) : (
        <button className="timerBtns pause" onClick={pauseTimer}>
          <PauseIcon className="timerBtn" />
        </button>
      )}
    </>
  );
}
