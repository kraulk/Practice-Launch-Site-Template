/**
 * TEMPLATE LAYER: fixed interface copy for English. The CMS does not edit these.
 * Required notices (crisis, Good Faith Estimate) live here so they can't be
 * deleted by accident. Wording is reviewed in docs/compliance.md.
 */
export const en = {
  skipToContent: "Skip to main content",
  nav: {
    home: "Home",
    about: "About",
    services: "Services",
    schools: "For schools",
    fees: "Fees",
    faq: "FAQ",
    resources: "Resources",
    contact: "Contact",
  },
  crisis:
    "This website is not monitored for emergencies. If you or your child are in crisis, call or text 988 (Suicide & Crisis Lifeline) or call 911.",
  emailCaution: "Please don't send health information, diagnoses, or school records by email.",
  /**
   * Model notice from CMS (No Surprises Act, 45 CFR 149.610). Keep the wording intact;
   * re-check against https://www.cms.gov/nosurprises when updating the template.
   */
  goodFaithEstimate: {
    heading: "Your right to receive a Good Faith Estimate of expected charges",
    intro:
      "You have the right to receive a \u201cGood Faith Estimate\u201d explaining how much your medical care will cost. Under the law, health care providers need to give patients who don\u2019t have insurance or who are not using insurance an estimate of the bill for medical items and services.",
    points: [
      "You have the right to receive a Good Faith Estimate for the total expected cost of any non-emergency items or services. This includes related costs like medical tests, prescription drugs, equipment, and hospital fees.",
      "Make sure your health care provider gives you a Good Faith Estimate in writing at least 1 business day before your medical service or item. You can also ask your health care provider, and any other provider you choose, for a Good Faith Estimate before you schedule an item or service.",
      "If you receive a bill that is at least $400 more than your Good Faith Estimate, you can dispute the bill.",
      "Make sure to save a copy or picture of your Good Faith Estimate.",
    ],
    moreInfo:
      "For questions or more information about your right to a Good Faith Estimate, visit www.cms.gov/nosurprises or call 1-800-985-3059.",
    moreInfoHref: "https://www.cms.gov/nosurprises",
  },
  licensure: "Licensure",
  telehealthIn: "Telehealth available in",
  readMore: "Read more",
  draftBadge: "Draft",
} as const;

export type UiStrings = typeof en;
