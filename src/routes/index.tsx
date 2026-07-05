import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { toast, Toaster } from "sonner";

// Unsplash placeholder imagery (fitness themed)
const HERO_BG = "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1920&q=80";
const ABOUT_IMG = "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=80";

export const Route = createFileRoute("/")({
  component: PowerFitGym,
  head: () => ({
    meta: [
      { property: "og:image", content: HERO_BG },
      { name: "twitter:image", content: HERO_BG },
    ],
    links: [
      { rel: "preload", as: "image", href: HERO_BG, fetchpriority: "high" },
    ],
  }),
});

/* --------------------------------- Data --------------------------------- */

type ProgramCat = "All" | "Strength" | "Cardio" | "Mind" | "Group";

interface Program {
  name: string;
  icon: string;
  cat: Exclude<ProgramCat, "All">;
  desc: string;
  duration: string;
  level: "Beginner" | "Intermediate" | "Advanced" | "All levels";
  img: string;
}

const PROGRAMS: Program[] = [
  { name: "Strength Training", icon: "fa-dumbbell", cat: "Strength", desc: "Build raw power with barbell fundamentals and progressive overload.", duration: "60 min", level: "Intermediate", img: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80" },
  { name: "Weight Loss", icon: "fa-fire-flame-curved", cat: "Cardio", desc: "High-intensity fat-burn circuits designed for lasting results.", duration: "45 min", level: "All levels", img: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80" },
  { name: "Cardio Fitness", icon: "fa-heart-pulse", cat: "Cardio", desc: "Boost endurance with treadmill, cycling and rowing intervals.", duration: "45 min", level: "Beginner", img: "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?auto=format&fit=crop&w=800&q=80" },
  { name: "Yoga", icon: "fa-spa", cat: "Mind", desc: "Improve flexibility, breath and mental clarity through vinyasa flow.", duration: "60 min", level: "All levels", img: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80" },
  { name: "CrossFit", icon: "fa-bolt", cat: "Strength", desc: "Constantly varied functional movements performed at high intensity.", duration: "60 min", level: "Advanced", img: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&w=800&q=80" },
  { name: "Functional Training", icon: "fa-person-running", cat: "Strength", desc: "Real-world strength for daily performance and injury prevention.", duration: "50 min", level: "Intermediate", img: "https://images.unsplash.com/photo-1550345332-09e3ac987658?auto=format&fit=crop&w=800&q=80" },
  { name: "Personal Training", icon: "fa-user-shield", cat: "Strength", desc: "1-on-1 coaching with a custom plan tailored to your goals.", duration: "60 min", level: "All levels", img: "https://images.unsplash.com/photo-1594737625785-a6cbdabd333c?auto=format&fit=crop&w=800&q=80" },
  { name: "Zumba", icon: "fa-music", cat: "Group", desc: "Dance-based cardio with Latin beats — burn calories while having fun.", duration: "45 min", level: "Beginner", img: "https://images.unsplash.com/photo-1524594152303-9fd13543fe6e?auto=format&fit=crop&w=800&q=80" },
];

const PROGRAM_CATS: ProgramCat[] = ["All", "Strength", "Cardio", "Mind", "Group"];

interface Trainer {
  name: string;
  role: string;
  years: number;
  certs: string;
  img: string;
}
const TRAINERS: Trainer[] = [
  { name: "Marcus Reed", role: "Head Strength Coach", years: 12, certs: "NSCA-CSCS · USAW", img: "https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&w=600&q=80" },
  { name: "Sofia Alvarez", role: "CrossFit & HIIT", years: 8, certs: "CF-L3 · Precision Nutrition", img: "https://images.unsplash.com/photo-1548690312-e3b507d8c110?auto=format&fit=crop&w=600&q=80" },
  { name: "Ethan Cole", role: "Personal Trainer", years: 10, certs: "NASM-CPT · FMS", img: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=600&q=80" },
  { name: "Priya Sharma", role: "Yoga & Mobility", years: 9, certs: "RYT-500 · YogaFit", img: "https://images.unsplash.com/photo-1609899537878-88d5ba429bdf?auto=format&fit=crop&w=600&q=80" },
];

interface Plan {
  name: string;
  price: number;
  features: string[];
  featured?: boolean;
}
const PLANS: Plan[] = [
  { name: "Basic", price: 29, features: ["Gym floor access", "Locker room", "Free WiFi", "Standard hours (6a–10p)"] },
  { name: "Standard", price: 59, features: ["Everything in Basic", "All group classes", "1 personal training session/mo", "24/7 access"], featured: true },
  { name: "Premium", price: 99, features: ["Everything in Standard", "Unlimited PT sessions", "Nutrition coaching", "Sauna & recovery zone", "Guest passes"] },
];

interface Slot { time: string; workout: string; trainer: string; room: string; }
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const SCHEDULE: Record<string, Slot[]> = {
  Mon: [{ time: "6:00", workout: "Strength", trainer: "Marcus", room: "Hall A" }, { time: "9:00", workout: "Yoga", trainer: "Priya", room: "Studio" }, { time: "18:00", workout: "CrossFit", trainer: "Sofia", room: "Box" }],
  Tue: [{ time: "7:00", workout: "HIIT", trainer: "Sofia", room: "Hall B" }, { time: "10:00", workout: "Zumba", trainer: "Priya", room: "Studio" }, { time: "19:00", workout: "Personal", trainer: "Ethan", room: "PT Room" }],
  Wed: [{ time: "6:00", workout: "Cardio", trainer: "Ethan", room: "Cardio" }, { time: "11:00", workout: "Functional", trainer: "Marcus", room: "Hall A" }, { time: "18:30", workout: "Yoga Flow", trainer: "Priya", room: "Studio" }],
  Thu: [{ time: "7:00", workout: "Strength", trainer: "Marcus", room: "Hall A" }, { time: "10:00", workout: "Weight Loss", trainer: "Sofia", room: "Hall B" }, { time: "20:00", workout: "CrossFit", trainer: "Sofia", room: "Box" }],
  Fri: [{ time: "6:00", workout: "HIIT", trainer: "Sofia", room: "Hall B" }, { time: "12:00", workout: "Personal", trainer: "Ethan", room: "PT Room" }, { time: "18:00", workout: "Zumba", trainer: "Priya", room: "Studio" }],
  Sat: [{ time: "9:00", workout: "Open Gym", trainer: "Staff", room: "Hall A" }, { time: "11:00", workout: "CrossFit", trainer: "Sofia", room: "Box" }, { time: "16:00", workout: "Yoga", trainer: "Priya", room: "Studio" }],
};

const GALLERY = [
  "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1594737625785-a6cbdabd333c?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1550345332-09e3ac987658?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1583500178690-593d0aecab8d?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1517963879433-6ad2b056d712?auto=format&fit=crop&w=800&q=80",
];

interface Review { name: string; img: string; rating: number; text: string; }
const REVIEWS: Review[] = [
  { name: "Jordan M.", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80", rating: 5, text: "Lost 22 lbs in 4 months. Coaches actually care about your progress." },
  { name: "Aisha K.", img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80", rating: 5, text: "Best equipment, cleanest facility, and the CrossFit classes are unreal." },
  { name: "Devon P.", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80", rating: 4, text: "24/7 access changed my life. I train after night shifts with no problem." },
  { name: "Riley S.", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80", rating: 5, text: "The community is what keeps me coming. Feels like a second family." },
];

interface FAQ { q: string; a: string; }
const FAQS: FAQ[] = [
  { q: "How do I sign up for a membership?", a: "Click Join Now, pick a plan, and complete checkout. Your access is active immediately." },
  { q: "Do you offer personal training?", a: "Yes — every certified trainer is bookable directly. Standard and Premium plans include PT sessions." },
  { q: "What's the cancellation policy?", a: "Cancel anytime with 14 days' notice. No hidden fees, no long-term contracts." },
  { q: "What are the gym timings?", a: "Standard hours are 6am–10pm. Standard and Premium members enjoy 24/7 access with a keycard." },
];

const NAV = ["Home", "About", "Programs", "Trainers", "Pricing", "Gallery", "Testimonials", "Contact"];

/* --------------------------- Hooks --------------------------- */

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("in")),
      { threshold: 0.12 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

function useCounter(target: number, start: boolean, duration = 1600) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!start) return;
    const t0 = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / duration);
      setVal(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, start, duration]);
  return val;
}

function useCountdown(target: Date) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const i = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(i);
  }, []);
  const ms = Math.max(0, target.getTime() - now);
  const s = Math.floor(ms / 1000);
  return {
    d: Math.floor(s / 86400),
    h: Math.floor((s % 86400) / 3600),
    m: Math.floor((s % 3600) / 60),
    s: s % 60,
  };
}

/* --------------------------- Component --------------------------- */

function PowerFitGym() {
  const [loaded, setLoaded] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showTop, setShowTop] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dark, setDark] = useState(true);
  const [progCat, setProgCat] = useState<ProgramCat>("All");
  const [search, setSearch] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [reviewIdx, setReviewIdx] = useState(0);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [day, setDay] = useState(DAYS[0]);

  const statsRef = useRef<HTMLDivElement>(null);
  const [statsInView, setStatsInView] = useState(false);

  useReveal();

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 900);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      const y = window.scrollY;
      setProgress(h > 0 ? (y / h) * 100 : 0);
      setScrolled(y > 40);
      setShowTop(y > 500);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => e.isIntersecting && setStatsInView(true),
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("light", !dark);
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  useEffect(() => {
    const i = setInterval(() => setReviewIdx((v) => (v + 1) % REVIEWS.length), 5000);
    return () => clearInterval(i);
  }, []);

  const members = useCounter(5000, statsInView);
  const trainersCount = useCounter(50, statsInView);
  const years = useCounter(15, statsInView);
  const access = useCounter(24, statsInView);

  const promoEnd = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    d.setHours(23, 59, 59, 0);
    return d;
  }, []);
  const cd = useCountdown(promoEnd);

  const filteredPrograms = useMemo(() => {
    const q = search.trim().toLowerCase();
    return PROGRAMS.filter(
      (p) => (progCat === "All" || p.cat === progCat) && (!q || p.name.toLowerCase().includes(q)),
    );
  }, [progCat, search]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-[100] flex items-center justify-center bg-background transition-opacity duration-500 ${loaded ? "pointer-events-none opacity-0" : "opacity-100"}`}
        aria-hidden={loaded}
      >
        <div className="flex flex-col items-center gap-4">
          <i className="fa-solid fa-dumbbell text-5xl text-[color:var(--blood)] animate-pulse" />
          <div className="h-1 w-48 overflow-hidden rounded-full bg-white/10">
            <div className="h-full w-full loader-shimmer" />
          </div>
          <p className="font-display text-sm tracking-widest text-muted-foreground">POWERFIT GYM</p>
        </div>
      </div>

      <div className="fixed inset-x-0 top-0 z-50 h-1 bg-transparent">
        <div
          className="h-full bg-gradient-to-r from-[color:var(--ember)] to-[color:var(--blood)] transition-[width] duration-100"
          style={{ width: `${progress}%` }}
        />
      </div>

      <header
        className={`fixed inset-x-0 top-1 z-40 transition-all ${scrolled ? "backdrop-blur-xl bg-background/75 border-b border-white/10 py-2" : "py-4"}`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5">
          <a href="#home" onClick={(e) => { e.preventDefault(); scrollTo("home"); }} className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-md bg-gradient-to-br from-[color:var(--ember)] to-[color:var(--blood)] text-white shadow-[var(--shadow-red)]">
              <i className="fa-solid fa-dumbbell" />
            </span>
            <span className="font-display text-xl tracking-wider">PowerFit<span className="text-[color:var(--blood)]">.</span></span>
          </a>

          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium">
            {NAV.map((n) => (
              <a key={n} href={`#${n.toLowerCase()}`} onClick={(e) => { e.preventDefault(); scrollTo(n.toLowerCase()); }} className="relative text-foreground/80 hover:text-white transition-colors after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:bg-[color:var(--blood)] hover:after:w-full after:transition-all">
                {n}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setDark((v) => !v)}
              className="grid h-9 w-9 place-items-center rounded-full border border-white/15 text-foreground/80 hover:text-white hover:border-[color:var(--blood)] transition"
              aria-label="Toggle theme"
            >
              <i className={`fa-solid ${dark ? "fa-sun" : "fa-moon"} text-sm`} />
            </button>
            <button
              onClick={() => scrollTo("pricing")}
              className="hidden sm:inline-flex btn-red px-4 py-2 rounded-md text-sm font-semibold uppercase tracking-wider"
            >
              Join Now
            </button>
            <button
              className="lg:hidden grid h-10 w-10 place-items-center rounded-md border border-white/15"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Menu"
            >
              <i className={`fa-solid ${menuOpen ? "fa-xmark" : "fa-bars"}`} />
            </button>
          </div>
        </div>

        <div className={`lg:hidden overflow-hidden transition-[max-height] duration-300 ${menuOpen ? "max-h-[500px]" : "max-h-0"}`}>
          <nav className="mx-4 mt-3 flex flex-col rounded-xl border border-white/10 bg-background/95 backdrop-blur p-3">
            {NAV.map((n) => (
              <a key={n} href={`#${n.toLowerCase()}`} onClick={(e) => { e.preventDefault(); scrollTo(n.toLowerCase()); }} className="rounded-md px-3 py-2.5 text-sm hover:bg-white/5">
                {n}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <main>
        <section id="home" className="relative min-h-screen overflow-hidden flex items-center">
          <img src={HERO_BG} alt="Athlete lifting weights" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/70 to-background" />
          <div className="absolute inset-0 bg-radial-hero" />

          <div className="relative mx-auto max-w-7xl px-5 pt-32 pb-20 grid lg:grid-cols-2 gap-10 items-center w-full">
            <div className="reveal">
              <span className="inline-flex items-center gap-2 rounded-full border border-[color:var(--blood)]/40 bg-[color:var(--blood)]/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-[color:var(--ember)]">
                <span className="h-2 w-2 rounded-full bg-[color:var(--blood)] pulse-red" /> Now open 24/7
              </span>
              <h1 className="mt-5 font-display text-5xl sm:text-6xl lg:text-7xl leading-[0.95]">
                Unleash <span className="text-gradient-red">Your Power</span><br />
                Every Single Day.
              </h1>
              <p className="mt-5 max-w-lg text-lg text-foreground/80">
                Stronger Every Day. Healthier for Life. Train with elite coaches, world-class equipment, and a community that pushes you further.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <button onClick={() => scrollTo("pricing")} className="btn-red rounded-md px-6 py-3 text-sm font-bold uppercase tracking-wider">
                  <i className="fa-solid fa-bolt mr-2" /> Join Now
                </button>
                <button onClick={() => scrollTo("contact")} className="btn-outline-red rounded-md px-6 py-3 text-sm font-bold uppercase tracking-wider">
                  <i className="fa-regular fa-calendar mr-2" /> Book Free Trial
                </button>
              </div>
              <div className="mt-10 flex items-center gap-6 text-sm text-foreground/70">
                <div className="flex -space-x-3">
                  {REVIEWS.slice(0, 4).map((r) => (
                    <img key={r.name} src={r.img} alt="" className="h-9 w-9 rounded-full border-2 border-background object-cover" />
                  ))}
                </div>
                <div>
                  <div className="text-yellow-400"><i className="fa-solid fa-star" /><i className="fa-solid fa-star" /><i className="fa-solid fa-star" /><i className="fa-solid fa-star" /><i className="fa-solid fa-star" /></div>
                  <div className="text-xs">Trusted by <b className="text-white">5,000+</b> members</div>
                </div>
              </div>
            </div>

            <div className="reveal card-glass rounded-2xl p-6 lg:justify-self-end lg:max-w-sm">
              <div className="flex items-center gap-2 text-[color:var(--ember)] text-xs font-bold uppercase tracking-widest">
                <i className="fa-solid fa-tag" /> Limited Offer
              </div>
              <h3 className="mt-2 font-display text-2xl">50% Off First Month</h3>
              <p className="mt-1 text-sm text-foreground/70">Sign up before the timer runs out.</p>
              <div className="mt-5 grid grid-cols-4 gap-2 text-center">
                {[["D", cd.d], ["H", cd.h], ["M", cd.m], ["S", cd.s]].map(([l, v]) => (
                  <div key={l as string} className="rounded-lg bg-black/50 border border-white/10 py-3">
                    <div className="font-display text-2xl text-white">{String(v).padStart(2, "0")}</div>
                    <div className="text-[10px] uppercase tracking-widest text-foreground/60">{l}</div>
                  </div>
                ))}
              </div>
              <button onClick={() => scrollTo("pricing")} className="mt-5 w-full btn-red rounded-md py-2.5 text-sm font-bold uppercase tracking-wider">Claim Offer</button>
            </div>
          </div>

          <a href="#about" onClick={(e) => { e.preventDefault(); scrollTo("about"); }} className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-float text-foreground/60">
            <i className="fa-solid fa-chevron-down text-2xl" />
          </a>
        </section>

        <section id="about" className="py-24">
          <div className="mx-auto max-w-7xl px-5 grid lg:grid-cols-2 gap-12 items-center">
            <div className="reveal relative">
              <img src={ABOUT_IMG} alt="Inside PowerFit Gym" loading="lazy" className="rounded-2xl w-full object-cover aspect-[4/5] shadow-[var(--shadow-card)]" />
              <div className="absolute -bottom-6 -right-4 card-glass rounded-xl p-4 hidden sm:block">
                <div className="font-display text-3xl text-[color:var(--ember)]">15+</div>
                <div className="text-xs uppercase tracking-widest text-foreground/70">Years of Grit</div>
              </div>
            </div>
            <div className="reveal">
              <span className="text-xs font-bold uppercase tracking-widest text-[color:var(--ember)]">About Us</span>
              <h2 className="mt-2 font-display text-4xl sm:text-5xl">Built for those who refuse to quit.</h2>
              <p className="mt-4 text-foreground/75">PowerFit Gym is more than a facility — it's a movement. We blend cutting-edge equipment, elite coaching, and a relentless community to help you break every ceiling you set.</p>
              <div className="mt-6 grid sm:grid-cols-2 gap-4">
                <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                  <div className="text-[color:var(--blood)] mb-1"><i className="fa-solid fa-bullseye" /></div>
                  <h4 className="font-display text-base">Our Mission</h4>
                  <p className="text-sm text-foreground/70 mt-1">Empower every member to become stronger — physically and mentally.</p>
                </div>
                <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                  <div className="text-[color:var(--blood)] mb-1"><i className="fa-solid fa-eye" /></div>
                  <h4 className="font-display text-base">Our Vision</h4>
                  <p className="text-sm text-foreground/70 mt-1">A world where strength and health are lifestyles, not milestones.</p>
                </div>
              </div>

              <div ref={statsRef} className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: "Members", val: members, suffix: "+" },
                  { label: "Trainers", val: trainersCount, suffix: "+" },
                  { label: "Years", val: years, suffix: "+" },
                  { label: "Access", val: access, suffix: "/7" },
                ].map((s) => (
                  <div key={s.label} className="text-center rounded-lg border border-white/10 bg-black/30 py-4">
                    <div className="font-display text-3xl text-white">{s.val.toLocaleString()}{s.suffix}</div>
                    <div className="text-xs uppercase tracking-widest text-foreground/60 mt-1">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="programs" className="py-24 border-t border-white/5">
          <div className="mx-auto max-w-7xl px-5">
            <div className="reveal text-center max-w-2xl mx-auto">
              <span className="text-xs font-bold uppercase tracking-widest text-[color:var(--ember)]">Fitness Programs</span>
              <h2 className="mt-2 font-display text-4xl sm:text-5xl">Train the way you want.</h2>
              <div className="divider-red mt-6 w-32 mx-auto" />
            </div>

            <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 justify-between">
              <div className="flex flex-wrap gap-2">
                {PROGRAM_CATS.map((c) => (
                  <button
                    key={c}
                    onClick={() => setProgCat(c)}
                    className={`rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider border transition ${progCat === c ? "bg-[color:var(--blood)] border-[color:var(--blood)] text-white" : "border-white/15 text-foreground/70 hover:border-[color:var(--blood)]"}`}
                  >
                    {c}
                  </button>
                ))}
              </div>
              <div className="relative w-full sm:w-64">
                <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-foreground/50 text-sm" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search programs..."
                  aria-label="Search programs"
                  className="w-full rounded-full border border-white/15 bg-white/5 pl-9 pr-4 py-2 text-sm outline-none focus:border-[color:var(--blood)]"
                />
              </div>
            </div>

            <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {filteredPrograms.map((p) => (
                <article key={p.name} className="reveal group card-glass rounded-xl overflow-hidden hover-lift">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img src={p.img} alt={p.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <span className="absolute top-3 left-3 grid h-10 w-10 place-items-center rounded-md bg-[color:var(--blood)] text-white shadow-[var(--shadow-red)]">
                      <i className={`fa-solid ${p.icon}`} />
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="font-display text-lg">{p.name}</h3>
                    <p className="mt-1 text-sm text-foreground/70 line-clamp-2">{p.desc}</p>
                    <div className="mt-3 flex items-center justify-between text-xs text-foreground/60">
                      <span><i className="fa-regular fa-clock mr-1" />{p.duration}</span>
                      <span className="rounded-full bg-white/5 px-2 py-0.5">{p.level}</span>
                    </div>
                    <button className="mt-4 text-xs font-bold uppercase tracking-widest text-[color:var(--ember)] hover:text-white transition">
                      Learn More <i className="fa-solid fa-arrow-right ml-1" />
                    </button>
                  </div>
                </article>
              ))}
              {filteredPrograms.length === 0 && (
                <p className="col-span-full text-center text-foreground/60 py-10">No programs match your search.</p>
              )}
            </div>
          </div>
        </section>

        <section id="trainers" className="py-24 border-t border-white/5">
          <div className="mx-auto max-w-7xl px-5">
            <div className="reveal text-center max-w-2xl mx-auto">
              <span className="text-xs font-bold uppercase tracking-widest text-[color:var(--ember)]">Meet Our Trainers</span>
              <h2 className="mt-2 font-display text-4xl sm:text-5xl">Coaches who care.</h2>
              <div className="divider-red mt-6 w-32 mx-auto" />
            </div>
            <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {TRAINERS.map((t) => (
                <div key={t.name} className="reveal group relative rounded-xl overflow-hidden hover-lift">
                  <img src={t.img} alt={t.name} loading="lazy" className="w-full aspect-[3/4] object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
                  <div className="absolute bottom-0 p-5 text-white w-full">
                    <h3 className="font-display text-xl">{t.name}</h3>
                    <p className="text-sm text-[color:var(--ember)]">{t.role}</p>
                    <p className="mt-1 text-xs text-white/70">{t.years} yrs · {t.certs}</p>
                    <div className="mt-3 flex gap-3 opacity-80 group-hover:opacity-100 transition">
                      {["instagram", "twitter", "facebook", "youtube"].map((s) => (
                        <a key={s} href="#" aria-label={s} className="hover:text-[color:var(--ember)]">
                          <i className={`fa-brands fa-${s}`} />
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="py-24 border-t border-white/5 bg-radial-hero">
          <div className="mx-auto max-w-7xl px-5">
            <div className="reveal text-center max-w-2xl mx-auto">
              <span className="text-xs font-bold uppercase tracking-widest text-[color:var(--ember)]">Membership</span>
              <h2 className="mt-2 font-display text-4xl sm:text-5xl">Choose your plan.</h2>
              <div className="divider-red mt-6 w-32 mx-auto" />
            </div>
            <div className="mt-12 grid md:grid-cols-3 gap-6">
              {PLANS.map((p) => (
                <div key={p.name} className={`reveal relative rounded-2xl p-7 border transition ${p.featured ? "bg-gradient-to-b from-[color:var(--blood)]/25 to-black/40 border-[color:var(--blood)] shadow-[var(--shadow-red)] md:scale-105" : "card-glass"}`}>
                  {p.featured && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[color:var(--blood)] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white">Recommended</span>
                  )}
                  <h3 className="font-display text-2xl">{p.name}</h3>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="font-display text-5xl text-white">${p.price}</span>
                    <span className="text-sm text-foreground/60">/month</span>
                  </div>
                  <ul className="mt-6 space-y-3 text-sm">
                    {p.features.map((f) => (
                      <li key={f} className="flex gap-2">
                        <i className="fa-solid fa-check text-[color:var(--ember)] mt-1" />
                        <span className="text-foreground/85">{f}</span>
                      </li>
                    ))}
                  </ul>
                  <button className={`mt-7 w-full rounded-md py-3 text-sm font-bold uppercase tracking-wider ${p.featured ? "btn-red" : "btn-outline-red"}`}>Join Now</button>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 border-t border-white/5">
          <div className="mx-auto max-w-7xl px-5 grid lg:grid-cols-2 gap-10">
            <BMICard />
            <ScheduleCard day={day} setDay={setDay} />
          </div>
        </section>

        <section id="gallery" className="py-24 border-t border-white/5">
          <div className="mx-auto max-w-7xl px-5">
            <div className="reveal text-center max-w-2xl mx-auto">
              <span className="text-xs font-bold uppercase tracking-widest text-[color:var(--ember)]">Gallery</span>
              <h2 className="mt-2 font-display text-4xl sm:text-5xl">Inside the grind.</h2>
              <div className="divider-red mt-6 w-32 mx-auto" />
            </div>
            <div className="mt-10 columns-2 md:columns-3 gap-4 [column-fill:_balance]">
              {GALLERY.map((src, i) => (
                <button
                  key={src}
                  onClick={() => setLightbox(src)}
                  className="mb-4 block w-full overflow-hidden rounded-xl relative group"
                  style={{ breakInside: "avoid" }}
                  aria-label={`View gallery image ${i + 1}`}
                >
                  <img src={src} alt={`Gym ${i + 1}`} loading="lazy" className="w-full transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition flex items-center justify-center">
                    <i className="fa-solid fa-magnifying-glass-plus text-white text-2xl opacity-0 group-hover:opacity-100 transition" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {lightbox && (
            <div
              className="fixed inset-0 z-[80] bg-black/90 backdrop-blur flex items-center justify-center p-4"
              onClick={() => setLightbox(null)}
              role="dialog"
              aria-modal="true"
            >
              <button className="absolute top-5 right-5 h-11 w-11 rounded-full bg-white/10 text-white text-xl" aria-label="Close">
                <i className="fa-solid fa-xmark" />
              </button>
              <img src={lightbox} alt="" className="max-h-[90vh] max-w-full rounded-lg" />
            </div>
          )}
        </section>

        <section id="testimonials" className="py-24 border-t border-white/5 bg-radial-hero">
          <div className="mx-auto max-w-4xl px-5">
            <div className="reveal text-center">
              <span className="text-xs font-bold uppercase tracking-widest text-[color:var(--ember)]">Testimonials</span>
              <h2 className="mt-2 font-display text-4xl sm:text-5xl">What members say.</h2>
              <div className="divider-red mt-6 w-32 mx-auto" />
            </div>
            <div className="mt-12 relative">
              <div className="overflow-hidden rounded-2xl card-glass p-8 md:p-12 text-center">
                {REVIEWS.map((r, i) => (
                  <div key={r.name} className={`transition-opacity duration-500 ${i === reviewIdx ? "opacity-100" : "hidden opacity-0"}`}>
                    <img src={r.img} alt={r.name} className="mx-auto h-20 w-20 rounded-full object-cover ring-2 ring-[color:var(--blood)]" />
                    <div className="mt-4 text-yellow-400">
                      {Array.from({ length: 5 }).map((_, k) => (
                        <i key={k} className={`fa-solid fa-star ${k < r.rating ? "" : "opacity-30"}`} />
                      ))}
                    </div>
                    <p className="mt-4 text-lg text-foreground/85 italic">"{r.text}"</p>
                    <p className="mt-4 font-display text-lg">{r.name}</p>
                  </div>
                ))}
              </div>
              <div className="mt-5 flex justify-center gap-2">
                {REVIEWS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setReviewIdx(i)}
                    aria-label={`Review ${i + 1}`}
                    className={`h-2 rounded-full transition-all ${i === reviewIdx ? "w-8 bg-[color:var(--blood)]" : "w-2 bg-white/25"}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="faq" className="py-24 border-t border-white/5">
          <div className="mx-auto max-w-3xl px-5">
            <div className="reveal text-center">
              <span className="text-xs font-bold uppercase tracking-widest text-[color:var(--ember)]">FAQ</span>
              <h2 className="mt-2 font-display text-4xl sm:text-5xl">Got questions?</h2>
              <div className="divider-red mt-6 w-32 mx-auto" />
            </div>
            <div className="mt-10 space-y-3">
              {FAQS.map((f, i) => {
                const open = openFaq === i;
                return (
                  <div key={f.q} className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
                    <button
                      onClick={() => setOpenFaq(open ? null : i)}
                      className="w-full flex justify-between items-center gap-4 px-5 py-4 text-left"
                      aria-expanded={open}
                    >
                      <span className="font-medium">{f.q}</span>
                      <i className={`fa-solid fa-chevron-down text-[color:var(--ember)] transition-transform ${open ? "rotate-180" : ""}`} />
                    </button>
                    <div className={`grid transition-[grid-template-rows] duration-300 ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                      <div className="overflow-hidden">
                        <p className="px-5 pb-5 text-sm text-foreground/75">{f.a}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <ContactSection />
      </main>

      <Footer scrollTo={scrollTo} />

      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={`fixed bottom-6 right-6 z-40 grid h-12 w-12 place-items-center rounded-full btn-red transition-all ${showTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}
        aria-label="Scroll to top"
      >
        <i className="fa-solid fa-arrow-up" />
      </button>

      <Toaster theme="dark" position="top-center" richColors />
    </>
  );
}

/* --------------------------- Sub-components --------------------------- */

function BMICard() {
  const [h, setH] = useState("");
  const [w, setW] = useState("");
  const [result, setResult] = useState<{ bmi: number; cat: string; tip: string } | null>(null);

  const calc = (e: FormEvent) => {
    e.preventDefault();
    const hn = parseFloat(h), wn = parseFloat(w);
    if (!hn || !wn || hn <= 0 || wn <= 0) {
      toast.error("Enter valid height and weight");
      return;
    }
    const bmi = wn / Math.pow(hn / 100, 2);
    let cat = "Normal weight", tip = "Great! Maintain with balanced training and nutrition.";
    if (bmi < 18.5) { cat = "Underweight"; tip = "Focus on strength training and calorie-dense whole foods."; }
    else if (bmi >= 25 && bmi < 30) { cat = "Overweight"; tip = "Combine cardio with strength and mind your calorie intake."; }
    else if (bmi >= 30) { cat = "Obese"; tip = "Start slow with walking + guided coaching. We can help."; }
    setResult({ bmi: Math.round(bmi * 10) / 10, cat, tip });
  };

  return (
    <div className="reveal card-glass rounded-2xl p-7">
      <span className="text-xs font-bold uppercase tracking-widest text-[color:var(--ember)]">BMI Calculator</span>
      <h3 className="mt-2 font-display text-3xl">Know your number.</h3>
      <form onSubmit={calc} className="mt-6 grid sm:grid-cols-2 gap-4">
        <label className="block">
          <span className="text-xs uppercase tracking-widest text-foreground/60">Height (cm)</span>
          <input value={h} onChange={(e) => setH(e.target.value)} type="number" min="1" className="mt-1 w-full rounded-md border border-white/15 bg-black/40 px-3 py-2.5 outline-none focus:border-[color:var(--blood)]" />
        </label>
        <label className="block">
          <span className="text-xs uppercase tracking-widest text-foreground/60">Weight (kg)</span>
          <input value={w} onChange={(e) => setW(e.target.value)} type="number" min="1" className="mt-1 w-full rounded-md border border-white/15 bg-black/40 px-3 py-2.5 outline-none focus:border-[color:var(--blood)]" />
        </label>
        <button className="sm:col-span-2 btn-red rounded-md py-3 text-sm font-bold uppercase tracking-wider">Calculate</button>
      </form>
      {result && (
        <div className="mt-5 rounded-xl border border-[color:var(--blood)]/30 bg-black/40 p-5">
          <div className="flex items-baseline gap-3">
            <span className="font-display text-4xl text-white">{result.bmi}</span>
            <span className="text-sm text-[color:var(--ember)] uppercase tracking-widest">{result.cat}</span>
          </div>
          <p className="mt-2 text-sm text-foreground/75">{result.tip}</p>
        </div>
      )}
    </div>
  );
}

function ScheduleCard({ day, setDay }: { day: string; setDay: (d: string) => void }) {
  return (
    <div className="reveal card-glass rounded-2xl p-7">
      <span className="text-xs font-bold uppercase tracking-widest text-[color:var(--ember)]">Workout Schedule</span>
      <h3 className="mt-2 font-display text-3xl">Weekly timetable.</h3>
      <div className="mt-5 flex flex-wrap gap-2">
        {DAYS.map((d) => (
          <button
            key={d}
            onClick={() => setDay(d)}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition ${day === d ? "bg-[color:var(--blood)] text-white" : "border border-white/15 text-foreground/70 hover:border-[color:var(--blood)]"}`}
          >
            {d}
          </button>
        ))}
      </div>
      <div className="mt-5 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-xs uppercase tracking-widest text-foreground/60 border-b border-white/10">
            <tr>
              <th className="py-2 pr-3">Time</th>
              <th className="py-2 pr-3">Workout</th>
              <th className="py-2 pr-3">Trainer</th>
              <th className="py-2">Room</th>
            </tr>
          </thead>
          <tbody>
            {SCHEDULE[day].map((s) => (
              <tr key={s.time} className="border-b border-white/5">
                <td className="py-3 pr-3 font-display text-[color:var(--ember)]">{s.time}</td>
                <td className="py-3 pr-3 text-white">{s.workout}</td>
                <td className="py-3 pr-3 text-foreground/75">{s.trainer}</td>
                <td className="py-3 text-foreground/75">{s.room}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ContactSection() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error("Please fill out all fields");
      return;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) {
      toast.error("Enter a valid email");
      return;
    }
    toast.success("Message sent! We'll get back to you soon.");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <section id="contact" className="py-24 border-t border-white/5">
      <div className="mx-auto max-w-7xl px-5">
        <div className="reveal text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-[color:var(--ember)]">Contact</span>
          <h2 className="mt-2 font-display text-4xl sm:text-5xl">Let's talk fitness.</h2>
          <div className="divider-red mt-6 w-32 mx-auto" />
        </div>

        <div className="mt-12 grid lg:grid-cols-2 gap-8">
          <form onSubmit={submit} className="reveal card-glass rounded-2xl p-7 space-y-4">
            <label className="block">
              <span className="text-xs uppercase tracking-widest text-foreground/60">Name</span>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1 w-full rounded-md border border-white/15 bg-black/40 px-3 py-2.5 outline-none focus:border-[color:var(--blood)]" />
            </label>
            <label className="block">
              <span className="text-xs uppercase tracking-widest text-foreground/60">Email</span>
              <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} type="email" className="mt-1 w-full rounded-md border border-white/15 bg-black/40 px-3 py-2.5 outline-none focus:border-[color:var(--blood)]" />
            </label>
            <label className="block">
              <span className="text-xs uppercase tracking-widest text-foreground/60">Message</span>
              <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={5} className="mt-1 w-full rounded-md border border-white/15 bg-black/40 px-3 py-2.5 outline-none focus:border-[color:var(--blood)]" />
            </label>
            <button className="btn-red w-full rounded-md py-3 text-sm font-bold uppercase tracking-wider"><i className="fa-solid fa-paper-plane mr-2" />Send Message</button>
          </form>

          <div className="reveal space-y-5">
            <div className="card-glass rounded-2xl p-6 flex items-start gap-4">
              <span className="grid h-11 w-11 place-items-center rounded-md bg-[color:var(--blood)] text-white"><i className="fa-solid fa-location-dot" /></span>
              <div>
                <h4 className="font-display text-lg">Address</h4>
                <p className="text-sm text-foreground/75 mt-1">1250 Iron Way, Downtown District, NY 10001</p>
              </div>
            </div>
            <div className="card-glass rounded-2xl p-6 flex items-start gap-4">
              <span className="grid h-11 w-11 place-items-center rounded-md bg-[color:var(--blood)] text-white"><i className="fa-solid fa-phone" /></span>
              <div>
                <h4 className="font-display text-lg">Phone</h4>
                <p className="text-sm text-foreground/75 mt-1">+1 (555) 234-9800</p>
              </div>
            </div>
            <div className="card-glass rounded-2xl p-6 flex items-start gap-4">
              <span className="grid h-11 w-11 place-items-center rounded-md bg-[color:var(--blood)] text-white"><i className="fa-solid fa-envelope" /></span>
              <div>
                <h4 className="font-display text-lg">Email</h4>
                <p className="text-sm text-foreground/75 mt-1">hello@powerfitgym.com</p>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden border border-white/10 h-56">
              <iframe
                title="PowerFit Gym Location"
                src="https://www.openstreetmap.org/export/embed.html?bbox=-74.02%2C40.70%2C-73.96%2C40.75&layer=mapnik"
                className="w-full h-full"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer({ scrollTo }: { scrollTo: (id: string) => void }) {
  const [email, setEmail] = useState("");
  const sub = (e: FormEvent) => {
    e.preventDefault();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return toast.error("Enter a valid email");
    toast.success("Subscribed!");
    setEmail("");
  };

  return (
    <footer className="border-t border-white/10 bg-black/60">
      <div className="mx-auto max-w-7xl px-5 py-14 grid md:grid-cols-4 gap-10">
        <div>
          <a className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-md bg-gradient-to-br from-[color:var(--ember)] to-[color:var(--blood)] text-white"><i className="fa-solid fa-dumbbell" /></span>
            <span className="font-display text-xl tracking-wider">PowerFit<span className="text-[color:var(--blood)]">.</span></span>
          </a>
          <p className="mt-3 text-sm text-foreground/70">Stronger Every Day. Healthier for Life.</p>
          <div className="mt-4 flex gap-3">
            {["instagram", "facebook", "twitter", "youtube"].map((s) => (
              <a key={s} href="#" aria-label={s} className="grid h-9 w-9 place-items-center rounded-full border border-white/15 hover:bg-[color:var(--blood)] hover:border-[color:var(--blood)] transition">
                <i className={`fa-brands fa-${s} text-sm`} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-display text-base mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm text-foreground/70">
            {NAV.slice(0, 5).map((n) => (
              <li key={n}><a href={`#${n.toLowerCase()}`} onClick={(e) => { e.preventDefault(); scrollTo(n.toLowerCase()); }} className="hover:text-[color:var(--ember)]">{n}</a></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-display text-base mb-3">Opening Hours</h4>
          <ul className="space-y-2 text-sm text-foreground/70">
            <li>Mon–Fri · 6:00 – 22:00</li>
            <li>Saturday · 8:00 – 20:00</li>
            <li>Sunday · 9:00 – 18:00</li>
            <li className="text-[color:var(--ember)]">24/7 access for members</li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-base mb-3">Newsletter</h4>
          <p className="text-sm text-foreground/70 mb-3">Get training tips & exclusive offers.</p>
          <form onSubmit={sub} className="flex gap-2">
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="you@email.com" className="flex-1 min-w-0 rounded-md border border-white/15 bg-black/40 px-3 py-2 text-sm outline-none focus:border-[color:var(--blood)]" />
            <button className="btn-red rounded-md px-4 text-sm font-bold uppercase"><i className="fa-solid fa-paper-plane" /></button>
          </form>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-foreground/50">
        © {new Date().getFullYear()} PowerFit Gym. All rights reserved.
      </div>
    </footer>
  );
}
