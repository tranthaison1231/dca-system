import Whale from "$lib/components/icons/Whale.svelte";
import { BarChart, Gauge, LayoutGrid, Settings } from "lucide-svelte";

export const SIDEBARS = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: LayoutGrid,
  },
  {
    name: "Portfolio",
    path: "/portfolio",
    icon: Gauge,
  },
  {
    name: "Setting",
    path: "/setting",
    icon: Settings,
  },
  {
    name: "Metric",
    path: "/metrics",
    icon: BarChart,
  },
  {
    name: "Whales",
    path: "/whales",
    icon: Whale,
  },
];
