import { date } from "@/utils/datetime";
import { reorder } from "@/utils/reorder";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { usePage } from "@inertiajs/react";
import { Button, ColorSwatch, Group, Table, Text, Title } from "@mantine/core";
import { IconGripVertical, IconPlus } from "@tabler/icons-react";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import CreateReleaseModal from "./CreateReleaseModal";
import ReleaseActions from "./ReleaseActions";

export default function ReleasesSection() {
  const { releases: items } = usePage().props;
  const [releases, setReleases] = useState(items);
  const [draggingWidths, setDraggingWidths] = useState(null);
  const rowRefs = useRef({});

  useEffect(() => setReleases(items), [items]);

  const canReorder = can("reorder release");

  // The row being dragged is pulled out of the table's layout (position: fixed),
  // so its cells lose the table's column grid. Freeze their current widths as
  // inline styles for the duration of the drag so they don't collapse.
  const onBeforeCapture = ({ draggableId }) => {
    const row = rowRefs.current[draggableId];
    if (!row) return;

    setDraggingWidths(Array.from(row.children).map(td => td.getBoundingClientRect().width));
  };

  const onDragEnd = ({ source, destination }) => {
    setDraggingWidths(null);
    if (!destination) return;

    const result = reorder(releases, source.index, destination.index);
    setReleases(result);

    axios
      .post(route("projects.releases.reorder", route().params.project), { ids: result.map((i) => i.id) })
      .catch(() => alert("Failed to save release order"));
  };

  const cells = (release, dragHandleProps, widths) => {
    let i = -1;
    const width = () => (widths ? { width: widths[++i], minWidth: widths[i], maxWidth: widths[i] } : undefined);

    return (
      <>
        {canReorder && (
          <Table.Td w={36} style={width()}>
            <div {...dragHandleProps} style={{ cursor: "grab", display: "flex" }}>
              <IconGripVertical size={16} stroke={1.5} />
            </div>
          </Table.Td>
        )}
        <Table.Td style={width()}>
          <ColorSwatch color={release.color || "#ced4da"} size={16} />
        </Table.Td>
        <Table.Td style={width()}>
          <Text fz="sm">{release.name}</Text>
        </Table.Td>
        <Table.Td w={140} style={width()}>
          <Text fz="sm" c={release.target_date ? undefined : "dimmed"}>
            {release.target_date ? date(release.target_date) : "Not set"}
          </Text>
        </Table.Td>
        <Table.Td w={60} style={width()}>
          <ReleaseActions release={release} />
        </Table.Td>
      </>
    );
  };

  const rows = releases.map((release, index) =>
    canReorder ? (
      <Draggable key={release.id} draggableId={`release-${release.id}`} index={index}>
        {(provided, snapshot) => (
          <Table.Tr
            ref={node => {
              provided.innerRef(node);
              rowRefs.current[`release-${release.id}`] = node;
            }}
            {...provided.draggableProps}
          >
            {cells(release, provided.dragHandleProps, snapshot.isDragging ? draggingWidths : null)}
          </Table.Tr>
        )}
      </Draggable>
    ) : (
      <Table.Tr key={release.id}>{cells(release)}</Table.Tr>
    )
  );

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
        <Table verticalSpacing="sm" layout="fixed">
          <Table.Thead>
            <Table.Tr>
              {canReorder && <Table.Th w={36}></Table.Th>}
              <Table.Th w={40}></Table.Th>
              <Table.Th>Name</Table.Th>
              <Table.Th w={140}>Target date</Table.Th>
              <Table.Th w={60}></Table.Th>
            </Table.Tr>
          </Table.Thead>
          {canReorder ? (
            <DragDropContext onBeforeCapture={onBeforeCapture} onDragEnd={onDragEnd}>
              <Droppable droppableId="releases">
                {(provided) => (
                  <Table.Tbody ref={provided.innerRef} {...provided.droppableProps}>
                    {rows}
                    <Table.Tr>
                      <Table.Td colSpan={5} p={0} style={{ border: 0 }}>
                        {provided.placeholder}
                      </Table.Td>
                    </Table.Tr>
                  </Table.Tbody>
                )}
              </Droppable>
            </DragDropContext>
          ) : (
            <Table.Tbody>{rows}</Table.Tbody>
          )}
        </Table>
      ) : (
        <Text fz="sm" c="dimmed">No releases yet.</Text>
      )}
    </>
  );
}
