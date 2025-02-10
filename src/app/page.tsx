import { EventForm } from "@/components/event-form";
import { EventList } from "@/components/event-list";

export default function Home() {
  return (
    <main className="min-h-screen bg-background p-4 md:p-8">
      <div className="container max-w-7xl mx-auto space-y-8">
        <header className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Event Scheduler
          </h1>
          <p className="text-muted-foreground">
            Schedule and manage your events with ease
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="sticky top-8">
              <div className="rounded-lg border bg-card text-card-foreground shadow">
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-6">
                    Schedule New Event
                  </h2>
                  <EventForm />
                </div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-3 space-y-4">
            <h2 className="text-xl font-semibold">Scheduled Events</h2>
            <EventList />
          </div>
        </div>
      </div>
    </main>
  );
}
