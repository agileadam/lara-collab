import useTasksStore from "@/hooks/store/useTasksStore";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { ActionIcon, Box, Button, Checkbox, Group, Text, TextInput, Title } from "@mantine/core";
import { IconGripVertical, IconX } from "@tabler/icons-react";
import { useState } from "react";
import { createPortal } from "react-dom";
import classes from "./css/Checklist.module.css";

export default function Checklist({ task }) {
  const { addChecklistItem, updateChecklistItem, deleteChecklistItem, reorderChecklistItems } = useTasksStore();
  const [name, setName] = useState("");
  const [adding, setAdding] = useState(false);
  const items = task.checklist_items;
  const editable = can('edit task');

  const submit = () => {
    const value = name.trim();
    if (!value || adding) return;

    setAdding(true);
    addChecklistItem(task, value, () => {
      setAdding(false);
      setName("");
    });
  };

  const onDragEnd = ({ source, destination }) => {
    if (!destination || !editable) return;

    reorderChecklistItems(task, source, destination);
  };

  return (
    <Box mb="xl">
      <Title order={3} mt="xl">
        Break it down
        <Text c="dimmed" fw={500} display="inline-block" ml={5}>
          ({items.filter(i => i.completed).length}/{items.length})
        </Text>
      </Title>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="checklist-items" isDropDisabled={!editable}>
          {(provided) => (
            <Box ref={provided.innerRef} {...provided.droppableProps} mt="md">
              {items.map((item, index) => (
                <Draggable
                  key={item.id}
                  draggableId={`checklist-item-${item.id}`}
                  index={index}
                  isDragDisabled={!editable}
                >
                  {(provided, snapshot) => {
                    const row = (
                      <Group
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={classes.row}
                        wrap="nowrap"
                      >
                        <Box {...provided.dragHandleProps} className={classes.dragHandle}>
                          <IconGripVertical size={16} stroke={1.5} />
                        </Box>

                        <Checkbox
                          checked={item.completed}
                          disabled={!editable}
                          onChange={e => updateChecklistItem(task, item.id, 'completed', e.currentTarget.checked)}
                        />

                        <TextInput
                          key={`${item.id}-${item.name}`}
                          flex={1}
                          variant="unstyled"
                          classNames={{ input: classes.itemInput }}
                          defaultValue={item.name}
                          readOnly={!editable}
                          className={item.completed ? classes.completed : undefined}
                          onBlur={e => {
                            const value = e.currentTarget.value.trim();
                            if (value && value !== item.name) updateChecklistItem(task, item.id, 'name', value);
                          }}
                        />

                        {editable && (
                          <ActionIcon
                            variant="subtle"
                            color="gray"
                            onClick={() => deleteChecklistItem(task, item.id)}
                          >
                            <IconX size={16} />
                          </ActionIcon>
                        )}
                      </Group>
                    );

                    // The Drawer animates in with a CSS transform, which becomes the
                    // containing block for the drag layer's position: fixed. Portal the
                    // item to the body while dragging so it tracks the cursor correctly.
                    return snapshot.isDragging ? createPortal(row, document.body) : row;
                  }}
                </Draggable>
              ))}
              {provided.placeholder}
            </Box>
          )}
        </Droppable>
      </DragDropContext>

      {editable && (
        <Group mt="xs" wrap="nowrap">
          <TextInput
            flex={1}
            placeholder="Add checklist item"
            value={name}
            onChange={e => setName(e.currentTarget.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                e.preventDefault();
                submit();
              }
            }}
          />
          <Button variant="light" onClick={submit} disabled={!name.trim() || adding}>
            Add
          </Button>
        </Group>
      )}
    </Box>
  );
}
