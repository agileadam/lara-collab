import useTaskGroupsStore from "@/hooks/store/useTaskGroupsStore";
import useTaskFiltersStore from "@/hooks/store/useTaskFiltersStore";
import { date } from "@/utils/datetime";
import { usePage } from "@inertiajs/react";
import { Button, ColorSwatch, Group, Stack, Text } from "@mantine/core";
import FilterButton from "./Filters/FilterButton";
import classes from "./Filters/css/FilterButton.module.css";

export default function Filters() {
  const { usersWithAccessToProject, labels, releases } = usePage().props;

  const { groups } = useTaskGroupsStore();
  const { filters, toggleArrayFilter, toggleObjectFilter, setValueFilter, prioritySort, sortHighToLow, sortLowToHigh, clearPrioritySort } =
    useTaskFiltersStore();

  return (
    <>
      <Stack justify="flex-start" gap={24}>
        <div>
          <Text fz="xs" fw={700} tt="uppercase" mb="sm">
            Priority
          </Text>
          <Button.Group>
            <Button
              className={classes.button}
              size="xs"
              variant={prioritySort === null ? "filled" : "default"}
              radius="md"
              onClick={clearPrioritySort}
            >
              Default
            </Button>
            <Button
              className={classes.button}
              size="xs"
              variant={prioritySort === "asc" ? "filled" : "default"}
              radius="md"
              onClick={sortHighToLow}
            >
              High
            </Button>
            <Button
              className={classes.button}
              size="xs"
              variant={prioritySort === "desc" ? "filled" : "default"}
              radius="md"
              onClick={sortLowToHigh}
            >
              Low
            </Button>
          </Button.Group>
        </div>

        {usersWithAccessToProject.length > 0 && (
          <div>
            <Text fz="xs" fw={700} tt="uppercase" mb="sm">
              Assignees
            </Text>
            <Stack justify="flex-start" gap={6}>
              {usersWithAccessToProject.map((item) => (
                <FilterButton
                  key={item.id}
                  selected={filters.assignees.includes(item.id)}
                  onClick={() => toggleArrayFilter("assignees", item.id)}
                >
                  {item.name}
                </FilterButton>
              ))}
            </Stack>
          </div>
        )}

        <div>
          <Text fz="xs" fw={700} tt="uppercase" mb="sm">
            Due date
          </Text>
          <Stack justify="flex-start" gap={6}>
            <FilterButton
              selected={filters.due_date.not_set === 1}
              onClick={() => toggleObjectFilter("due_date", "not_set")}
            >
              Not set
            </FilterButton>
            <FilterButton
              selected={filters.due_date.overdue === 1}
              onClick={() => toggleObjectFilter("due_date", "overdue")}
            >
              Overdue
            </FilterButton>
          </Stack>
        </div>

        {labels.length > 0 && (
          <div>
            <Text fz="xs" fw={700} tt="uppercase" mb="sm">
              Labels
            </Text>
            <Stack justify="flex-start" gap={6}>
              {labels.map((item) => (
                <FilterButton
                  key={item.id}
                  selected={filters.labels.includes(item.id)}
                  onClick={() => toggleArrayFilter("labels", item.id)}
                  leftSection={<ColorSwatch color={item.color} size={18} />}
                >
                  {item.name}
                </FilterButton>
              ))}
            </Stack>
          </div>
        )}

        {releases.length > 0 && (
          <div>
            <Text fz="xs" fw={700} tt="uppercase" mb="sm">
              Releases
            </Text>
            <Stack justify="flex-start" gap={6}>
              <FilterButton
                selected={filters.releases.includes("not_set")}
                onClick={() => toggleArrayFilter("releases", "not_set")}
              >
                Not set
              </FilterButton>
              {releases.map((item) => {
                const selected = filters.releases.includes(item.id);

                return (
                  <FilterButton
                    key={item.id}
                    selected={selected}
                    onClick={() => toggleArrayFilter("releases", item.id)}
                    leftSection={<ColorSwatch color={item.color} size={18} />}
                  >
                    <Group gap={6} justify="space-between" wrap="nowrap">
                      <span>{item.name}</span>
                      {item.target_date && (
                        <Text fz="xs" c={selected ? "white" : "dimmed"}>{date(item.target_date)}</Text>
                      )}
                    </Group>
                  </FilterButton>
                );
              })}
            </Stack>
          </div>
        )}

        <div>
          <Text fz="xs" fw={700} tt="uppercase" mb="sm">
            Status
          </Text>
          <Stack justify="flex-start" gap={6}>
            <FilterButton
              selected={filters.status === "all"}
              onClick={() => setValueFilter("status", "all")}
            >
              All
            </FilterButton>
            <FilterButton
              selected={filters.status === "open" || !filters.status}
              onClick={() => setValueFilter("status", "open")}
            >
              Open
            </FilterButton>
            <FilterButton
              selected={filters.status === "completed"}
              onClick={() => setValueFilter("status", "completed")}
            >
              Completed
            </FilterButton>
          </Stack>
        </div>

        {groups.length > 0 && (
          <div>
            <Text fz="xs" fw={700} tt="uppercase" mb="sm">
              Task groups
            </Text>
            <Stack justify="flex-start" gap={6}>
              {groups.map((item) => (
                <FilterButton
                  key={item.id}
                  selected={filters.groups.includes(item.id)}
                  onClick={() => toggleArrayFilter("groups", item.id)}
                >
                  {item.name}
                </FilterButton>
              ))}
            </Stack>
          </div>
        )}
      </Stack>
    </>
  );
}
