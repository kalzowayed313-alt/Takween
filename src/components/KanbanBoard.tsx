
"use client"

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"

export default function KanbanBoard({ tasks, setTasks }: any) {
  const statuses = ["TODO", "IN_PROGRESS", "REVIEW", "DONE"]

  function onDragEnd(result: any) {
    if (!result.destination) return

    const updated = tasks.map((task: any) => {
      if (task.id === result.draggableId) {
        return { ...task, status: result.destination.droppableId }
      }
      return task
    })

    setTasks(updated)
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20 }}>
        {statuses.map(status => (
          <Droppable key={status} droppableId={status}>
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                <h3>{status}</h3>

                {tasks
                  .filter((t: any) => t.status === status)
                  .map((task: any, index: number) => (
                    <Draggable key={task.id} draggableId={task.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{
                            padding: 10,
                            background: "#fff",
                            marginBottom: 10,
                            border: "1px solid #ccc"
                          }}
                        >
                          {task.title}
                        </div>
                      )}
                    </Draggable>
                  ))}

                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  )
}
