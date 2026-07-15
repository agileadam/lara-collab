import ArchivedFilterButton from "@/components/ArchivedFilterButton";
import EmptyWithIcon from "@/components/EmptyWithIcon";
import SearchInput from "@/components/SearchInput";
import TableHead from "@/components/TableHead";
import useAuthorization from "@/hooks/useAuthorization";
import usePreferences from "@/hooks/usePreferences";
import Layout from "@/layouts/MainLayout";
import { redirectTo, reloadWithQuery } from "@/utils/route";
import { prepareColumns } from "@/utils/table";
import { usePage } from "@inertiajs/react";
import { ActionIcon, Button, Center, Flex, Grid, Group, Table, Tooltip } from "@mantine/core";
import { IconLayoutGrid, IconLayoutList, IconPlus, IconSearch } from "@tabler/icons-react";
import ProjectCard from "./Index/ProjectCard";
import ProjectTableRow from "./Index/TableRow";

const ProjectsIndex = () => {
  const { items } = usePage().props;
  const { isAdmin } = useAuthorization();
  const { projectsView, setProjectsView } = usePreferences();

  const search = (search) => reloadWithQuery({ search });

  const columns = prepareColumns([
    { label: "Project", sortable: false },
    { label: "Client", sortable: false },
    { label: "Progress", sortable: false },
    { label: "Team", sortable: false },
    {
      label: "Actions",
      sortable: false,
      visible:
        can("edit project") ||
        can("archive project") ||
        can("restore project") ||
        can("edit project user access"),
    },
  ]);

  return (
    <>
      <Grid justify="space-between" align="center">
        <Grid.Col span="content">
          <Group>
            <SearchInput placeholder="Search projects" search={search} />
            {isAdmin() && <ArchivedFilterButton />}
          </Group>
        </Grid.Col>
        <Grid.Col span="content">
          <Group>
            <ActionIcon.Group>
              <ActionIcon
                size="lg"
                variant={projectsView === "card" ? "filled" : "default"}
                onClick={() => setProjectsView("card")}
              >
                <Tooltip label="Card view" openDelay={250} withArrow>
                  <IconLayoutGrid style={{ width: "45%", height: "45%" }} />
                </Tooltip>
              </ActionIcon>
              <ActionIcon
                size="lg"
                variant={projectsView === "list" ? "filled" : "default"}
                onClick={() => setProjectsView("list")}
              >
                <Tooltip label="List view" openDelay={250} withArrow>
                  <IconLayoutList style={{ width: "40%", height: "40%" }} />
                </Tooltip>
              </ActionIcon>
            </ActionIcon.Group>

            {can("create project") && (
              <Button
                leftSection={<IconPlus size={14} />}
                radius="xl"
                onClick={() => redirectTo("projects.create")}
              >
                Create
              </Button>
            )}
          </Group>
        </Grid.Col>
      </Grid>

      {items.length ? (
        projectsView === "list" ? (
          <Table.ScrollContainer miw={800} my="lg">
            <Table verticalSpacing="sm" highlightOnHover>
              <TableHead columns={columns} sort={() => {}} />
              <Table.Tbody>
                {items.map((item) => (
                  <ProjectTableRow item={item} key={item.id} />
                ))}
              </Table.Tbody>
            </Table>
          </Table.ScrollContainer>
        ) : (
          <Flex mt="xl" gap="lg" justify="flex-start" align="flex-start" direction="row" wrap="wrap">
            {items.map((item) => (
              <ProjectCard item={item} key={item.id} />
            ))}
          </Flex>
        )
      ) : (
        <Center mih={400}>
          <EmptyWithIcon
            title="No projects found"
            subtitle="or you do not have access to any of them"
            icon={IconSearch}
          />
        </Center>
      )}
    </>
  );
};

ProjectsIndex.layout = (page) => <Layout title="Projects">{page}</Layout>;

export default ProjectsIndex;
