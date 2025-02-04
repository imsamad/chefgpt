import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function AuthLAyout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const res = await getServerSession(authOptions);
  if (res) redirect("/");
  return children;
}
