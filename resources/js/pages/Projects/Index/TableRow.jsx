import { getInitials } from "@/utils/user";
import { redirectTo } from "@/utils/route";
import { Avatar, Group, Progress, Table, Text, Tooltip } from "@mantine/core";
import ToggleFavorite from "./FavoriteToggle";
import ProjectCardActions from "./ProjectCardActions";

export default function TableRow({ item }) {
  const completedPercent = (item.completed_tasks_count / item.all_tasks_count) * 100;
  const overduePercent = (item.overdue_tasks_count / item.all_tasks_count) * 100;

  const onRowClick = (event) => {
    if (event.target.closest("[data-ignore-link]")) return;
    redirectTo("projects.tasks", item.id);
  };

  return (
    <Table.Tr onClick={onRowClick} style={{ cursor: "pointer" }}>
      <Table.Td>
        <Group gap="sm" wrap="nowrap">
          <ToggleFavorite item={item} />
          <div>
            <Text fz="sm" fw={500}>
              {item.name}
            </Text>
            {item.description?.length > 0 && (
              <Text fz="xs" c="dimmed" lineClamp={1}>
                {item.description}
              </Text>
            )}
          </div>
        </Group>
      </Table.Td>
      <Table.Td>
        <Text fz="sm">{item.client_company?.name}</Text>
      </Table.Td>
      <Table.Td miw={160}>
        <Text fz="xs" c="dimmed" mb={4}>
          {item.completed_tasks_count} / {item.all_tasks_count} completed
        </Text>
        <Progress.Root value={item.all_tasks_count} radius="xl">
          <Tooltip label={`Completed: ${item.completed_tasks_count}`} withArrow>
            <Progress.Section value={completedPercent} color="blue" />
          </Tooltip>
          <Tooltip label={`Overdue: ${item.overdue_tasks_count}`} withArrow>
            <Progress.Section value={overduePercent} color="red" />
          </Tooltip>
          <Progress.Section value={100 - (completedPercent + overduePercent)} color="gray" />
        </Progress.Root>
      </Table.Td>
      <Table.Td>
        <Avatar.Group spacing="sm">
          {item.users_with_access.slice(0, 4).map((user) => (
            <Tooltip key={user.id} label={user.name} openDelay={300} withArrow>
              <Avatar src={user.avatar} radius="xl" size="sm" style={{ cursor: "default" }} data-ignore-link>
                {getInitials(user.name)}
              </Avatar>
            </Tooltip>
          ))}
          {item.users_with_access.length - 4 > 0 && (
            <Avatar radius="xl" size="sm" data-ignore-link>
              +{item.users_with_access.length - 4}
            </Avatar>
          )}
        </Avatar.Group>
      </Table.Td>
      <Table.Td>
        <ProjectCardActions item={item} />
      </Table.Td>
    </Table.Tr>
  );
}
