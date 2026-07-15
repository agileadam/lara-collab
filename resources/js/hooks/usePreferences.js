import { useLocalStorage } from "@mantine/hooks";

export default function usePreferences() {
  const [tasksView, setTasksView] = useLocalStorage({
    key: "tasks-view",
    defaultValue: "list",
    getInitialValueInEffect: false,
  });

  const [projectsView, setProjectsView] = useLocalStorage({
    key: "projects-view",
    defaultValue: "card",
    getInitialValueInEffect: false,
  });

  return { tasksView, setTasksView, projectsView, setProjectsView };
}
