<template>
  <div
    class='taskStatusColumn__column'
    @dragover.prevent='setDragEvent(true)'
    @dragleave.prevent='setDragEvent(false)'
    @drop='drop($event)'
  >
    <div class='taskStatusColumn__header'>{{ header }}</div>
    <div
      class='taskStatusColumn__content'
    >
      <div
        v-for='task of tasks'
        :key='task.id'
        class='taskStatusColumn__taskCard'
        draggable='true'
        @dragstart='startDrag($event, task)'
      >
        <slot :task='task'>
          {{ task.id }}: {{ task.title }}
        </slot>
      </div>
      <div v-if='showOutline' class='taskStatusColumn__outline'></div>
    </div>
  </div>
</template>

<script lang='ts'>
import { defineComponent } from 'vue';
import Task from '~/types/Task';

export default defineComponent({
  name: 'TaskStatusColumn',
  props: {
    header: {
      type: String,
      required: true,
    },
    tasks: {
      type: Array as () => Array<Task>,
      required: true,
      validator: (array: Array<Task>) => array.every(t => 'id' in t)
    },
    listId: {
      type: String,
      required: true,
    }
  },
  data() {
    return {
      showOutline: false,
      draggedItem: (null as unknown) as Task,
    }
  },
  methods: {
    startDrag(event: DragEvent, item: Task) {
      event.dataTransfer!.dropEffect = 'move'
      event.dataTransfer!.effectAllowed = 'move'
      event.dataTransfer!.setData('itemData', JSON.stringify({ item, sourceListId: this.listId }))
      this.$emit('startDrag', item)
    },
    setDragEvent(value: boolean) {
      this.showOutline = value;
    },
    drop(event: DragEvent) {
      this.showOutline = false;
      const data = JSON.parse(event.dataTransfer!.getData('itemData'))
      this.$emit('drop', { item: data.item, sourceListId: data.sourceListId, targetListId: this.listId, });
    },
  },
})
</script>

<style lang='scss' scoped>
.taskStatusColumn {
  &__column {
    padding: 4px;
    width: 250px;
    height: 100%;
  }

  &__header {
    padding: 12px 16px;
  }

  &__content {
    display: flex;
    flex-direction: column;
    padding: 4px;
    gap: 6px;
    background-color: #f4f5f7;
    height: 100%;
  }

  &__taskCard {
    padding: 8px;
    background-color: #fff;
    border-radius: 3px;
    cursor: pointer;
    transition: background-color 0.3s ease-in-out;

    &:hover {
      background-color: #ebecf0;
    }
  }

  &__outline {
    border: 2px dashed red;
    height: 30px;
    pointer-events: none;
  }
}
</style>
