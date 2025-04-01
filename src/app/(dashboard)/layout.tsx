import * as React from 'react';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { PageContainer } from '@toolpad/core/PageContainer';
import SidebarFooter from '../components/SidebarFooter';

export default async function DashboardPagesLayout(props: { children: React.ReactNode }) {
  return (
      <DashboardLayout
      slots={{
        sidebarFooter: SidebarFooter
      }}
      disableCollapsibleSidebar
    >
        <PageContainer  maxWidth={false}>{props.children}</PageContainer>
      </DashboardLayout>
  );
}
