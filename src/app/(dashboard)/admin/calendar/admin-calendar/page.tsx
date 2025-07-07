import { Stack } from "@mui/material";
import AdminCalendarTable from "./AdminCalendarTable";
import { getCalendarData } from "../../../../datalayer";

export default async function CalendarAdminPage() {
  const calendarData = await getCalendarData();
  console.log("calendar: ", calendarData);

  return (
    <Stack direction="column" spacing={2}>
      <AdminCalendarTable calendarData={calendarData}
       />
    </Stack>
  );
}
