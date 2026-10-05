import Link from "next/link";
import { ArrowRight, Users, Clock, MessageCircle, ChartColumn, CalendarDays, Timer, Video } from "lucide-react";
import { PublicNav } from "@/components/public/public-nav";
import { AppFooter } from "@/components/layout/app-footer";

const benefits = [
  {
    icon: Users,
    title: "Certified teachers",
    description: "Native and near-native teachers matched to your level and personal goals.",
  },
  {
    icon: Clock,
    title: "Flexible schedule",
    description: "Pick slots that fit your week — reschedule up to 12h before class.",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp reminders",
    description: "Never miss a lesson. Automatic reminders before every single session.",
  },
  {
    icon: ChartColumn,
    title: "Visible progress",
    description: "Attendance, personalized notes and level tracking after every lesson.",
  },
];

const steps = [
  {
    number: "01",
    icon: CalendarDays,
    title: "Pick a date",
    description: "Choose any day that works for you — we only display verified real-time availability.",
  },
  {
    number: "02",
    icon: Timer,
    title: "Choose a time",
    description: "Availability automatically accounts for tutor schedules, breaks, and existing lessons.",
  },
  {
    number: "03",
    icon: Video,
    title: "Meet your teacher",
    description: "Get an instant confirmation with your lesson classroom link and WhatsApp reminder.",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-on-background antialiased">
      <PublicNav />

      <main className="flex-grow">
        <section className="bg-[#f7e7ee] py-section-v px-gutter md:px-lg overflow-hidden relative">
          <div className="max-w-container-max mx-auto grid grid-cols-1 lg:grid-cols-2 gap-xxl items-center">
            <div className="z-10 relative">
              <h1 className="font-headline text-[40px] md:text-headline-lg text-primary mb-md tracking-tight leading-tight">
                Your English journey starts here
              </h1>
              <p className="font-body text-lg md:text-subheading text-primary/90 mb-xl max-w-copy font-normal leading-relaxed">
                Book a free trial lesson with our expert native teachers.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-md mb-md">
                <Link
                  href="#trial"
                  className="bg-primary text-on-primary px-6 py-3.5 rounded-DEFAULT font-ui-label text-ui-label hover:bg-inverse-surface transition-all flex items-center justify-center gap-sm shadow-sm group"
                >
                  Book Free Trial Lesson
                  <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="#tutors"
                  className="border-2 border-primary text-primary px-6 py-3 rounded-DEFAULT font-ui-label text-ui-label hover:bg-primary/10 transition-colors text-center font-semibold"
                >
                  Meet Teachers
                </Link>
              </div>

              <div className="flex items-center gap-2 text-primary text-caption font-medium">
                <span className="text-emerald-800 font-bold">✓</span>
                <span>Free and no commitment • 25 min with native tutor</span>
              </div>
            </div>

            <div className="relative h-[420px] md:h-[500px] flex justify-center items-center">
              <div className="absolute w-64 h-80 rounded-xl overflow-hidden border border-smoke/80 transform -rotate-2 z-10 shadow-lg bg-surface">
                <img
                  className="w-full h-full object-cover"
                  alt="Teacher portrait"
                  src="https://lh3.googleusercontent.com/aida/AEtjO1W0yFT3Jdydi6rHDACyaCbGkrf7QZMMaImT6XcmVL9qz6UjByE4y2LTQ6TYAL52KyEpxhf1Mf57fnkZEzysudBYzzTeZ4gnyFyRE-9wsxWCwinHBBt4MSkqonvi4djy2DiHnY6vFZqA09AKnSqkOCW2-OVeC2YDvvgkLstvKDfwWOX1aUlxpjOjKG_FGDLQVtstIpWsYGzOiELLfFSd--f5pb77WMMKp5i7wydl1mOtoAo8PGb8Yi3wdYg"
                />
                <div className="absolute bottom-4 left-4 bg-primary text-on-primary px-3 py-1 font-ui-label text-ui-label rounded-DEFAULT transform rotate-1 border border-smoke shadow-sm">
                  Teacher Sarah
                </div>
              </div>

              <div className="absolute w-60 h-76 rounded-xl overflow-hidden border border-smoke/80 transform translate-x-20 md:translate-x-24 translate-y-10 md:translate-y-12 rotate-3 z-20 shadow-xl bg-surface">
                <img
                  className="w-full h-full object-cover"
                  alt="Student learning"
                  src="https://lh3.googleusercontent.com/aida/AEtjO1VYpEwMMCs5BHKNjZDT1RWkR8fVr5jED6P-BqfCxFrBXtT4ppAixGvWEe050XenHkdVHXQMLuSlaFRtKE-OdIgZdJ_Zpy1xsdr2sBCaBJfr8k1k8oojXmdgP49xQ6fzXgF8vkOJxZMw0nEJpJAj79TNVX9K-LIsMOMUTt7YL37_yDgfgLmXaNL3sI9mJIJG5sD0Rs5mCNM6pyl8Id4eCls32ztR0eO5a6fU6T61D_gxH7B8w_3TBcRvZ2o"
                />
                <div className="absolute top-4 right-4 bg-signal-yellow text-primary font-bold px-3 py-1 font-ui-label text-ui-label rounded-DEFAULT transform -rotate-2 border border-primary/20 shadow-sm">
                  Interactive!
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 px-gutter md:px-lg bg-mist-gray border-b border-smoke" id="tutors">
          <div className="max-w-container-max mx-auto">
            <div className="text-center max-w-intro mx-auto mb-14">
              <h2 className="font-headline text-3xl md:text-[36px] font-bold text-primary tracking-tight mb-3">
                Why students stay
              </h2>
              <p className="font-body text-base text-graphite">
                Every element engineered to build real spoken confidence faster.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((item) => (
                <div
                  key={item.title}
                  className="bg-surface border border-smoke rounded-xl p-7 flex flex-col justify-start hover:border-pewter/60 transition-all shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
                >
                  <div className="w-11 h-11 rounded-lg bg-mist-gray border border-smoke flex items-center justify-center text-primary mb-6">
                    <item.icon className="size-[22px] shrink-0" aria-hidden="true" />
                  </div>
                  <h3 className="font-headline text-lg font-bold text-primary mb-2.5">{item.title}</h3>
                  <p className="font-body text-sm text-graphite leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 px-gutter md:px-lg bg-surface" id="how-it-works">
          <div className="max-w-container-max mx-auto">
            <div className="text-center max-w-intro mx-auto mb-14">
              <h2 className="font-headline text-3xl md:text-[36px] font-bold text-primary tracking-tight mb-3">
                How it works
              </h2>
              <p className="font-body text-base text-graphite">
                Start speaking English confidently in three simple steps.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {steps.map((step) => (
                <div
                  key={step.number}
                  className="bg-mist-gray/60 border border-smoke rounded-xl p-8 relative overflow-hidden hover:border-pewter/60 transition-all group"
                >
                  <div className="flex items-center justify-between mb-6">
                    <span className="inline-flex items-center justify-center px-3 py-1 rounded-DEFAULT bg-primary text-on-primary font-mono text-xs font-bold tracking-wider">
                      {step.number}
                    </span>
                    <step.icon className="size-6 shrink-0 text-pewter group-hover:text-primary transition-colors" aria-hidden="true" />
                  </div>
                  <h3 className="font-headline text-xl font-bold text-primary mb-3">{step.title}</h3>
                  <p className="font-body text-sm text-graphite leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 px-gutter md:px-lg bg-surface border-t border-smoke text-center" id="trial">
          <div className="max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-mist-gray text-graphite font-ui-label text-caption mb-4 border border-smoke/80">
              <span className="w-2 h-2 rounded-full bg-[#f7e7ee]" />
              Open slots available this week
            </div>
            <h2 className="font-headline text-headline md:text-[38px] font-bold text-primary mb-4 tracking-tight">
              Ready to speak English fluently?
            </h2>
            <p className="font-body text-subheading text-graphite mb-8 max-w-copy mx-auto font-normal">
              Book your free trial lesson now and get a full diagnosis of your conversational level.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-md">
              <Link
                href="/book"
                className="w-full sm:w-auto bg-primary text-on-primary px-8 py-4 rounded-DEFAULT font-ui-label text-body font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-sm shadow-md"
              >
                Book Free Trial Now
                <ArrowRight className="size-5" />
              </Link>
            </div>
            <p className="font-caption text-caption text-graphite mt-4">
              No credit card required. Takes less than 1 minute.
            </p>
          </div>
        </section>
      </main>

      <AppFooter />
    </div>
  );
}
