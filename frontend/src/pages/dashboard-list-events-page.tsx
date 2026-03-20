import NavBar from "@/components/nav-bar";
import { SimplePagination } from "@/components/simple-pagination";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { EventSummary, EventStatusEnum, SpringBootPagination } from "@/domain/domain";
import { deleteEvent, listEvents } from "@/lib/api";
import { useAuth } from "@/hooks/use-auth";
import { AlertCircle, Calendar, Clock, Edit, MapPin, Plus, Tag, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router";

const DashboardListEventsPage: React.FC = () => {
  const { token } = useAuth();
  const [events, setEvents] = useState<SpringBootPagination<EventSummary> | undefined>();
  const [error, setError] = useState<string | undefined>();
  const [deleteEventError, setDeleteEventError] = useState<string | undefined>();
  const [page, setPage] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<EventSummary | undefined>();

  useEffect(() => {
    if (!token) return;
    refreshEvents(token);
  }, [token, page]);

  const refreshEvents = async (accessToken: string) => {
    try {
      setEvents(await listEvents(accessToken, page));
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    }
  };

  const formatDate = (date?: Date) => {
    if (!date) return "TBD";
    return new Date(date).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
  };

  const formatTime = (date?: Date) => {
    if (!date) return "";
    return new Date(date).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  };

  const statusStyle = (status: EventStatusEnum) => {
    switch (status) {
      case EventStatusEnum.DRAFT: return "bg-gray-800 text-gray-300 border-gray-700";
      case EventStatusEnum.PUBLISHED: return "bg-emerald-900/40 text-emerald-300 border-emerald-800/50";
      case EventStatusEnum.CANCELLED: return "bg-red-900/40 text-red-300 border-red-800/50";
      case EventStatusEnum.COMPLETED: return "bg-blue-900/40 text-blue-300 border-blue-800/50";
      default: return "bg-gray-800 text-gray-300 border-gray-700";
    }
  };

  const handleDeleteEvent = async () => {
    if (!eventToDelete || !token) return;
    try {
      setDeleteEventError(undefined);
      await deleteEvent(token, eventToDelete.id);
      setEventToDelete(undefined);
      setDialogOpen(false);
      refreshEvents(token);
    } catch (err) {
      setDeleteEventError(err instanceof Error ? err.message : "An unknown error occurred");
    }
  };

  return (
    <div className="bg-[#0a0a0f] min-h-screen text-white" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Syne:wght@700;800&display=swap');`}</style>
      <NavBar />

      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-2xl font-bold" style={{ fontFamily: "'Syne', sans-serif" }}>Your Events</h1>
            <p className="text-gray-500 text-sm mt-1">Manage and track your events</p>
          </div>
          <Link to="/dashboard/events/create">
            <button className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white text-sm px-4 py-2 rounded-xl transition-colors">
              <Plus className="w-4 h-4" /> Create Event
            </button>
          </Link>
        </div>

        {error && (
          <Alert variant="destructive" className="bg-red-950/30 border-red-800/50 mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-3">
          {events?.content.map((eventItem) => (
            <Card key={eventItem.id} className="bg-[#16161f] border-gray-800/60 text-white hover:border-gray-700/60 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-lg leading-tight">{eventItem.name}</h3>
                  <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${statusStyle(eventItem.status)}`}>
                    {eventItem.status}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 pb-3">
                <div className="flex gap-2 items-start">
                  <Calendar className="h-4 w-4 text-gray-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm text-gray-300">{formatDate(eventItem.start)} — {formatDate(eventItem.end)}</p>
                    <p className="text-xs text-gray-500">{formatTime(eventItem.start)} – {formatTime(eventItem.end)}</p>
                  </div>
                </div>
                <div className="flex gap-2 items-start">
                  <Clock className="h-4 w-4 text-gray-500 mt-0.5 shrink-0" />
                  <p className="text-sm text-gray-400">Sales: {formatDate(eventItem.salesStart)} — {formatDate(eventItem.salesEnd)}</p>
                </div>
                <div className="flex gap-2 items-center">
                  <MapPin className="h-4 w-4 text-gray-500 shrink-0" />
                  <p className="text-sm text-gray-300">{eventItem.venue}</p>
                </div>
                <div className="flex gap-2 items-start">
                  <Tag className="h-4 w-4 text-gray-500 mt-0.5 shrink-0" />
                  <div className="flex flex-wrap gap-1.5">
                    {eventItem.ticketTypes.map((tt) => (
                      <span key={tt.id} className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">
                        {tt.name} · ₹{tt.price}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2 pt-3 border-t border-gray-800/50">
                <Link to={`/dashboard/events/update/${eventItem.id}`}>
                  <Button size="sm" className="bg-gray-800 hover:bg-gray-700 text-gray-300 cursor-pointer">
                    <Edit className="w-3.5 h-3.5" />
                  </Button>
                </Link>
                <Button size="sm" className="bg-red-900/40 hover:bg-red-800/60 text-red-300 border border-red-800/50 cursor-pointer"
                  onClick={() => { setEventToDelete(eventItem); setDialogOpen(true); }}>
                  <Trash className="w-3.5 h-3.5" />
                </Button>
              </CardFooter>
            </Card>
          ))}

          {events?.content.length === 0 && (
            <div className="text-center py-16 text-gray-500">
              <p className="text-lg mb-2">No events yet</p>
              <p className="text-sm">Create your first event to get started</p>
            </div>
          )}
        </div>

        {events && (
          <div className="flex justify-center py-8">
            <SimplePagination pagination={events} onPageChange={setPage} />
          </div>
        )}
      </div>

      <AlertDialog open={dialogOpen}>
        <AlertDialogContent className="bg-[#16161f] border-gray-800 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Event?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              This will permanently delete '{eventToDelete?.name}'. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {deleteEventError && (
            <Alert variant="destructive" className="border-red-800/50 bg-red-950/30">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{deleteEventError}</AlertDescription>
            </Alert>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => { setEventToDelete(undefined); setDialogOpen(false); }} className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteEvent} className="bg-red-700 hover:bg-red-600">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DashboardListEventsPage;
