import { openConfirmModal } from "@/components/ConfirmModal";
import { ActionIcon, Group, Menu, rem } from "@mantine/core";
import { IconDots, IconPencil, IconTrash } from "@tabler/icons-react";
import { useForm } from "laravel-precognition-react-inertia";
import EditReleaseModal from "./EditReleaseModal";

export default function ReleaseActions({ release, ...props }) {
  const deleteForm = useForm(
    "delete",
    route("projects.releases.destroy", [release.project_id, release.id]),
  );

  const openDeleteModal = () =>
    openConfirmModal({
      type: "danger",
      title: "Delete release",
      content: "Are you sure you want to delete this release? Tasks assigned to it will keep their other details but lose this release.",
      confirmLabel: "Delete",
      confirmProps: { color: "red" },
      onConfirm: () => deleteForm.submit({ preserveScroll: true }),
    });

  const openEditModal = () => EditReleaseModal(release);

  return (
    <Group gap={0} justify="flex-end" {...props}>
      {(can("edit release") || can("delete release")) && (
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
            {can("edit release") && (
              <Menu.Item
                leftSection={
                  <IconPencil style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                }
                onClick={openEditModal}
              >
                Edit
              </Menu.Item>
            )}
            {can("delete release") && (
              <Menu.Item
                leftSection={
                  <IconTrash style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                }
                color="red"
                onClick={openDeleteModal}
              >
                Delete
              </Menu.Item>
            )}
          </Menu.Dropdown>
        </Menu>
      )}
    </Group>
  );
}
