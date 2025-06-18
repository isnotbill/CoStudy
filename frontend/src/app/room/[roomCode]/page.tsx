import { notFound } from "next/navigation";
import ClientRoom from "./ClientRoom";
import apiClient from "../../../../lib/apiClient";
import { cookies } from "next/headers";

async function buildSpringCookieHeader() {
  const jar = await cookies();   

  const access  = jar.get('access_token')?.value;
  const refresh = jar.get('refresh_token')?.value;

  if (!access && !refresh) return undefined;

  const parts: string[] = [];
  if (access)  parts.push(`access_token=${access}`);
  if (refresh) parts.push(`refresh_token=${refresh}`);

  return parts.join('; ');
}

export default async function RoomPage({
  params,                 
}: {
  params: Promise<{ roomCode: string }>;
}) {

  const { roomCode } = await params;
  const cookieHeader = await buildSpringCookieHeader();
  try {
    const { data } = await apiClient.get(
      `http://localhost:8080/room/${roomCode}`, 
      {headers: cookieHeader ? {Cookie: cookieHeader} : undefined});

    return <ClientRoom roomId={data.data.roomId} roomCode={roomCode} />;
  } catch {
    notFound();                      
  }
}