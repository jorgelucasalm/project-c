import { headingClass, sectionClass } from "./styles";

const faqs = [
  { question: "Can I choose my own schedule?", answer: "Yes. Set your weekly availability and organize your lessons around the hours that work for you." },
  { question: "Can I connect Google Calendar?", answer: "Google Calendar integration is available when configured by your school. You can connect your account from the availability area." },
  { question: "How can students book a trial lesson?", answer: "Share your public page with students so they can explore the school and access the trial lesson booking flow." },
];

export function FaqSection() {
  return (
    <section id="faq" className="scroll-mt-24 py-section-v">
      <div className={`${sectionClass} max-w-3xl`}>
        <h2 className={`${headingClass} mb-xl text-center`}>Frequently asked questions</h2>
        <div className="space-y-sm">
          {faqs.map((faq) => (
            <details key={faq.question} className="rounded-xl bg-surface-container-lowest p-lg shadow-sm">
              <summary className="cursor-pointer font-subheading text-subheading">{faq.question}</summary>
              <p className="mt-sm text-body text-on-surface-variant">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
