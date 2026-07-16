import TableRowActions from "@/components/TableRowActions";
import { Draggable } from "@hello-pangea/dnd";
import { ColorSwatch, Table, Text } from "@mantine/core";
import { IconGripVertical } from "@tabler/icons-react";

export default function TableRow({ item, index, draggable }) {
  const cells = (dragHandleProps) => (
    <>
      {draggable && (
        <Table.Td w={36}>
          <div {...dragHandleProps} style={{ cursor: "grab", display: "flex" }}>
            <IconGripVertical size={16} stroke={1.5} />
          </div>
        </Table.Td>
      )}
      <Table.Td w={80}>
        <ColorSwatch color={item.color} />
      </Table.Td>
      <Table.Td>
        <Text fz="sm">{item.name}</Text>
      </Table.Td>
      {(can("edit label") || can("archive label") || can("restore label")) && (
        <Table.Td w={100}>
          <TableRowActions
            item={item}
            editRoute="settings.labels.edit"
            editPermission="edit label"
            archivePermission="archive label"
            restorePermission="restore label"
            archive={{
              route: "settings.labels.destroy",
              title: "Archive label",
              content: "Are you sure you want to archive this label?",
              confirmLabel: "Archive",
            }}
            restore={{
              route: "settings.labels.restore",
              title: "Restore label",
              content: "Are you sure you want to restore this label?",
              confirmLabel: "Restore",
            }}
          />
        </Table.Td>
      )}
    </>
  );

  if (!draggable) {
    return <Table.Tr>{cells()}</Table.Tr>;
  }

  return (
    <Draggable draggableId={item.id.toString()} index={index}>
      {(provided, snapshot) => (
        <Table.Tr
          ref={provided.innerRef}
          {...provided.draggableProps}
          bg={snapshot.isDragging ? "gray.0" : undefined}
        >
          {cells(provided.dragHandleProps)}
        </Table.Tr>
      )}
    </Draggable>
  );
}
