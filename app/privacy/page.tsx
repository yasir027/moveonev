import type { Metadata } from "next";
import { A, LI, Note, P, Strong, UL } from "@/components/blog/ArticleParts";
import { LegalPage, type LegalSection } from "@/components/legal/LegalPage";
import { SHOWROOM } from "@/lib/showroom";

/*
 * /privacy — what the site collects and why. Keep it true to the code: if a form field,
 * a third-party service or a tracking tag is added or removed, update this page (and
 * UPDATED) in the same change. Written for India's DPDP Act 2023 and the IT Rules 2011.
 * Not legal advice: have the final wording reviewed.
 */

const UPDATED = "24 October 2026";
const EMAIL = "moveonevmoto@gmail.com";

export const metadata: Metadata = {
  title: "Privacy Policy | MOVE ON",
  description:
    "How MOVE ON EV MOTO collects, uses and protects your personal data: our forms, cookies, Google Analytics and Google Ads, and your rights.",
  alternates: { canonical: "/privacy" },
};

const SECTIONS: LegalSection[] = [
  {
    id: "who-we-are",
    title: "Who we are",
    body: (
      <>
        <P>
          This website is run by <Strong>MOVE ON EV MOTO</Strong>, an authorised XIDAA electric scooter
          dealership at {SHOWROOM.addressLines.join(", ")}. In this policy, &ldquo;we&rdquo;,
          &ldquo;us&rdquo; and &ldquo;our&rdquo; mean MOVE ON EV MOTO.
        </P>
        <P>
          We decide how and why your personal data is used, which makes us the &ldquo;data
          fiduciary&rdquo; under India&rsquo;s Digital Personal Data Protection Act, 2023. You can
          reach us about anything in this policy at <A href={`mailto:${EMAIL}`}>{EMAIL}</A> or{" "}
          <A href={`tel:${SHOWROOM.phone.tel}`}>{SHOWROOM.phone.display}</A>.
        </P>
      </>
    ),
  },
  {
    id: "what-we-collect",
    title: "What we collect",
    body: (
      <>
        <P>
          <Strong>What you give us.</Strong> When you fill in a form on this site, we receive what you
          type:
        </P>
        <UL>
          <LI>
            <Strong>Book a test ride</Strong> (home page and Models page): your name, phone number,
            email address, the model you are interested in, and any questions you add.
          </LI>
          <LI>
            <Strong>Contact form</Strong> (Contact page): your name, phone number, email address if you
            give it, what your enquiry is about, and your message.
          </LI>
          <LI>
            Whether you ticked the box to receive offers and updates.
          </LI>
        </UL>
        <P>
          If you call us, message us on WhatsApp or visit the showroom, we also have what you share
          there, such as your number and your messages.
        </P>
        <P>
          <Strong>What is collected automatically.</Strong> Like most websites, our hosting provider
          records basic technical information when pages load: your IP address, browser and device
          type, the page requested and the time. We use Google Analytics and Google Ads to understand
          how people find and use the site. They use cookies and similar identifiers to record things
          like the pages you view, how long you stay, your device and browser, your approximate
          location (city level, from your IP address), and whether you arrived from one of our ads
          and then contacted us.
        </P>
        <P>
          <Strong>What is stored in your browser.</Strong> The site keeps one small flag in your
          browser for the length of your visit so the opening animation plays only once. It contains
          no personal information.
        </P>
        <P>
          We do not ask for, and ask you not to send us, sensitive information such as ID numbers,
          bank or card details, or health information through these forms.
        </P>
      </>
    ),
  },
  {
    id: "how-we-use-it",
    title: "How we use it",
    body: (
      <>
        <UL>
          <LI>
            <Strong>To reply to you</Strong>: to call, WhatsApp or email you about your enquiry,
            arrange a test ride, and answer your questions.
          </LI>
          <LI>
            <Strong>To send offers and updates</Strong>, such as new models and showroom offers on
            WhatsApp, SMS or email, <Strong>only if you ticked the box</Strong> on the form or
            otherwise told us you want them. You can stop them at any time.
          </LI>
          <LI>
            <Strong>To measure and improve the site and our advertising</Strong>: to see which pages
            and ads work, count enquiries that came from an ad, and show our ads to people who have
            visited the site before (remarketing).
          </LI>
          <LI>
            <Strong>To keep records we need</Strong> for sales, warranty, accounting and legal
            purposes if you buy from us.
          </LI>
        </UL>
        <P>
          We do not sell your personal data, and we do not upload your form details to Google Ads or
          any other advertising platform.
        </P>
      </>
    ),
  },
  {
    id: "legal-basis",
    title: "Why we are allowed to use it",
    body: (
      <>
        <P>Under the Digital Personal Data Protection Act, 2023, we rely on:</P>
        <UL>
          <LI>
            <Strong>Your consent</Strong> for offers and updates, and for analytics and advertising
            cookies. You can withdraw consent at any time, and it will not affect anything done
            before you withdrew it.
          </LI>
          <LI>
            <Strong>A legitimate use</Strong> when you send us an enquiry yourself: we use those
            details to answer it and arrange what you asked for.
          </LI>
          <LI>
            <Strong>Legal obligations</Strong>, for example keeping sales and tax records.
          </LI>
        </UL>
      </>
    ),
  },
  {
    id: "sharing",
    title: "Who we share it with",
    body: (
      <>
        <P>
          We only share personal data with the services that help us run this website and our
          business, and only for that purpose:
        </P>
        <UL>
          <LI>
            <Strong>Web3Forms</Strong>, which delivers our website forms to our email inbox.
          </LI>
          <LI>
            <Strong>Google</Strong>: Gmail (where form messages arrive), Google Analytics and Google
            Ads (site and ad measurement), and Google Maps (the map on our Contact page).
          </LI>
          <LI>
            <Strong>Meta / WhatsApp</Strong>, when you choose to message us on WhatsApp.
          </LI>
          <LI>
            <Strong>Our website hosting provider</Strong>, which serves the site and keeps short
            technical logs.
          </LI>
          <LI>
            <Strong>XIDAA</Strong>, the manufacturer, only if you buy a scooter and your details are
            needed to register the warranty or arrange service.
          </LI>
          <LI>
            <Strong>Government or law enforcement authorities</Strong>, only when the law requires us
            to.
          </LI>
        </UL>
        <P>
          Some of these providers store data on servers outside India. Where that happens, it is done
          as Indian law allows, and the provider protects it under its own privacy terms.
        </P>
      </>
    ),
  },
  {
    id: "cookies",
    title: "Cookies and tracking",
    body: (
      <>
        <P>
          Cookies are small files a website saves in your browser. We use them for measurement and
          advertising, not to run the site itself.
        </P>
        <UL>
          <LI>
            <Strong>Google Analytics</Strong> (cookies such as <code>_ga</code> and{" "}
            <code>_ga_*</code>): counts visits and shows how the site is used, in aggregate.
          </LI>
          <LI>
            <Strong>Google Ads</Strong> (cookies such as <code>_gcl_au</code>): tells us when someone
            who clicked one of our ads goes on to contact us, and lets us show our ads to past
            visitors on other websites.
          </LI>
          <LI>
            <Strong>Google Maps</Strong>: the embedded map on our Contact page may set its own
            cookies when it loads.
          </LI>
        </UL>
        <P>You can control these at any time:</P>
        <UL>
          <LI>Block or delete cookies in your browser&rsquo;s settings.</LI>
          <LI>
            Turn off personalised ads in{" "}
            <A href="https://myadcenter.google.com/">Google&rsquo;s My Ad Center</A>.
          </LI>
          <LI>
            Install the{" "}
            <A href="https://tools.google.com/dlpage/gaoptout">Google Analytics opt-out add-on</A>.
          </LI>
        </UL>
        <P>
          Blocking these cookies does not stop the site from working. To learn how Google uses this
          data, see{" "}
          <A href="https://policies.google.com/technologies/partner-sites">
            How Google uses information from sites that use its services
          </A>
          .
        </P>
      </>
    ),
  },
  {
    id: "retention",
    title: "How long we keep it",
    body: (
      <UL>
        <LI>
          <Strong>Enquiries</Strong> (form messages, calls, WhatsApp chats): up to 12 months after our
          last contact with you, unless you become a customer.
        </LI>
        <LI>
          <Strong>Customers</Strong>: for as long as needed for warranty, service, and the sales and
          tax records the law requires us to keep.
        </LI>
        <LI>
          <Strong>Offers and updates</Strong>: until you ask us to stop.
        </LI>
        <LI>
          <Strong>Analytics data</Strong>: kept by Google for the retention period set in our Google
          Analytics account, after which it is deleted.
        </LI>
      </UL>
    ),
  },
  {
    id: "your-rights",
    title: "Your rights",
    body: (
      <>
        <P>Under Indian data protection law you can ask us to:</P>
        <UL>
          <LI>tell you what personal data we hold about you and how we use it;</LI>
          <LI>correct, complete or update it;</LI>
          <LI>delete it, where we no longer need it for the purpose you gave it for or by law;</LI>
          <LI>stop using it for offers and updates, or withdraw any other consent you gave;</LI>
          <LI>nominate someone to exercise these rights for you if you are unable to.</LI>
        </UL>
        <P>
          To ask, email <A href={`mailto:${EMAIL}`}>{EMAIL}</A> or call{" "}
          <A href={`tel:${SHOWROOM.phone.tel}`}>{SHOWROOM.phone.display}</A>. To stop offers, you can
          also simply reply &ldquo;STOP&rdquo; to any message from us. We may need to confirm it is you
          before acting, and we will respond within 30 days.
        </P>
        <P>
          If you are not satisfied with our answer, you can complain to the Data Protection Board of
          India.
        </P>
      </>
    ),
  },
  {
    id: "children",
    title: "Children",
    body: (
      <P>
        This website is meant for adults. If you are under 18, please ask a parent or guardian to
        contact us for you. We do not knowingly collect personal data from children, and if we learn
        we have, we will delete it.
      </P>
    ),
  },
  {
    id: "security",
    title: "Keeping it safe",
    body: (
      <P>
        The site is served over a secure (HTTPS) connection, and form messages are sent to a
        password-protected inbox that only our team can access. We take reasonable steps to protect
        your data, but no website or email system is completely secure. If a breach affects your
        personal data, we will tell you and the authorities as the law requires.
      </P>
    ),
  },
  {
    id: "grievance",
    title: "Questions and complaints",
    body: (
      <>
        <P>For any question, request or complaint about your personal data, contact us:</P>
        <Note>
          <Strong>MOVE ON EV MOTO</Strong>
          <br />
          {SHOWROOM.addressLines.join(", ")}
          <br />
          Email: <A href={`mailto:${EMAIL}`}>{EMAIL}</A>
          <br />
          Phone: <A href={`tel:${SHOWROOM.phone.tel}`}>{SHOWROOM.phone.display}</A> ({SHOWROOM.hours.label})
        </Note>
      </>
    ),
  },
  {
    id: "changes",
    title: "Changes to this policy",
    body: (
      <P>
        We may update this policy when our website or the law changes. The date at the top shows when
        it was last updated. If we make a significant change to how we use your data, we will say so
        on this page.
      </P>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Privacy"
      title="Privacy Policy"
      intro="What we collect when you use this website or contact us, why we collect it, who we share it with, and the choices you have."
      updated={UPDATED}
      sections={SECTIONS}
    />
  );
}
