import Link from "next/link";

const refractorTime = (date : Date) => {
    return (
        '' + new Date(date).getDate() 
        + '/' 
        + ( new Date(date).getMonth() + 1) 
        + ' - ' 
        + new Date(date).toISOString().substring(11, 16)
    )


}

export default function EventSessionList({
  sessions,
}: {
  sessions: any[]; //FIX: someone needs to fix this fr
}) {
  return (
    <>
      {sessions.map((session) => (
        <Link key={session.id} href={`/sessions/${session.id}`}>
          <div className="p-3 border w-1/2 m-auto">
            <div className="flex gap-4">
              <p className="text-blue-400">{refractorTime(session.start_date)}</p>

              <div>
                <p>{session.title}</p>
                <p>{session.room_name}</p>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </>
  );
}