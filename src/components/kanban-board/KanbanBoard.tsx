import { useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { BoardColumn, BoardContainer } from "./BoardColumn";
import {
    DndContext,
    type DragEndEvent,
    type DragOverEvent,
    DragOverlay,
    type DragStartEvent,
    useSensor,
    useSensors,
    KeyboardSensor,
    Announcements,
    UniqueIdentifier,
    TouchSensor,
    MouseSensor,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { type Task, TaskCard } from "./TaskCard";
import type { Column } from "./BoardColumn";
import { hasDraggableData } from "./utils";
import { coordinateGetter } from "./multipleContainersKeyboardPreset";
import { TaskResponseType } from "@/schemas/taskSchema";
import { useTaskFind, useTaskUpdate } from "@/features/task-management";

const defaultCols = [
    {
        id: "todo" as const,
        title: "Todo",
    },
    {
        id: "in-progress" as const,
        title: "In progress",
    },
    {
        id: "done" as const,
        title: "Done",
    },
] satisfies Column[];

export type ColumnId = (typeof defaultCols)[number]["id"];

export function KanbanBoard() {
    const [columns, setColumns] = useState<Column[]>(defaultCols);
    const pickedUpTaskColumn = useRef<ColumnId | null>(null);
    const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);
    const [tasks, setTasks] = useState<Task[]>([]);

    const [filters, setFilters] = useState({
        searchTerm: '',
        page: 1,
        pageSize: 10,
        sortColumn: 'name',
        sortOrder: 'asc',
    });

    const { isPending, data: responseData, error }: { isPending: boolean; data: TaskResponseType; error: any } = useTaskFind(filters);
    console.log("🚀 ~ file: KanbanBoard.tsx:59 ~ KanbanBoard ~ responseData:", responseData)
    const { mutate: updateTask, isError: updateError, message: updateMessage } = useTaskUpdate();

    //Mapping table data to the Kanban Task - id, content, columnId, ...
    useMemo(() => {
        if (isPending) return [];
        setTasks(responseData.items.map((item: any) => ({
            id: item.id,
            statusId: item.status,
            title: item.name,
            description: item.description,
            projectId: item.projectId,
            userDataAccessLevel: item.userDataAccessLevel
        })));
    }, [responseData.items]);

    const [activeColumn, setActiveColumn] = useState<Column | null>(null);

    const [activeTask, setActiveTask] = useState<Task | null>(null);

    const sensors = useSensors(
        useSensor(MouseSensor),
        useSensor(TouchSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: coordinateGetter,
        })
    );

    function getDraggingTaskData(taskId: string, columnId: ColumnId) {
        console.log("🚀 ~ file: KanbanBoard.tsx:129 ~ getDraggingTaskData ~ columnId:", columnId)
        console.log("🚀 ~ file: KanbanBoard.tsx:129 ~ getDraggingTaskData ~ taskId:", taskId)
        console.log("🚀 ~ file: KanbanBoard.tsx:129 ~ getDraggingTaskData ~ getDraggingTaskData:", getDraggingTaskData)
        const tasksInColumn = tasks.filter((task) => task.statusId === columnId);
        const taskPosition = tasksInColumn.findIndex((task) => task.id === taskId);
        const column = columns.find((col) => col.id === columnId);
        console.log("🚀 ~ file: KanbanBoard.tsx:90 ~ getDraggingTaskData ~ column:", column)

        const currentTask = tasks.find((task) => task.id === taskId);

        updateTask(
            {
                dataId: { id: taskId },
                data:
                {
                    name: currentTask?.title ?? "",
                    description: currentTask?.description,
                    status: columnId,
                    projectId: currentTask?.projectId ?? "",
                    userDataAccessLevel: currentTask?.userDataAccessLevel ?? 0
                }
            },
            {
                onSuccess: () => {

                },
            }
        );


        return {
            tasksInColumn,
            taskPosition,
            column,
        };
    }

    const announcements: Announcements = {
        onDragStart({ active }) {
            if (!hasDraggableData(active)) return;
            if (active.data.current?.type === "Column") {
                const startColumnIdx = columnsId.findIndex((id) => id === active.id);
                const startColumn = columns[startColumnIdx];
                return `Picked up Column ${startColumn?.title} at position: ${startColumnIdx + 1
                    } of ${columnsId.length}`;
            } else if (active.data.current?.type === "Task") {
                pickedUpTaskColumn.current = active.data.current.task.statusId;
                const { tasksInColumn, taskPosition, column } = getDraggingTaskData(
                    active.id,
                    pickedUpTaskColumn.current
                );
                return `Picked up Task ${active.data.current.task.title
                    } at position: ${taskPosition + 1} of ${tasksInColumn.length
                    } in column ${column?.title}`;
            }
        },
        onDragOver({ active, over }) {
            if (!hasDraggableData(active) || !hasDraggableData(over)) return;

            if (
                active.data.current?.type === "Column" &&
                over.data.current?.type === "Column"
            ) {
                const overColumnIdx = columnsId.findIndex((id) => id === over.id);
                return `Column ${active.data.current.column.title} was moved over ${over.data.current.column.title
                    } at position ${overColumnIdx + 1} of ${columnsId.length}`;
            } else if (
                active.data.current?.type === "Task" &&
                over.data.current?.type === "Task"
            ) {
                const { tasksInColumn, taskPosition, column } = getDraggingTaskData(
                    over.id,
                    over.data.current.task.statusId
                );
                if (over.data.current.task.statusId !== pickedUpTaskColumn.current) {
                    return `Task ${active.data.current.task.title
                        } was moved over column ${column?.title} in position ${taskPosition + 1
                        } of ${tasksInColumn.length}`;
                }
                return `Task was moved over position ${taskPosition + 1} of ${tasksInColumn.length
                    } in column ${column?.title}`;
            }
        },
        onDragEnd({ active, over }) {
            if (!hasDraggableData(active) || !hasDraggableData(over)) {
                pickedUpTaskColumn.current = null;
                return;
            }
            if (
                active.data.current?.type === "Column" &&
                over.data.current?.type === "Column"
            ) {
                const overColumnPosition = columnsId.findIndex((id) => id === over.id);

                return `Column ${active.data.current.column.title
                    } was dropped into position ${overColumnPosition + 1} of ${columnsId.length
                    }`;
            } else if (
                active.data.current?.type === "Task" &&
                over.data.current?.type === "Task"
            ) {
                const { tasksInColumn, taskPosition, column } = getDraggingTaskData(
                    over.id,
                    over.data.current.task.statusId
                );
                if (over.data.current.task.statusId !== pickedUpTaskColumn.current) {
                    return `Task was dropped into column ${column?.title} in position ${taskPosition + 1
                        } of ${tasksInColumn.length}`;
                }
                return `Task was dropped into position ${taskPosition + 1} of ${tasksInColumn.length
                    } in column ${column?.title}`;
            }
            pickedUpTaskColumn.current = null;
        },
        onDragCancel({ active }) {
            pickedUpTaskColumn.current = null;
            if (!hasDraggableData(active)) return;
            return `Dragging ${active.data.current?.type} cancelled.`;
        },
    };



    return (
        <>
            {isPending && <p className="text-center text-blue-500">Loading task data...</p>}
            {error && <p className="text-center text-red-500">Error loading task data: {error.message}</p>}

            <DndContext
                accessibility={{
                    announcements,
                }}
                sensors={sensors}
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
                onDragOver={onDragOver}
            >
                <BoardContainer>
                    <SortableContext items={columnsId}>
                        {columns.map((col) => (
                            <BoardColumn
                                key={col.id}
                                column={col}
                                tasks={tasks.filter((task) => task.statusId === col.id)}
                            />
                        ))}
                    </SortableContext>
                </BoardContainer>

                {"document" in window &&
                    createPortal(
                        <DragOverlay>
                            {activeColumn && (
                                <BoardColumn
                                    isOverlay
                                    column={activeColumn}
                                    tasks={tasks.filter(
                                        (task) => task.statusId === activeColumn.id
                                    )}
                                />
                            )}
                            {activeTask && <TaskCard task={activeTask} isOverlay />}
                        </DragOverlay>,
                        document.body
                    )}
            </DndContext>
        </>
    );

    function onDragStart(event: DragStartEvent) {
        console.log("🚀 ~ file: KanbanBoard.tsx:266 ~ onDragStart ~ onDragStart:", onDragStart)
        if (!hasDraggableData(event.active)) return;
        const data = event.active.data.current;
        if (data?.type === "Column") {
            setActiveColumn(data.column);
            return;
        }

        if (data?.type === "Task") {
            setActiveTask(data.task);
            return;
        }
    }

    function onDragEnd(event: DragEndEvent) {
        console.log("🚀 ~ file: KanbanBoard.tsx:281 ~ onDragEnd ~ onDragEnd:", onDragEnd)
        setActiveColumn(null);
        setActiveTask(null);

        const { active, over } = event;
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        if (!hasDraggableData(active)) return;

        const activeData = active.data.current;

        if (activeId === overId) return;

        const isActiveAColumn = activeData?.type === "Column";
        if (!isActiveAColumn) return;

        setColumns((columns) => {
            const activeColumnIndex = columns.findIndex((col) => col.id === activeId);

            const overColumnIndex = columns.findIndex((col) => col.id === overId);

            return arrayMove(columns, activeColumnIndex, overColumnIndex);
        });
    }

    function onDragOver(event: DragOverEvent) {
        console.log("🚀 ~ file: KanbanBoard.tsx:310 ~ onDragOver ~ onDragOver:", onDragOver)
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        if (activeId === overId) return;

        if (!hasDraggableData(active) || !hasDraggableData(over)) return;

        const activeData = active.data.current;
        const overData = over.data.current;

        const isActiveATask = activeData?.type === "Task";
        const isOverATask = overData?.type === "Task";

        if (!isActiveATask) return;

        // Im dropping a Task over another Task
        if (isActiveATask && isOverATask) {
            setTasks((tasks) => {
                const activeIndex = tasks.findIndex((t) => t.id === activeId);
                const overIndex = tasks.findIndex((t) => t.id === overId);
                const activeTask = tasks[activeIndex];
                const overTask = tasks[overIndex];
                if (
                    activeTask &&
                    overTask &&
                    activeTask.statusId !== overTask.statusId
                ) {
                    activeTask.statusId = overTask.statusId;
                    return arrayMove(tasks, activeIndex, overIndex - 1);
                }

                return arrayMove(tasks, activeIndex, overIndex);
            });
        }

        const isOverAColumn = overData?.type === "Column";

        // Im dropping a Task over a column
        if (isActiveATask && isOverAColumn) {
            setTasks((tasks) => {
                const activeIndex = tasks.findIndex((t) => t.id === activeId);
                const activeTask = tasks[activeIndex];
                if (activeTask) {
                    activeTask.statusId = overId as ColumnId;
                    return arrayMove(tasks, activeIndex, activeIndex);
                }
                return tasks;
            });
        }
    }
}





















