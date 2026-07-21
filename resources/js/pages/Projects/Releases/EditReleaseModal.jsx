import useForm from "@/hooks/useForm";
import { dateFormat } from "@/utils/datetime";
import { Button, ColorInput, Flex, Text, TextInput } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { modals } from "@mantine/modals";
import dayjs from "dayjs";

function ModalForm({ item }) {
  const [form, submit, updateValue] = useForm(
    "post",
    route("projects.releases.update", [route().params.project, item.id]),
    {
      _method: "put",
      name: item.name || "",
      color: item.color || "",
      target_date: item.target_date ? dayjs(item.target_date).toDate() : "",
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
        placeholder="Release name"
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
        placeholder="Release color"
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

      <DateInput
        clearable
        valueFormat={dateFormat()}
        mt="md"
        label="Target date"
        placeholder="Pick a target date"
        value={form.data.target_date}
        onChange={(value) => updateValue("target_date", value)}
        error={form.errors.target_date}
      />

      <Flex justify="flex-end" mt="xl">
        <Button type="submit" w={100} loading={form.processing}>
          Update
        </Button>
      </Flex>
    </form>
  );
}

const EditReleaseModal = (item) => {
  modals.open({
    title: (
      <Text size="xl" fw={700} mb={-10}>
        Edit release
      </Text>
    ),
    centered: true,
    padding: "xl",
    overlayProps: { backgroundOpacity: 0.55, blur: 3 },
    children: <ModalForm item={item} />,
  });
};

export default EditReleaseModal;
