
"use client"

import { useEffect, useState } from "react"
import KanbanBoard from "../components/KanbanBoard"

export default function Home() {
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    fetch("/api/tasks")
      .then(res => res.json())
      .then(setTasks)
  }, [])

  return (
    <div style={{ padding: 40 }}>
      <h1>Takween Task Board</h1>
      <KanbanBoard tasks={tasks} setTasks={setTasks} />
    </div>
  )
}
