/**
 * Resolves `settings.booking` into a link. Every "request an appointment"
 * button goes through here (via BookingCta.astro), so the rules live in one place:
 *
 * - `portal` → the EHR portal URL (same tab, `rel="noopener"`).
 * - `email`  → `mailto:`, always shown with the email caution.
 * - `phone`  → `tel:`, always shown with the voicemail caution.
 * - `compact` (the header): email/phone modes link to the Contact page instead,
 *   where the caution has room to sit beside the link.
 *
 * A missing portal URL, email, or phone falls back to the Contact page instead of
 * failing the build, so a half-finished CMS edit never takes the site down.
 * `launch-check` is what blocks launch on a missing value.
 */
import { t } from "@/i18n";
import type { Settings } from "@/lib/content";
import { href } from "@/lib/routes";

export interface BookingLink {
  href: string;
  label: string;
  /** External links get `rel="noopener"`. */
  external: boolean;
  /** Caution or note to show next to the link, if any. */
  note?: string;
}

/** `tel:` URL from a display number like "(555) 555-0100". */
export const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, "")}`;

export function bookingLink(settings: Settings, locale: string, compact = false): BookingLink {
  const { booking, contact } = settings;
  const ui = t(locale);
  const contactPage: BookingLink = { href: href("contact/", locale), label: booking.label, external: false };

  switch (booking.mode) {
    case "portal":
      if (!booking.url) {
        console.warn("[booking] mode is portal but booking.url is empty. Linking to the Contact page.");
        return contactPage;
      }
      return {
        href: booking.url,
        label: booking.label,
        external: true,
        note: booking.ehrName ? ui.portalNote(booking.ehrName) : undefined,
      };
    case "email":
      if (compact || !contact.email) return contactPage;
      return {
        href: `mailto:${contact.email}`,
        label: booking.label,
        external: false,
        note: ui.emailCaution,
      };
    case "phone":
      if (compact || !contact.phone) return contactPage;
      return { href: telHref(contact.phone), label: booking.label, external: false, note: ui.phoneCaution };
  }
}
