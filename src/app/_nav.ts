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
    name: 'Cá nhân',
    url: '/setting',
    icon: 'icon-user'
  },
];
