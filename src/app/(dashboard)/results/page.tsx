import * as React from "react";
import CalendarTable from "../../components/CalendarTable";
import { getCalendarData } from "../../datalayer";

export default async function CalendarPage() {
  const calendarData = await getCalendarData();

  return (
    <main>
        <CalendarTable calendarData={calendarData}/>
    </main>
  );
}
