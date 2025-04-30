import AdminRiderTable from "./AdminRiderTable";
import { getMensRiders, getWomensRiders } from "../../../datalayer";

export default async function RiderAdminPage() {
  const mensRiderDataPromise = getMensRiders();
  const womensRiderDataPromise = getWomensRiders();

  const [mensRiderData, womensRiderData] = await Promise.all([mensRiderDataPromise, womensRiderDataPromise]);
  return (
      <AdminRiderTable mensRiderData={mensRiderData} womensRiderData={womensRiderData} />
  );
}
