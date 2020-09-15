import { INavData } from '@coreui/angular';

export const navItems: INavData[] = [
  {
    title: true,
    name: 'Lớp học'
  },
  {
    title: true,
    name: 'Chức năng'
  },
  {
    name: 'Danh sách lớp',
    url: '/dashboard',
    icon: 'icon-briefcase',
  },
  {
    name: 'Thời khóa biểu',
    url: '/schedule',
    icon: 'icon-calendar'
  },
  {
    name: 'To do',
    url: '/student/1/todo',
    icon: 'icon-notebook'
  },
  {
    name: 'Cài đặt',
    url: '/setting',
    icon: 'icon-settings'
  },
];
