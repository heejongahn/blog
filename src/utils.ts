import { parseISO, format } from "date-fns";
import ko from "date-fns/locale/ko";

export function formatDate(dateString: string) {
  return format(parseISO(dateString), "PPP", { locale: ko });
}
