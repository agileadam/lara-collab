import { move, reorder } from "@/utils/reorder";
import { produce } from "immer";

const createTaskWebSocketUpdatesSlice = (set, get) => ({
  addTaskLocally: (task) => {
    return set(produce(state => {
      state.tasks[task.group_id] = [...state.tasks[task.group_id], task].sort((a, b) => (a.order_column > b.order_column ? 1 : -1));
    }));
  },
  updateTaskLocally: (taskId, property, value, relatedData = null) => {
    return set(produce(state => {
      const task = get().findTask(taskId);
      const index = state.tasks[task.group_id].findIndex((i) => i.id === task.id);

      if (property === 'group_id' && task.group_id !== value) {
        const result = move(state.tasks, task.group_id, value, index, 0);

        state.tasks[task.group_id] = result[task.group_id];
        state.tasks[value] = result[value];

        state.tasks[value][0][property] = value;

        if (relatedData) {
          Object.keys(relatedData).forEach((key) => {
            state.tasks[value][0][key] = relatedData[key];
          });
        }
      } else {
        state.tasks[task.group_id][index][property] = value;

        // If related data is provided, update those properties as well
        if (relatedData) {
          Object.keys(relatedData).forEach((key) => {
            state.tasks[task.group_id][index][key] = relatedData[key];
          });
        }
      }
    }));
  },
  removeTaskLocally: (taskId) => {
    return set(produce(state => {
      const task = get().findTask(taskId);

      state.tasks[task.group_id] = state.tasks[task.group_id].filter(i => i.id !== task.id);
    }));
  },
  restoreTaskLocally: (groupId, newTask) => {
    return set(produce(state => {
      state.tasks[groupId] = [newTask, ...state.tasks[groupId]].sort((a, b) => (a.order_column > b.order_column ? 1 : -1));
    }));
  },
  addCommentLocally: (comment) => {
    return set(produce(state => {
      state.comments = [comment, ...state.comments];
    }));
  },
  addAttachmentsLocally: (attachments) => {
    return set(produce(state => {
      const task = get().findTask(attachments[0].task_id);
      const index = state.tasks[task.group_id].findIndex(i => i.id === task.id);

      state.tasks[task.group_id][index].attachments = [...state.tasks[task.group_id][index].attachments, ...attachments];
    }));
  },
  removeAttachmentLocally: (taskId, attachmentId) => {
    return set(produce(state => {
      const task = get().findTask(taskId);
      const index = state.tasks[task.group_id].findIndex(i => i.id === taskId);

      state.tasks[task.group_id][index].attachments = state.tasks[task.group_id][index].attachments.filter(i => i.id !== attachmentId);
    }));
  },
  addTimeLogLocally: (timeLog) => {
    return set(produce(state => {
      const task = get().findTask(timeLog.task_id);
      const index = state.tasks[task.group_id].findIndex(i => i.id === task.id);

      state.tasks[task.group_id][index].time_logs = [...state.tasks[task.group_id][index].time_logs, timeLog];
    }));
  },
  removeTimeLogLocally: (taskId, timeLogId) => {
    return set(produce(state => {
      const task = get().findTask(taskId);
      const index = state.tasks[task.group_id].findIndex(i => i.id === taskId);

      state.tasks[task.group_id][index].time_logs = state.tasks[task.group_id][index].time_logs.filter(i => i.id !== timeLogId);
    }));
  },
  addChecklistItemLocally: (checklistItem) => {
    return set(produce(state => {
      const task = get().findTask(checklistItem.task_id);
      if (!task) return;
      const index = state.tasks[task.group_id].findIndex(i => i.id === task.id);

      state.tasks[task.group_id][index].checklist_items = [...state.tasks[task.group_id][index].checklist_items, checklistItem];
    }));
  },
  updateChecklistItemLocally: (checklistItem) => {
    return set(produce(state => {
      const task = get().findTask(checklistItem.task_id);
      if (!task) return;
      const index = state.tasks[task.group_id].findIndex(i => i.id === task.id);
      const items = state.tasks[task.group_id][index].checklist_items;
      const itemIndex = items.findIndex(i => i.id === checklistItem.id);

      if (itemIndex !== -1) items[itemIndex] = checklistItem;
    }));
  },
  removeChecklistItemLocally: (taskId, checklistItemId) => {
    return set(produce(state => {
      const task = get().findTask(taskId);
      if (!task) return;
      const index = state.tasks[task.group_id].findIndex(i => i.id === taskId);

      state.tasks[task.group_id][index].checklist_items =
        state.tasks[task.group_id][index].checklist_items.filter(i => i.id !== checklistItemId);
    }));
  },
  reorderChecklistItemsLocally: (taskId, ids) => {
    return set(produce(state => {
      const task = get().findTask(taskId);
      if (!task) return;
      const index = state.tasks[task.group_id].findIndex(i => i.id === taskId);
      const items = state.tasks[task.group_id][index].checklist_items;

      state.tasks[task.group_id][index].checklist_items = ids.map(id => items.find(i => i.id === id));
    }));
  },
  reorderTaskLocally: (groupId, fromIndex, toIndex) => {
    const result = reorder(get().tasks[groupId], fromIndex, toIndex);
    return set(produce(state => { state.tasks[groupId] = result }));
  },
  moveTaskLocally: (fromGroupId, toGroupId, fromIndex, toIndex, markedDone = false, reopened = false) => {
    const result = move(get().tasks, fromGroupId, toGroupId, fromIndex, toIndex);


    return set(produce(state => {
      state.tasks[fromGroupId] = result[fromGroupId];
      state.tasks[toGroupId] = result[toGroupId];
      state.tasks[toGroupId][toIndex] = {...state.tasks[toGroupId][toIndex], group_id: toGroupId};

      if (markedDone) {
        state.tasks[toGroupId][toIndex].completed_at = new Date().toISOString();
      } else if (reopened) {
        state.tasks[toGroupId][toIndex].completed_at = null;
      }
    }));
  },
});

export default createTaskWebSocketUpdatesSlice;
