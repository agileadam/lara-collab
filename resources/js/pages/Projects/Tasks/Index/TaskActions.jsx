import { openConfirmModal } from "@/components/ConfirmModal";
import useTasksStore from "@/hooks/store/useTasksStore";
import { usePage } from "@inertiajs/react";
import { ActionIcon, ColorSwatch, Group, Menu, rem } from "@mantine/core";
import { IconArchive, IconArchiveOff, IconCheck, IconDots } from "@tabler/icons-react";
import { useForm } from "laravel-precognition-react-inertia";

export default function TaskActions({ task, ...props }) {
  const { releases } = usePage().props;
  const { updateTaskProperty } = useTasksStore();

  const archiveForm = useForm(
    "delete",
    route("projects.tasks.destroy", [task.project_id, task.id]),
  );
  const restoreForm = useForm("post", route("projects.tasks.restore", [task.project_id, task.id]));

  const setRelease = (releaseId) => {
    const release = releaseId ? releases.find((r) => r.id === releaseId) : null;
    updateTaskProperty(task, "release_id", releaseId, release);
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
              <>
                <Menu.Divider />
                <Menu.Label>Release</Menu.Label>
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
                    {release.name}
                  </Menu.Item>
                ))}
              </>
            )}
          </Menu.Dropdown>
        </Menu>
      )}
    </Group>
  );
}
