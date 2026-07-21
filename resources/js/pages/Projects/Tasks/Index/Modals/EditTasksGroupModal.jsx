import useForm from "@/hooks/useForm";
import { Button, Checkbox, Flex, Text, TextInput, ColorInput } from "@mantine/core";
import { modals } from "@mantine/modals";

function ModalForm({ item }) {
  const [form, submit, updateValue] = useForm(
    "post",
    route("projects.task-groups.update", [route().params.project, item.id]),
    {
      _method: "put",
      name: item.name || "",
      color: item.color || "",
      mark_tasks_done: item.mark_tasks_done || false,
      reopen_tasks: item.reopen_tasks || false,
    },
  );

  const submitModal = (event) => {
    submit(event, {
      onSuccess: () => modals.closeAll(),
      preserveScroll: true,
    });
  };

  return (
    <form onSubmit={submitModal}>
      <TextInput
        label="Name"
        placeholder="Group name"
        required
        autoComplete="off"
        data-1p-ignore
        data-lpignore="true"
        data-bwignore
        data-autofocus
        value={form.data.name}
        onChange={(e) => updateValue("name", e.target.value)}
        error={form.errors.name}
      />

      <ColorInput
        label="Color"
        placeholder="Group color"
        mt="md"
        swatches={[
          "#343A40",
          "#E03231",
          "#C2255C",
          "#9C36B5",
          "#6741D9",
          "#3B5BDB",
          "#2771C2",
          "#2A8599",
          "#2B9267",
          "#309E44",
          "#66A810",
          "#F08C00",
          "#E7590D",
        ]}
        swatchesPerRow={7}
        value={form.data.color}
        onChange={(color) => updateValue("color", color)}
        error={form.errors.color}
      />

      <Checkbox
        label="Mark task done when it moves to this group"
        mt="md"
        checked={form.data.mark_tasks_done}
        onChange={(e) => updateValue("mark_tasks_done", e.currentTarget.checked)}
        error={form.errors.mark_tasks_done}
      />

      <Checkbox
        label="Re-open completed tasks when they move to this group"
        mt="md"
        checked={form.data.reopen_tasks}
        onChange={(e) => updateValue("reopen_tasks", e.currentTarget.checked)}
        error={form.errors.reopen_tasks}
      />

      <Flex justify="flex-end" mt="xl">
        <Button type="submit" w={100} loading={form.processing}>
          Update
        </Button>
      </Flex>
    </form>
  );
}

const EditTasksGroupModal = (item) => {
  modals.open({
    title: (
      <Text size="xl" fw={700} mb={-10}>
        Edit tasks group
      </Text>
    ),
    centered: true,
    padding: "xl",
    overlayProps: { backgroundOpacity: 0.55, blur: 3 },
    children: <ModalForm item={item} />,
  });
};

export default EditTasksGroupModal;
