import { PublishedEventSummary } from "@/domain/domain";
import { Calendar, MapPin, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router";
import { useRoles } from "@/hooks/use-roles";

interface PublishedEventCardProperties {
  publishedEvent: PublishedEventSummary;
}

const EVENT_IMAGES = [
  "/event-1.jpg", "/event-2.jpg", "/event-3.jpg", "/event-4.jpg",
  "/event-5.jpg", "/event-6.jpg", "/event-7.jpg",
];
const getImage = (id: string) => EVENT_IMAGES[id.charCodeAt(0) % EVENT_IMAGES.length];

const PublishedEventCard: React.FC<PublishedEventCardProperties> = ({ publishedEvent }) => {
  const navigate = useNavigate();
  const { isStaff } = useRoles();

  return (
    <div
      onClick={() => !isStaff && navigate(`/events/${publishedEvent.id}`)}
      className={`group bg-[#111118] border border-white/8 rounded-2xl overflow-hidden transition-all duration-300 hover:border-white/20 hover:shadow-xl hover:shadow-black/40 hover:-translate-y-0.5 ${!isStaff ? "cursor-pointer" : "cursor-default"}`}
    >
      {/* Fixed-height image */}
      <div className="h-40 overflow-hidden flex-shrink-0 relative">
        <img
          src={getImage(publishedEvent.id)}
          alt={publishedEvent.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-white font-semibold text-sm leading-snug mb-2 line-clamp-2 group-hover:text-cyan-300 transition-colors" style={{ fontFamily: "'Syne', sans-serif" }}>
          {publishedEvent.name}
        </h3>

        <div className="space-y-1.5 mb-3">
          <div className="flex items-start gap-1.5 text-gray-500 text-xs">
            <MapPin className="w-3 h-3 shrink-0 mt-0.5" />
            <span className="line-clamp-1">{publishedEvent.venue}</span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-500 text-xs">
            <Calendar className="w-3 h-3 shrink-0" />
            {publishedEvent.start ? (
              <span>{format(publishedEvent.start, "MMM d, yyyy")}</span>
            ) : (
              <span>Date TBD</span>
            )}
          </div>
        </div>

        {!isStaff && (
          <div className="flex items-center justify-between pt-3 border-t border-white/5">
            <span className="text-cyan-400 text-xs font-medium">View tickets</span>
            <ArrowRight className="w-3.5 h-3.5 text-cyan-400 group-hover:translate-x-0.5 transition-transform" />
          </div>
        )}

        {isStaff && (
          <div className="pt-3 border-t border-white/5">
            <span className="text-gray-600 text-xs">Staff view only</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PublishedEventCard;
