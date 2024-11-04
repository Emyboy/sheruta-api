import ReservationService from "../reservations/reservations.service";
import { cancelExpiredPromotions } from "./promotion.cron";
import cron from "node-cron";

/**
 * - set host requests to unavailable
 * - handle inspections
 * - set reservation to expired
 */

export const startCronTasks = () => {
  const reservation = new ReservationService();

  // Run at the 8th hour of every day (08:00)
  cron.schedule("0 8 * * *", () => {
    cancelExpiredPromotions();
    reservation.settReservationsAsExpired();
  });

  // Run at the 10th hour on the last day of every month (10:00 on the 31st or last day)
  cron.schedule("0 10 L * *", () => {
  });
};
