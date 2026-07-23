import { reorder } from '@/utils/reorder';
import axios from 'axios';
import { produce } from "immer";

const createTaskChecklistItemsSlice = (set, get) => ({
  addChecklistItem: async (task, name, onFinish) => {
    const index = get().tasks[task.group_id].findIndex((i) => i.id === task.id);

    try {
      const { data } = await axios.post(
        route("projects.tasks.checklist-items.store", [task.project_id, task.id]),
        { name },
        { progress: false },
      );
      onFinish();

      return set(produce(state => {
        state.tasks[task.group_id][index].checklist_items = [
          ...state.tasks[task.group_id][index].checklist_items,
          data.checklistItem,
        ];
      }));
    } catch (e) {
      onFinish();
      console.error(e);
      alert("Failed to add checklist item");
    }
  },
  updateChecklistItem: async (task, checklistItemId, property, value) => {
    const index = get().tasks[task.group_id].findIndex((i) => i.id === task.id);

    set(produce(state => {
      const items = state.tasks[task.group_id][index].checklist_items;
      const itemIndex = items.findIndex(i => i.id === checklistItemId);

      items[itemIndex][property] = value;
    }));

    try {
      await axios.put(
        route("projects.tasks.checklist-items.update", [task.project_id, task.id, checklistItemId]),
        { [property]: value },
        { progress: false },
      );
    } catch (e) {
      console.error(e);
      alert("Failed to save checklist item");
    }
  },
  deleteChecklistItem: async (task, checklistItemId) => {
    const index = get().tasks[task.group_id].findIndex((i) => i.id === task.id);

    try {
      await axios.delete(route("projects.tasks.checklist-items.destroy", [task.project_id, task.id, checklistItemId]), { progress: true });

      return set(produce(state => {
        state.tasks[task.group_id][index].checklist_items =
          state.tasks[task.group_id][index].checklist_items.filter(i => i.id !== checklistItemId);
      }));
    } catch (e) {
      console.error(e);
      alert("Failed to delete checklist item");
    }
  },
  reorderChecklistItems: (task, source, destination) => {
    const index = get().tasks[task.group_id].findIndex((i) => i.id === task.id);
    const result = reorder(get().tasks[task.group_id][index].checklist_items, source.index, destination.index);

    axios
      .post(
        route("projects.tasks.checklist-items.reorder", [task.project_id, task.id]),
        { ids: result.map(i => i.id) },
        { progress: false },
      )
      .catch(() => alert("Failed to save checklist order"));

    return set(produce(state => {
      state.tasks[task.group_id][index].checklist_items = result;
    }));
  },
});

export default createTaskChecklistItemsSlice;
