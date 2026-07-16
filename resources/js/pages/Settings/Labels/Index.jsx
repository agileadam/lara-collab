import ArchivedFilterButton from "@/components/ArchivedFilterButton";
import SearchInput from "@/components/SearchInput";
import TableHead from "@/components/TableHead";
import TableRowEmpty from "@/components/TableRowEmpty";
import Layout from "@/layouts/MainLayout";
import { redirectTo, reloadWithQuery } from "@/utils/route";
import { reorder } from "@/utils/reorder";
import { actionColumnVisibility, prepareColumns } from "@/utils/table";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { usePage } from "@inertiajs/react";
import { Button, Grid, Group, Table } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import axios from "axios";
import { useEffect, useState } from "react";
import TableRow from "./TableRow";

const LabelsIndex = () => {
  const { items } = usePage().props;
  const [labels, setLabels] = useState(items);

  useEffect(() => setLabels(items), [items]);

  const canReorder = can("reorder label") && !route().params.search && !route().params.archived;

  const columns = prepareColumns([
    { label: "", sortable: false, visible: canReorder },
    { label: "Color", sortable: false },
    { label: "Name", sortable: false },
    {
      label: "Actions",
      sortable: false,
      visible: actionColumnVisibility("label"),
    },
  ]);

  const onDragEnd = ({ source, destination }) => {
    if (!destination) return;

    const result = reorder(labels, source.index, destination.index);
    setLabels(result);

    axios
      .post(route("settings.labels.reorder"), { ids: result.map((i) => i.id) })
      .catch(() => alert("Failed to save label order"));
  };

  const rows = labels.length ? (
    labels.map((item, index) => (
      <TableRow item={item} index={index} draggable={canReorder} key={item.id} />
    ))
  ) : (
    <TableRowEmpty colSpan={columns.length} />
  );

  const search = (search) => reloadWithQuery({ search });

  return (
    <>
      <Grid justify="space-between" align="center">
        <Grid.Col span="content">
          <Group>
            <SearchInput placeholder="Search labels" search={search} />
            <ArchivedFilterButton />
          </Group>
        </Grid.Col>
        <Grid.Col span="content">
          {can("create label") && (
            <Button
              leftSection={<IconPlus size={14} />}
              radius="xl"
              onClick={() => redirectTo("settings.labels.create")}
            >
              Create
            </Button>
          )}
        </Grid.Col>
      </Grid>

      <Table.ScrollContainer maw={500} my="lg">
        <Table verticalSpacing="sm">
          <TableHead columns={columns} />
          {canReorder ? (
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="labels">
                {(provided) => (
                  <Table.Tbody ref={provided.innerRef} {...provided.droppableProps}>
                    {rows}
                    <Table.Tr>
                      <Table.Td colSpan={columns.length} p={0} style={{ border: 0 }}>
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
      </Table.ScrollContainer>
    </>
  );
};

LabelsIndex.layout = (page) => <Layout title="Labels">{page}</Layout>;

export default LabelsIndex;
