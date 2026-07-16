import { openConfirmModal } from "@/components/ConfirmModal";
import useForm from "@/hooks/useForm";
import UserAccessModal from "@/pages/Projects/Index/Modals/UserAccessModal";
import { router, usePage } from "@inertiajs/react";
import { ActionIcon, Menu, Tooltip, rem } from "@mantine/core";
import { IconArchive, IconArchiveOff, IconDots, IconPencil, IconUsers } from "@tabler/icons-react";

export default function ProjectActions() {
  const { project, usersWithAccessToProject } = usePage().props;

  const [archiveForm] = useForm("delete", route("projects.destroy", project.id));
  const [restoreForm] = useForm("post", route("projects.restore", project.id));

  const openArchiveModal = () =>
    openConfirmModal({
      type: "danger",
      title: "Archive project",
      content: "Are you sure you want to archive this project? This action will prevent users from accessing it.",
      confirmLabel: "Archive",
      confirmProps: { color: "red" },
      onConfirm: () => archiveForm.submit({ preserveScroll: true }),
    });

  const openRestoreModal = () =>
    openConfirmModal({
      type: "info",
      title: "Restore project",
      content: "Are you sure you want to restore this project?",
      confirmLabel: "Restore",
      confirmProps: { color: "blue" },
      onConfirm: () => restoreForm.submit({ preserveScroll: true }),
    });

  const openUserAccess = () =>
    UserAccessModal({ ...project, users_with_access: usersWithAccessToProject });

  if (
    !can("edit project user access") &&
    !can("edit project") &&
    !can("restore project") &&
    !can("archive project")
  ) {
    return null;
  }

  return (
    <Menu
      withArrow
      position="bottom-end"
      shadow="md"
      transitionProps={{ duration: 100, transition: "pop-top-right" }}
      offset={{ mainAxis: 3, alignmentAxis: 5 }}
    >
      <Menu.Target>
        <Tooltip label="Project actions" openDelay={500} withArrow>
          <ActionIcon variant="default" size="lg">
            <IconDots style={{ width: "60%", height: "60%" }} stroke={1.5} />
          </ActionIcon>
        </Tooltip>
      </Menu.Target>
      <Menu.Dropdown>
        {can("edit project user access") && (
          <Menu.Item
            leftSection={<IconUsers style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
            onClick={openUserAccess}
          >
            User access
          </Menu.Item>
        )}
        {can("edit project") && (
          <Menu.Item
            leftSection={<IconPencil style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
            onClick={() => router.visit(route("projects.edit", project.id))}
          >
            Edit
          </Menu.Item>
        )}
        {can("restore project") && project.archived_at && (
          <Menu.Item
            leftSection={<IconArchiveOff style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
            color="blue"
            onClick={openRestoreModal}
          >
            Restore
          </Menu.Item>
        )}
        {can("archive project") && !project.archived_at && (
          <Menu.Item
            leftSection={<IconArchive style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
            color="red"
            onClick={openArchiveModal}
          >
            Archive
          </Menu.Item>
        )}
      </Menu.Dropdown>
    </Menu>
  );
}
