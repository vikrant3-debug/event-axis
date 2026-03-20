import { getAuth } from "@/lib/auth";

interface UseRolesReturn {
  isLoading: boolean;
  role: string;
  isOrganizer: boolean;
  isAttendee: boolean;
  isStaff: boolean;
}

export const useRoles = (): UseRolesReturn => {
  const auth = getAuth();
  const role = auth?.role ?? "";

  return {
    isLoading: false,
    role,
    isOrganizer: role === "ORGANIZER",
    isAttendee: role === "ATTENDEE",
    isStaff: role === "STAFF",
  };
};
