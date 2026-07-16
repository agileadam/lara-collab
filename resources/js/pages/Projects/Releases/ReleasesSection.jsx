import { date } from "@/utils/datetime";
import { usePage } from "@inertiajs/react";
import { Button, ColorSwatch, Group, Table, Text, Title } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import CreateReleaseModal from "./CreateReleaseModal";
import ReleaseActions from "./ReleaseActions";

export default function ReleasesSection() {
  const { releases } = usePage().props;

  return (
    <>
      <Group justify="space-between" align="center" mb="md">
        <Title order={3}>Releases</Title>
        {can("create release") && (
          <Button
            leftSection={<IconPlus size={14} />}
            radius="xl"
            size="xs"
            onClick={CreateReleaseModal}
          >
            Add release
          </Button>
        )}
      </Group>

      {releases.length > 0 ? (
        <Table verticalSpacing="sm">
          <Table.Thead>
            <Table.Tr>
              <Table.Th w={40}></Table.Th>
              <Table.Th>Name</Table.Th>
              <Table.Th>Target date</Table.Th>
              <Table.Th w={60}></Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {releases.map((release) => (
              <Table.Tr key={release.id}>
                <Table.Td>
                  <ColorSwatch color={release.color || "#ced4da"} size={16} />
                </Table.Td>
                <Table.Td>
                  <Text fz="sm">{release.name}</Text>
                </Table.Td>
                <Table.Td>
                  <Text fz="sm" c={release.target_date ? undefined : "dimmed"}>
                    {release.target_date ? date(release.target_date) : "Not set"}
                  </Text>
                </Table.Td>
                <Table.Td>
                  <ReleaseActions release={release} />
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      ) : (
        <Text fz="sm" c="dimmed">No releases yet.</Text>
      )}
    </>
  );
}
