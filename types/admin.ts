export type AdminDashboardDTO = {
  status: "live" | "empty";
  metrics: {
    revenue: number;
    orders: number;
    conversionRate: number;
    whatsappLeads: number;
    users: number;
    products: number;
  };
  chart: number[];
  recentActivity: {
    id: string;
    label: string;
    time: string;
  }[];
};
