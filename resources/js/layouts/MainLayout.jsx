import FlashNotification from "@/components/FlashNotification";
import useNavigationStore from "@/hooks/store/useNavigationStore";
import useNotificationsStore from "@/hooks/store/useNotificationsStore";
import useAuthorization from "@/hooks/useAuthorization";
import useWebSockets from "@/hooks/useWebSockets";
import NavBarNested from "@/layouts/NavBarNested";
import Notifications from "@/layouts/Notifications";
import { Head, usePage } from "@inertiajs/react";
import { ActionIcon, AppShell, Tooltip } from "@mantine/core";
import {
  IconLayoutSidebarLeftCollapse,
  IconLayoutSidebarLeftExpand,
} from "@tabler/icons-react";
import { useEffect } from "react";

export default function MainLayout({ children, title }) {
  window.can = useAuthorization().can;

  const { initUserWebSocket } = useWebSockets();
  const { notifications } = usePage().props.auth;
  const { setNotifications } = useNotificationsStore();
  const { sidebarCollapsed, toggleSidebar } = useNavigationStore();

  useEffect(() => {
    initUserWebSocket();
    setNotifications(notifications);
  }, []);

  return (
    <AppShell
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: { mobile: false, desktop: sidebarCollapsed },
      }}
      padding="4rem"
    >
      <Head title={title} />

      <FlashNotification />

      <Notifications />

      <AppShell.Navbar>
        <NavBarNested></NavBarNested>
      </AppShell.Navbar>

      <Tooltip label={sidebarCollapsed ? "Show sidebar" : "Hide sidebar"} position="right">
        <ActionIcon
          onClick={toggleSidebar}
          variant="filled"
          color="blue"
          size="lg"
          radius="xl"
          style={{
            position: "fixed",
            top: "1rem",
            left: sidebarCollapsed ? "1rem" : "calc(300px + 1rem)",
            zIndex: 200,
            transition: "left 200ms ease",
          }}
        >
          {sidebarCollapsed ? (
            <IconLayoutSidebarLeftExpand size={18} />
          ) : (
            <IconLayoutSidebarLeftCollapse size={18} />
          )}
        </ActionIcon>
      </Tooltip>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
