import useTasksStore from "@/hooks/store/useTasksStore";
import { dateTime, diffForHumans } from "@/utils/datetime";
import { getActivityIcon } from "@/utils/activityIcon";
import { Box, Center, Loader, Text, Timeline, Title, Tooltip } from "@mantine/core";
import { useEffect, useState } from "react";

export default function Activity({ task }) {
  const { activities, fetchActivities } = useTasksStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivities(task, () => setLoading(false));
  }, []);

  return (
    <Box mb="xl">
      <Title order={3} mt="xl">
        Activity
      </Title>

      {loading ? (
        <Center mih={100}>
          <Loader color="blue" />
        </Center>
      ) : (
        <Timeline active={9999} bulletSize={28} lineWidth={2} mt="md">
          {activities.map(activity => (
            <Timeline.Item key={activity.id} bullet={getActivityIcon(activity.title)} title={activity.title}>
              <Text c="dimmed" size="sm">
                {activity.subtitle}
              </Text>
              <Tooltip label={dateTime(activity.created_at)} openDelay={1000} withArrow>
                <Text inline span size="xs" c="dimmed" mt={4}>
                  {diffForHumans(activity.created_at)}
                </Text>
              </Tooltip>
            </Timeline.Item>
          ))}
        </Timeline>
      )}
    </Box>
  );
}
