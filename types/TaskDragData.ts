import Task from '~/types/Task'

export default interface TaskDragData {
  item: Task,
  sourceListId: string,
  targetListId: string,
}
