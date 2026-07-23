import {
  IconArchive,
  IconCalendarMonth,
  IconCheck,
  IconClock,
  IconEdit,
  IconMessage,
  IconPaperclip,
  IconPlus,
  IconX,
} from "@tabler/icons-react";

export const getActivityIcon = (title) => {
  if (title.includes("archived")) {
    return <IconArchive size={18} />;
  }
  if (title.includes("comment")) {
    return <IconMessage size={18} />;
  }
  if (title.includes("was changed")) {
    return <IconEdit size={18} />;
  }
  if (title.includes("Due date")) {
    return <IconCalendarMonth size={18} />;
  }
  if (title.includes("Attachment")) {
    return <IconPaperclip size={18} />;
  }
  if (title.includes("Estimation was set")) {
    return <IconClock size={18} />;
  }
  if (title.includes("was completed")) {
    return <IconCheck size={18} />;
  }
  if (title.includes("uncompleted")) {
    return <IconX size={18} />;
  }
  if (title === "New task" || title === "New project" || title.includes("Assigned user")) {
    return <IconPlus size={18} />;
  }
};
