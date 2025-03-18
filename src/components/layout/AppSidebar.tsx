import {
  BookOpenText,
  CalendarCheck2,
  ChartNoAxesCombined,
  Search,
  Settings,
} from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

const items = [
  {
    title: '帳本',
    url: '#',
    icon: BookOpenText,
  },
  {
    title: '帳戶',
    url: '#',
    icon: CalendarCheck2,
  },
  {
    title: '報告',
    url: '#',
    icon: ChartNoAxesCombined,
  },
  {
    title: '搜尋',
    url: '#',
    icon: Search,
  },
  {
    title: '設定',
    url: '#',
    icon: Settings,
  },
];

export function AppSidebar() {
  return (
    <Sidebar className="pt-16">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
