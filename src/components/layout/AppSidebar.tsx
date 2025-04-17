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
    title: '記帳本',
    url: '/dashboard/accounting-book',
    icon: BookOpenText,
  },
  {
    title: '帳戶',
    url: '/dashboard/account',
    icon: CalendarCheck2,
  },
  {
    title: '圖表分析',
    url: '/dashboard/report',
    icon: ChartNoAxesCombined,
  },
  {
    title: '搜尋',
    url: '/dashboard/search',
    icon: Search,
  },
  {
    title: '設定',
    url: '/dashboard/settings',
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
