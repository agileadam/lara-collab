import axios from 'axios';
import { produce } from "immer";

const createTaskActivitySlice = (set) => ({
  activities: [],
  fetchActivities: async (task, onFinish) => {
    try {
      const { data } = await axios.get(route("projects.tasks.activity", [task.project_id, task.id]));
      onFinish();

      return set(produce(state => { state.activities = data; }));
    } catch (e) {
      onFinish();
      console.error(e);
      alert("Failed to load activity");
    }
  },
});

export default createTaskActivitySlice;
