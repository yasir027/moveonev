import type { Metadata } from "next";
import { A, LI, Note, P, Strong, UL } from "@/components/blog/ArticleParts";
import { LegalPage, type LegalSection } from "@/components/legal/LegalPage";
import { SHOWROOM } from "@/lib/showroom";

/*
 * /terms — the rules for using the site, and what prices, specs, bookings and warranty
 * claims on it do and don't mean. Keep the warranty and pricing lines in step with what
 * the model pages say. Not legal advice: have the final wording reviewed.
 */

const UPDATED = "24 October 2026";
const EMAIL = "moveonevmoto@gmail.com";

export const metadata: Metadata = {
  title: "Terms of Use | MOVE ON",
  description:
    "The terms for using the MOVE ON EV MOTO website: prices, specifications, test-ride bookings, warranty and your responsibilities.",
  alternates: { canonical: "/terms" },
};

const SECTIONS: LegalSection[] = [
  {
    id: "about",
    title: "About these terms",
    body: (
      <P>
        This website is run by <Strong>MOVE ON EV MOTO</Strong>, an authorised XIDAA electric scooter
        dealership at {SHOWROOM.addressLines.join(", ")}. By using the site you agree to these terms.
        If you do not agree, please do not use it. Our <A href="/privacy">Privacy Policy</A> explains
        how we handle your personal data.
      </P>
    ),
  },
  {
    id: "using-the-site",
    title: "Using the site",
    body: (
      <>
        <P>
          The site is here to tell you about our scooters and let you contact us. You agree not to
          misuse it, for example by sending spam or false enquiries, trying to break or overload it,
          or copying its content for commercial use without our permission.
        </P>
        <P>
          We may change, pause or remove any part of the site at any time without notice.
        </P>
      </>
    ),
  },
  {
    id: "products",
    title: "Products, specifications and images",
    body: (
      <UL>
        <LI>
          Specifications such as range, speed, battery, motor and charging times come from the
          manufacturer, XIDAA, and may change without notice. Please confirm the details of the exact
          model you want at the showroom before you buy.
        </LI>
        <LI>
          <Strong>Range is an estimate.</Strong> Real-world range depends on rider weight, load,
          speed, road and weather conditions, and the age and care of the battery.
        </LI>
        <LI>
          Photos and illustrations are for guidance. Colours on screen may differ from the real
          paint, and some images show accessories or features that are not included or not
          available on every model.
        </LI>
        <LI>Availability of models, colours and battery options depends on stock.</LI>
      </UL>
    ),
  },
  {
    id: "prices",
    title: "Prices and offers",
    body: (
      <UL>
        <LI>
          Prices shown are <Strong>showroom prices including GST</Strong>. Insurance, accessories and
          any optional extras are charged separately.
        </LI>
        <LI>
          Offers and discounts are for a limited time, may change or end without notice, and depend on
          stock.
        </LI>
        <LI>
          The final price is the one confirmed on your invoice at the showroom. If a price on the site
          is wrong, we will tell you the correct price before you buy, and we are not bound by the
          incorrect one.
        </LI>
      </UL>
    ),
  },
  {
    id: "bookings",
    title: "Test rides and enquiries",
    body: (
      <UL>
        <LI>
          Sending a form on this site is a <Strong>request</Strong>, not a booking, order or contract
          of sale. We will contact you by phone, WhatsApp or email to confirm a time or answer your
          question.
        </LI>
        <LI>
          Test rides take place at or near our showroom, depend on availability and the weather, and
          are at our discretion. We may ask you to show an ID and to follow our safety instructions,
          including wearing a helmet. You are responsible for riding carefully during a test ride.
        </LI>
        <LI>
          A purchase is only agreed when you sign and pay at the showroom. The terms on your invoice
          and warranty card then apply.
        </LI>
      </UL>
    ),
  },
  {
    id: "riding-rules",
    title: "Licences, registration and road rules",
    body: (
      <>
        <P>
          Where we say a model needs no driving licence or RTO registration, this refers to its status
          as a low-speed electric vehicle as certified by the manufacturer under the rules in force in
          India today. These rules can change, and it is your responsibility to check the current
          rules and follow all traffic laws.
        </P>
        <P>
          Please always wear a helmet, follow local road rules, and do not carry more weight or
          passengers than the scooter is rated for.
        </P>
      </>
    ),
  },
  {
    id: "warranty",
    title: "Warranty and service",
    body: (
      <>
        <P>
          Warranty on new scooters is provided by the manufacturer, XIDAA, under the warranty card you
          receive at purchase. As a guide, it currently covers:
        </P>
        <UL>
          <LI>Motor: 2 years</LI>
          <LI>Controller: 2 years</LI>
          <LI>Battery: 2 + 1 years or 40,000 km</LI>
          <LI>Charger: 1 year</LI>
        </UL>
        <Note tone="warn">
          The battery warranty does not cover damage from deep discharge (leaving the battery fully
          drained for a long time). The warranty card at purchase sets out the full terms and takes
          priority over this summary.
        </Note>
      </>
    ),
  },
  {
    id: "third-parties",
    title: "Links to other services",
    body: (
      <P>
        The site links to services we do not control, such as WhatsApp, Google Maps and the XIDAA
        battery app. Their own terms and privacy policies apply when you use them, and we are not
        responsible for their content or availability.
      </P>
    ),
  },
  {
    id: "ip",
    title: "Our content",
    body: (
      <P>
        The text, design, photos and graphics on this site belong to MOVE ON EV MOTO or are used with
        permission. XIDAA and its product names and logos are trademarks of their owner. You may share
        links to our pages, but please do not copy or reuse our content without asking us first.
      </P>
    ),
  },
  {
    id: "liability",
    title: "Our responsibility",
    body: (
      <>
        <P>
          We work to keep the site accurate and available, but it is provided &ldquo;as is&rdquo;. We
          do not promise it will always be error-free or online, and information on it is general
          guidance, not professional advice.
        </P>
        <P>
          To the extent the law allows, we are not liable for any indirect loss arising from your use
          of the site. Nothing in these terms limits your rights as a consumer under Indian law, or our
          responsibility for the products we sell.
        </P>
      </>
    ),
  },
  {
    id: "law",
    title: "Governing law",
    body: (
      <P>
        These terms are governed by the laws of India. Any dispute will be handled by the courts in
        Hyderabad, Telangana.
      </P>
    ),
  },
  {
    id: "changes-contact",
    title: "Changes and contact",
    body: (
      <>
        <P>
          We may update these terms from time to time. The date at the top shows when they were last
          changed, and the version on this page is the one that applies.
        </P>
        <P>
          Questions about these terms? Email <A href={`mailto:${EMAIL}`}>{EMAIL}</A> or call{" "}
          <A href={`tel:${SHOWROOM.phone.tel}`}>{SHOWROOM.phone.display}</A>.
        </P>
      </>
    ),
  },
];

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Terms"
      title="Terms of Use"
      intro="The rules for using this website, and what our prices, specifications, test-ride bookings and warranty information do and don't mean."
      updated={UPDATED}
      sections={SECTIONS}
    />
  );
}
