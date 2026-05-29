import {
  BoxIcon,
  CalenderIcon,
  DollarLineIcon,
  GridIcon,
  GroupIcon,
  ListIcon,
  ShootingStarIcon,
  TaskIcon,
  UserCircleIcon,
} from "../icons";

export type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

export const shoppingNavItems: NavItem[] = [
  {
    icon: <GridIcon />,
    name: "Dashboard",
    path: "/",
  },
  {
    icon: <UserCircleIcon />,
    name: "Users",
    path: "/admin/users",
  },
  {
    icon: <ListIcon />,
    name: "Manage",
    subItems: [
      { name: "Banners", path: "/admin/banners" },
      { name: "Coupons", path: "/admin/coupons" },
      { name: "Gold Price", path: "/admin/gold-price" },
      { name: "Reviews", path: "/admin/reviews" },
    ],
  },
  {
    icon: <BoxIcon />,
    name: "Product",
    subItems: [
      { name: "Products", path: "/admin/products" },
      { name: "Categories", path: "/admin/categories" },
    ],
  },
  {
    icon: <TaskIcon />,
    name: "Orders",
    path: "/admin/orders",
  },
];

export const mlmNavItems: NavItem[] = [
  {
    icon: <GridIcon />,
    name: "Dashboard",
    path: "/admin/mlm",
  },
  {
    icon: <GroupIcon />,
    name: "Members",
    path: "/admin/mlm/members",
  },
  {
    icon: <ShootingStarIcon />,
    name: "Manual BV",
    path: "/admin/mlm/manual-bv",
  },
  {
    icon: <CalenderIcon />,
    name: "Monthly Closing",
    path: "/admin/mlm/closing",
  },
  {
    icon: <DollarLineIcon />,
    name: "Withdrawals",
    path: "/admin/mlm/withdrawals",
  },
];

export function isNavPathActive(pathname: string, path: string): boolean {
  if (path === "/admin/mlm") {
    return pathname === path;
  }
  if (path === "/admin/products") {
    return pathname === path || pathname.startsWith("/admin/products/");
  }
  if (path === "/admin/mlm/members") {
    return pathname === path || pathname.startsWith("/admin/mlm/members/");
  }
  return pathname === path;
}
