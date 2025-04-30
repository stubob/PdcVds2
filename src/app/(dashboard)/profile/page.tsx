import { auth } from "../../../auth";
import ProfileForm from "./ProfileForm";
import { fetchUserSession } from "../../datalayer";
import { Typography } from "@mui/material";

export default async function ProfilePage() {
  const authSession = await auth();
  const user = await fetchUserSession(authSession);
  console.log("user", user);

  if (user && user.user.email) {
    return (
    <main>
        <ProfileForm name={user?.name} email={user?.user?.email} />
    </main>
  );
} return (
  <Typography variant="h6">Not logged in</Typography>
)
};
