<template>
  <div class='startPage'>
    <template v-if='taskCreationModeEnabled'>
      <input v-model='newTaskTitle'>
      <button @click='saveNewTask'>Save</button>
    </template>
    <template v-else>
      <button @click='taskCreationModeEnabled = true'>+ Add new task</button>
    </template>
    <div class='startPage__columns-layout'>
      <TaskStatusColumn header='To do' list-id='todo' :tasks="todoTasks" @drop='drop' />
      <TaskStatusColumn header='In progress' list-id='inProgress' :tasks="inProgressTasks" @drop='drop' />
      <TaskStatusColumn header='Done' list-id='done' :tasks="doneTasks" @drop='drop' />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import TaskStatusColumn from '~/components/TaskStatusColumn.vue';
import TaskDragData from '~/types/TaskDragData'
import Task from '~/types/Task'
type ListsMap = { [key: string]: Array<Task> }

export default defineComponent({
  name: 'IndexPage',
  components: { TaskStatusColumn },
  data() {
    return {
      taskCreationModeEnabled: false,
      newTaskTitle: '',
      todoTasks: [
        { id: 1, title: 'test1' },
        { id: 2, title: 'test2' }
      ],
      inProgressTasks: [],
      doneTasks: [],
    }
  },
  computed: {
    tasksContainers(): ListsMap {
      return {
        todo: this.todoTasks,
        inProgress: this.inProgressTasks,
        done: this.doneTasks,
      }
    }
  },
  methods: {
    saveNewTask() {
      this.todoTasks.push({ id: this.todoTasks.length + 1, title: this.newTaskTitle });
      this.newTaskTitle = '';
      this.taskCreationModeEnabled = false;
    },
    drop(itemData: TaskDragData) {
      if (itemData.sourceListId === itemData.targetListId) return;

      const sourceListIndex = this.tasksContainers[itemData.sourceListId].findIndex(item => itemData.item.id === item.id)
      this.tasksContainers[itemData.sourceListId].splice(sourceListIndex, 1)
      this.tasksContainers[itemData.targetListId].push(itemData.item)
    }
  },
})
</script>

<style lang='scss'>
.startPage {

  &__columns-layout {
    display: flex;
    flex-direction: row;
    height: 100vh;
  }

  &__column {
    width: 250px;
    height: 100%;
    padding: 8px;
  }
}
</style>
