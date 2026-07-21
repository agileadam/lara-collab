import useForm from "@/hooks/useForm";
import { Button, Checkbox, Flex, Text, TextInput } from "@mantine/core";
import { modals } from "@mantine/modals";

function ModalForm() {
  const [form, submit, updateValue] = useForm(
    "post",
    route("projects.task-groups.store", [route().params.project]),
    { name: "", mark_tasks_done: false, reopen_tasks: false },
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
          Create
        </Button>
      </Flex>
    </form>
  );
}

const CreateTasksGroupModal = () => {
  modals.open({
    title: (
      <Text size="xl" fw={700} mb={-10}>
        Create tasks group
      </Text>
    ),
    centered: true,
    padding: "xl",
    overlayProps: { backgroundOpacity: 0.55, blur: 3 },
    children: <ModalForm />,
  });
};

export default CreateTasksGroupModal;
