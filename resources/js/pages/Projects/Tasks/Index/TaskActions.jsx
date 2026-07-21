import { openConfirmModal } from "@/components/ConfirmModal";
import useTasksStore from "@/hooks/store/useTasksStore";
import { date } from "@/utils/datetime";
import { usePage } from "@inertiajs/react";
import { ActionIcon, ColorSwatch, Group, Menu, Text, rem } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconArchive,
  IconArchiveOff,
  IconCheck,
  IconChevronRight,
  IconDots,
  IconTag,
} from "@tabler/icons-react";
import { useForm } from "laravel-precognition-react-inertia";

export default function TaskActions({ task, ...props }) {
  const { releases } = usePage().props;
  const { updateTaskProperty } = useTasksStore();
  const [opened, { toggle, close }] = useDisclosure(false);

  const archiveForm = useForm(
    "delete",
    route("projects.tasks.destroy", [task.project_id, task.id]),
  );
  const restoreForm = useForm("post", route("projects.tasks.restore", [task.project_id, task.id]));

  const setRelease = (releaseId) => {
    const release = releaseId ? releases.find((r) => r.id === releaseId) : null;
    updateTaskProperty(task, "release_id", releaseId, release);
    close();
  };

  const openArchiveModal = () =>
    openConfirmModal({
      type: "danger",
      title: "Archive task",
      content: `Are you sure you want to archive this task?`,
      confirmLabel: "Archive",
      confirmProps: { color: "red" },
      onConfirm: () => archiveForm.submit({ preserveScroll: true }),
    });

  const openRestoreModal = () =>
    openConfirmModal({
      type: "info",
      title: "Restore task",
      content: `Are you sure you want to restore this task?`,
      confirmLabel: "Restore",
      confirmProps: { color: "blue" },
      onConfirm: () => restoreForm.submit({ preserveScroll: true }),
    });

  return (
    <Group gap={0} justify="flex-end" {...props}>
      {((can("archive task") && !route().params.archived) ||
        (can("restore task") && route().params.archived) ||
        can("edit task")) && (
        <Menu
          opened={opened}
          onChange={toggle}
          withArrow
          position="bottom-end"
          withinPortal
          shadow="md"
          transitionProps={{ duration: 100, transition: "pop-top-right" }}
          offset={{ mainAxis: 3, alignmentAxis: 5 }}
        >
          <Menu.Target>
            <ActionIcon variant="subtle" color="gray">
              <IconDots style={{ width: rem(20), height: rem(20) }} stroke={1.5} />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            {can("restore task") && route().params.archived && (
              <Menu.Item
                leftSection={
                  <IconArchiveOff style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                }
                color="blue"
                onClick={openRestoreModal}
              >
                Restore
              </Menu.Item>
            )}
            {can("archive task") && !route().params.archived && (
              <Menu.Item
                leftSection={
                  <IconArchive style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                }
                color="red"
                onClick={openArchiveModal}
              >
                Archive
              </Menu.Item>
            )}
            {can("edit task") && releases?.length > 0 && (
              <Menu
                trigger="hover"
                openDelay={100}
                closeDelay={200}
                position="right-start"
                withinPortal
                shadow="md"
                offset={0}
              >
                <Menu.Target>
                  <Menu.Item
                    leftSection={<IconTag style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
                    rightSection={
                      <IconChevronRight style={{ width: rem(14), height: rem(14) }} stroke={1.5} />
                    }
                  >
                    Set Release
                  </Menu.Item>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item
                    rightSection={
                      task.release_id === null && (
                        <IconCheck style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                      )
                    }
                    onClick={() => setRelease(null)}
                  >
                    No release
                  </Menu.Item>
                  {releases.map((release) => (
                    <Menu.Item
                      key={release.id}
                      leftSection={<ColorSwatch color={release.color || "#ced4da"} size={12} />}
                      rightSection={
                        task.release_id === release.id && (
                          <IconCheck style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                        )
                      }
                      onClick={() => setRelease(release.id)}
                    >
                      <Group gap={7} justify="space-between" wrap="nowrap">
                        <Text size="sm">{release.name}</Text>
                        {release.target_date && (
                          <Text size="xs" c="dimmed">
                            {date(release.target_date)}
                          </Text>
                        )}
                      </Group>
                    </Menu.Item>
                  ))}
                </Menu.Dropdown>
              </Menu>
            )}
          </Menu.Dropdown>
        </Menu>
      )}
    </Group>
  );
}
