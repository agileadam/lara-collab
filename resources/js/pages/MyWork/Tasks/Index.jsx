import EmptyWithIcon from "@/components/EmptyWithIcon";
import Layout from "@/layouts/MainLayout";
import useTaskFiltersStore from "@/hooks/store/useTaskFiltersStore";
import { usePage } from "@inertiajs/react";
import { Accordion, Box, Breadcrumbs, Button, Center, Group, Stack, Text, Title, rem } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { IconRocket, IconStar, IconStarFilled } from "@tabler/icons-react";
import Task from "./Task";
import classes from "./css/Index.module.css";

const TasksIndex = () => {
  let { projects } = usePage().props;
  const { prioritySort, sortHighToLow, sortLowToHigh, clearPrioritySort } =
    useTaskFiltersStore();

  projects = projects.filter((i) => i.tasks.length);

  const favorited = projects.filter((i) => i.favorite).map((i) => i.id.toString());
  const defaultOpened = favorited.length
    ? favorited
    : (projects[0] ? [projects[0].id.toString()] : []);

  const [opened, setOpened] = useLocalStorage({
    key: "my-work-tasks-opened-projects",
    defaultValue: defaultOpened,
    getInitialValueInEffect: false,
  });

  const expandAll = () => setOpened(projects.map((i) => i.id.toString()));
  const collapseAll = () => setOpened([]);

  return (
    <>
      <Breadcrumbs fz={14} mb={30}>
        <div>My Work</div>
        <div>Tasks</div>
      </Breadcrumbs>

      <Title order={1} mb={20}>
        Tasks assigned to you
      </Title>

      <Box maw={1000}>
        <Group mb={16} justify="space-between">
          <Group gap="xs">
            <Button
              size="xs"
              variant={prioritySort === "asc" ? "filled" : "light"}
              onClick={sortHighToLow}
            >
              Priority: High → Low
            </Button>
            <Button
              size="xs"
              variant={prioritySort === "desc" ? "filled" : "light"}
              onClick={sortLowToHigh}
            >
              Priority: Low → High
            </Button>
            {prioritySort && (
              <Button size="xs" variant="subtle" onClick={clearPrioritySort}>
                Default order
              </Button>
            )}
          </Group>

          {projects.length > 0 && (
            <Group gap="xs">
              <Button size="xs" variant="subtle" onClick={expandAll}>
                Expand All
              </Button>
              <Button size="xs" variant="subtle" onClick={collapseAll}>
                Collapse All
              </Button>
            </Group>
          )}
        </Group>

        {projects.length ? (
          <Accordion variant="separated" radius="md" multiple value={opened} onChange={setOpened}>
            {projects.map((project) => (
              <Accordion.Item
                key={project.id}
                value={project.id.toString()}
                className={classes.accordionControl}
              >
                <Accordion.Control
                  icon={
                    project.favorite ? (
                      <IconStarFilled
                        style={{
                          color: "var(--mantine-color-yellow-4)",
                          width: rem(20),
                          height: rem(20),
                        }}
                      />
                    ) : (
                      <IconStar
                        style={{
                          width: rem(20),
                          height: rem(20),
                        }}
                      />
                    )
                  }
                >
                  <Text fz={20} fw={600}>
                    {project.name}
                  </Text>
                </Accordion.Control>
                <Accordion.Panel>
                  <Stack gap={8}>
                    {project.tasks.map((task) => (
                      <Task key={task.id} task={task} />
                    ))}
                  </Stack>
                </Accordion.Panel>
              </Accordion.Item>
            ))}
          </Accordion>
        ) : (
          <Center mih={300}>
            <EmptyWithIcon
              title="All caught up!"
              subtitle="No tasks assigned at the moment"
              icon={IconRocket}
            />
          </Center>
        )}
      </Box>
    </>
  );
};

TasksIndex.layout = (page) => <Layout title="My Tasks">{page}</Layout>;

export default TasksIndex;
