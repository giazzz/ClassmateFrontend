import { INavData } from '@coreui/angular';

export const navItems: INavData[] = [
  {
    title: true,
    name: 'Lớp học'
  },
  {
    name: 'T1807E',
    url: '/class/1/stream',
    icon: 'icon-graduation'
  },
  {
    name: 'T1907E',
    url: '/class/2/stream',
    icon: 'icon-graduation'
  },
  {
    name: 'T1907E',
    url: '/class/3/stream',
    icon: 'icon-graduation'
  },
  {
    name: 'T1907E',
    url: '/class/4/stream',
    icon: 'icon-graduation'
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
