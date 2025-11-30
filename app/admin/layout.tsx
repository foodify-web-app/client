// 'use client';

// import { Sidebar } from '@/components/admin/sidebar';
// import { AdminNavbar } from '@/components/admin/admin-navbar';
// import { RestaurantProvider } from '@/context/restaurant-context';
// import { RestaurantStatusBanner } from '@/components/admin/restaurant-status-banner';
// import { useState } from 'react';
// import { usePathname } from 'next/navigation';

// function AdminLayoutContent({ children }: { children: React.ReactNode }) {
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const pathname = usePathname();
//   const isRestaurantAdmin = pathname.includes('/admin/restaurant') && !pathname.includes('/admin/super');

//   return (
//     <div className="flex h-screen bg-background dark:bg-dark-background">
//       <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
//       <div className="flex flex-col flex-1 overflow-hidden">
//         <AdminNavbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
//         <main className="flex-1 overflow-auto p-6 lg:p-8">
//           {isRestaurantAdmin && <RestaurantStatusBanner />}
//           {children}
//         </main>
//       </div>
//     </div>
//   );
// }

// export default function AdminLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <RestaurantProvider>
//       <AdminLayoutContent>{children}</AdminLayoutContent>
//     </RestaurantProvider>
//   );
// }
'use client';

import { Sidebar } from '@/components/admin/sidebar';
import { AdminNavbar } from '@/components/admin/admin-navbar';
import { RestaurantProvider } from '@/context/restaurant-context';
import { RestaurantStatusBanner } from '@/components/admin/restaurant-status-banner';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();
  const isRestaurantAdmin =
    pathname.includes('/admin/restaurant') &&
    !pathname.includes('/admin/super');

  return (
    <div className="flex h-screen bg-background dark:bg-dark-background">
      <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <AdminNavbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-auto p-6 lg:p-8">
          {isRestaurantAdmin && <RestaurantStatusBanner />}
          {children}
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
        <RestaurantProvider>
          <AdminLayoutContent>{children}</AdminLayoutContent>
        </RestaurantProvider>
  );
}
