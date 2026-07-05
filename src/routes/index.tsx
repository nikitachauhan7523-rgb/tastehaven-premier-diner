import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { toast, Toaster } from "sonner";

import heroFood from "@/assets/hero-food.jpg";
import dishPizza from "@/assets/dish-pizza.jpg";
import dishBurger from "@/assets/dish-burger.jpg";
import dishPasta from "@/assets/dish-pasta.jpg";
import dishIndian from "@/assets/dish-indian.jpg";
import dishChinese from "@/assets/dish-chinese.jpg";
import dishDessert from "@/assets/dish-dessert.jpg";
import dishDrinks from "@/assets/dish-drinks.jpg";
import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import gallery4 from "@/assets/gallery-4.jpg";
import gallery5 from "@/assets/gallery-5.jpg";
import gallery6 from "@/assets/gallery-6.jpg";
import chef1 from "@/assets/chef-1.jpg";
import chef2 from "@/assets/chef-2.jpg";
import chef3 from "@/assets/chef-3.jpg";

export const Route = createFileRoute("/")({
  component: TasteHaven,
  head: () => ({
    meta: [
      { property: "og:image", content: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200" },
    ],
  }),
});

/* -------------------------------- Data -------------------------------- */

type Category = "All" | "Pizza" | "Burgers" | "Pasta" | "Indian" | "Chinese" | "Desserts" | "Drinks";
const CATEGORIES: Category[] = ["All", "Pizza", "Burgers", "Pasta", "Indian", "Chinese", "Desserts", "Drinks"];

interface Dish {
  name: string;
  category: Exclude<Category, "All">;
  desc: string;
  price: number;
  rating: number;
  image: string;
}

const DISHES: Dish[] = [
  { name: "Margherita Regina", category: "Pizza", desc: "San Marzano tomato, buffalo mozzarella, fresh basil.", price: 18, rating: 4.9, image: dishPizza },
  { name: "Truffle Smash Burger", category: "Burgers", desc: "Double patty, aged cheddar, black truffle aioli.", price: 22, rating: 4.8, image: dishBurger },
  { name: "Tagliatelle al Tartufo", category: "Pasta", desc: "Hand-rolled pasta, parmesan cream, black truffle.", price: 26, rating: 4.9, image: dishPasta },
  { name: "Butter Chicken Royale", category: "Indian", desc: "Tandoor chicken, tomato-cashew gravy, saffron rice.", price: 24, rating: 4.7, image: dishIndian },
  { name: "Kung Pao Chicken", category: "Chinese", desc: "Wok-fired chicken, chili, cashews, Sichuan pepper.", price: 21, rating: 4.6, image: dishChinese },
  { name: "Molten Gold Cake", category: "Desserts", desc: "Warm chocolate lava, vanilla bean, 24k gold leaf.", price: 14, rating: 5.0, image: dishDessert },
  { name: "Smoked Old Fashioned", category: "Drinks", desc: "Bourbon, bitters, applewood smoke, orange oil.", price: 16, rating: 4.8, image: dishDrinks },
  { name: "Diavola Fuoco", category: "Pizza", desc: "Spicy salami, chili honey, smoked mozzarella.", price: 20, rating: 4.7, image: dishPizza },
];

const OFFERS = [
  { title: "20% Off Weekdays", desc: "Every Monday to Thursday, 5–7 PM. Enjoy the full menu at a warm discount.", tag: "Weekly", icon: "fa-percent" },
  { title: "Buy One, Get One Pizza", desc: "Order any signature pizza and the second is on the house. Fridays only.", tag: "Friday", icon: "fa-pizza-slice" },
  { title: "Free Dessert Over $50", desc: "A complimentary Molten Gold Cake with every order above $50.", tag: "Always", icon: "fa-cake-candles" },
];

const TESTIMONIALS = [
  { name: "Aarav Mehta", role: "Food Critic", rating: 5, text: "Every plate feels considered. The truffle tagliatelle is one of the finest bowls of pasta in the city." },
  { name: "Sofia Alvarez", role: "Regular Guest", rating: 5, text: "The ambience is intimate, the service impeccable. Taste Haven is our anniversary tradition." },
  { name: "Marcus Chen", role: "Chef & Blogger", rating: 4, text: "Bold flavors, quiet confidence. The kitchen respects ingredients — and it shows in every bite." },
  { name: "Priya Kapoor", role: "Travel Writer", rating: 5, text: "From the smoked old fashioned to the butter chicken, this place hits every note perfectly." },
];

const CHEFS = [
  { name: "Chef Antonio Rossi", role: "Executive Chef", image: chef1, bio: "20 years across Milan, Tokyo and New York. Champion of seasonal, ingredient-first cooking." },
  { name: "Chef Elena Marín", role: "Head Pastry Chef", image: chef2, bio: "Trained in Paris. Her desserts blend classical French technique with playful modern twists." },
  { name: "Chef Liam O'Connor", role: "Sous Chef", image: chef3, bio: "A grill master with a passion for smoke, char and the perfect medium-rare." },
];

const FAQS = [
  { q: "Do I need a reservation?", a: "Reservations are highly recommended, especially on weekends. Walk-ins are welcome based on availability." },
  { q: "Do you cater dietary restrictions?", a: "Yes — vegan, gluten-free and allergy-friendly options are available on every course. Please note it when reserving." },
  { q: "Is there a dress code?", a: "Smart casual. We simply ask you to feel comfortable and confident in the room." },
  { q: "Do you host private events?", a: "Absolutely. Our private dining room seats up to 30 guests with dedicated service and a bespoke menu." },
];

const GALLERY = [gallery1, gallery2, gallery3, gallery4, gallery5, gallery6];

/* ---------------------------- Reveal helper --------------------------- */

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(".reveal");
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) e.target.classList.add("in");
      },
      { threshold: 0.12 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

function useCounter(target: number, start: boolean, duration = 1600) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!start) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / duration);
      setN(Math.floor(p * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, target, duration]);
  return n;
}

/* --------------------------------- Page ------------------------------- */

function TasteHaven() {
  const [loading, setLoading] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [cat, setCat] = useState<Category>("All");
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState(0);
  const [flyKey, setFlyKey] = useState(0);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [tIndex, setTIndex] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [showTop, setShowTop] = useState(false);

  const statsRef = useRef<HTMLDivElement | null>(null);
  const [statsIn, setStatsIn] = useState(false);

  useReveal();

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      setShowTop(window.scrollY > 500);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("light", theme === "light");
  }, [theme]);

  useEffect(() => {
    if (!statsRef.current) return;
    const io = new IntersectionObserver(
      ([e]) => e.isIntersecting && setStatsIn(true),
      { threshold: 0.3 },
    );
    io.observe(statsRef.current);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const id = setInterval(() => setTIndex((i) => (i + 1) % TESTIMONIALS.length), 5000);
    return () => clearInterval(id);
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return DISHES.filter((d) => (cat === "All" || d.category === cat) && (q === "" || d.name.toLowerCase().includes(q) || d.desc.toLowerCase().includes(q)));
  }, [cat, search]);

  const addToCart = (name: string) => {
    setCart((c) => c + 1);
    setFlyKey((k) => k + 1);
    toast.success(`${name} added to cart`);
  };

  const onReserve = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") || "").trim();
    const email = String(fd.get("email") || "").trim();
    const phone = String(fd.get("phone") || "").trim();
    const date = String(fd.get("date") || "");
    const time = String(fd.get("time") || "");
    if (!name || name.length > 80) return toast.error("Please enter a valid name.");
    if (!/^\S+@\S+\.\S+$/.test(email)) return toast.error("Please enter a valid email.");
    if (!/^[\d+\-\s()]{7,20}$/.test(phone)) return toast.error("Please enter a valid phone.");
    if (!date || !time) return toast.error("Please pick a date and time.");
    toast.success(`Table reserved, ${name}. See you soon!`);
    e.currentTarget.reset();
  };

  const guests = useCounter(24500, statsIn);
  const dishesCount = useCounter(120, statsIn);
  const chefsCount = useCounter(15, statsIn);
  const awards = useCounter(32, statsIn);

  const scrollTo = (id: string) => {
    setMobileOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  /* ------------------------------ Render ------------------------------ */

  if (loading) {
    return (
      <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background">
        <div className="text-4xl font-display text-gradient-gold">Taste Haven</div>
        <div className="mt-6 h-[2px] w-56 overflow-hidden rounded-full bg-secondary">
          <div className="h-full w-1/3 loader-shimmer" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Toaster theme={theme} richColors position="top-right" />

      {/* Nav */}
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled ? "bg-background/85 backdrop-blur-md border-b border-border" : "bg-transparent"}`}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
          <button onClick={() => scrollTo("home")} className="flex items-center gap-2" aria-label="Taste Haven home">
            <i className="fa-solid fa-utensils text-primary text-lg" />
            <span className="font-display text-xl font-semibold tracking-wide">Taste <span className="text-gradient-gold">Haven</span></span>
          </button>

          <ul className="hidden items-center gap-8 lg:flex">
            {["home", "menu", "about", "gallery", "testimonials", "contact"].map((s) => (
              <li key={s}>
                <button onClick={() => scrollTo(s)} className="text-sm capitalize text-muted-foreground transition-colors hover:text-primary">
                  {s}
                </button>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <button
              aria-label="Toggle theme"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="grid h-9 w-9 place-items-center rounded-full border border-border text-muted-foreground hover:text-primary transition-colors"
            >
              <i className={`fa-solid ${theme === "dark" ? "fa-sun" : "fa-moon"}`} />
            </button>
            <div className="relative grid h-9 w-9 place-items-center rounded-full border border-border">
              <i className="fa-solid fa-bag-shopping text-muted-foreground" />
              {cart > 0 && (
                <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1 text-[10px] font-semibold text-accent-foreground">
                  {cart}
                </span>
              )}
              {flyKey > 0 && (
                <span key={flyKey} className="pointer-events-none absolute inset-0 grid place-items-center">
                  <span className="h-2 w-2 rounded-full bg-primary animate-ping" />
                </span>
              )}
            </div>
            <button onClick={() => scrollTo("reserve")} className="hidden rounded-full px-5 py-2 text-sm font-medium btn-gold md:inline-flex">
              Reserve
            </button>
            <button onClick={() => setMobileOpen((v) => !v)} className="grid h-9 w-9 place-items-center rounded-full border border-border lg:hidden" aria-label="Menu">
              <i className={`fa-solid ${mobileOpen ? "fa-xmark" : "fa-bars"}`} />
            </button>
          </div>
        </nav>

        {mobileOpen && (
          <div className="border-t border-border bg-background/95 backdrop-blur lg:hidden">
            <ul className="mx-auto flex max-w-7xl flex-col gap-1 px-5 py-4">
              {["home", "menu", "about", "gallery", "testimonials", "contact", "reserve"].map((s) => (
                <li key={s}>
                  <button onClick={() => scrollTo(s)} className="block w-full rounded-md px-3 py-2 text-left capitalize hover:bg-secondary">
                    {s}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </header>

      {/* Hero */}
      <section id="home" className="relative isolate flex min-h-screen items-center overflow-hidden">
        <img src={heroFood} alt="" className="absolute inset-0 h-full w-full object-cover" width={1920} height={1280} />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/70 to-background" />
        <div className="absolute inset-0 bg-radial-hero" />

        <div className="relative mx-auto grid w-full max-w-7xl gap-10 px-5 pt-32 pb-20 md:px-8 md:pt-40">
          <div className="max-w-3xl reveal">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-card/40 px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-muted-foreground backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              Now taking reservations
            </div>
            <h1 className="font-display text-5xl leading-[1.05] sm:text-6xl md:text-7xl lg:text-8xl">
              Fresh Ingredients.
              <br />
              <span className="text-gradient-gold">Memorable</span> Experiences.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
              A modern dining haven where seasonal produce, wood-fire craftsmanship, and warm hospitality meet — night after night.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <button onClick={() => scrollTo("reserve")} className="inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-semibold btn-gold">
                <i className="fa-solid fa-calendar-check" /> Reserve Table
              </button>
              <button onClick={() => scrollTo("menu")} className="inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-semibold btn-outline-gold">
                <i className="fa-solid fa-book-open" /> View Menu
              </button>
            </div>

            <div ref={statsRef} className="mt-16 grid max-w-2xl grid-cols-2 gap-6 sm:grid-cols-4">
              {[
                { n: guests, s: "+", l: "Happy Guests" },
                { n: dishesCount, s: "", l: "Signature Dishes" },
                { n: chefsCount, s: "", l: "Expert Chefs" },
                { n: awards, s: "", l: "Awards Won" },
              ].map((s) => (
                <div key={s.l}>
                  <div className="font-display text-3xl text-primary">{s.n.toLocaleString()}{s.s}</div>
                  <div className="text-xs uppercase tracking-widest text-muted-foreground">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-muted-foreground animate-float" aria-hidden>
          <i className="fa-solid fa-angle-down text-xl" />
        </div>
      </section>

      {/* About */}
      <section id="about" className="relative py-24 md:py-32">
        <div className="mx-auto grid max-w-7xl gap-14 px-5 md:px-8 lg:grid-cols-2 lg:items-center">
          <div className="reveal">
            <SectionKicker>Our Story</SectionKicker>
            <h2 className="mt-3 font-display text-4xl md:text-5xl">A haven for the curious palate.</h2>
            <p className="mt-5 text-muted-foreground">
              Born from a love of the neighborhood market, Taste Haven brings together seasonal ingredients, global technique, and a room designed for slow, unhurried evenings. Every plate is a small ceremony.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-4">
              {[
                { i: "fa-seedling", t: "Fresh Ingredients", d: "Sourced daily from local farms." },
                { i: "fa-hat-chef", t: "Experienced Chefs", d: "A team with global training." },
                { i: "fa-fire", t: "Cozy Atmosphere", d: "Warm lighting, intimate seating." },
                { i: "fa-bolt", t: "Fast Service", d: "Attentive, never rushed." },
              ].map((f) => (
                <div key={f.t} className="rounded-xl border border-border bg-card/50 p-5 hover-lift">
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-primary/15 text-primary">
                    <i className={`fa-solid ${f.i}`} />
                  </div>
                  <h3 className="mt-3 font-display text-lg">{f.t}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{f.d}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative reveal">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
              <img src={gallery1} alt="Restaurant interior" loading="lazy" width={900} height={900} className="h-full w-full object-cover" />
            </div>
            <div className="absolute -bottom-8 -left-6 hidden w-56 rounded-xl card-glass p-5 shadow-card md:block">
              <div className="text-xs uppercase tracking-widest text-muted-foreground">Since</div>
              <div className="font-display text-4xl text-gradient-gold">2012</div>
              <div className="mt-1 text-sm text-muted-foreground">A decade of memorable evenings.</div>
            </div>
          </div>
        </div>
      </section>

      {/* Menu */}
      <section id="menu" className="relative py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <div className="reveal">
              <SectionKicker>Featured Menu</SectionKicker>
              <h2 className="mt-3 font-display text-4xl md:text-5xl">Signatures from the kitchen.</h2>
            </div>
            <div className="w-full max-w-sm reveal">
              <label className="flex items-center gap-3 rounded-full border border-border bg-card/50 px-4 py-2.5">
                <i className="fa-solid fa-magnifying-glass text-muted-foreground" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value.slice(0, 60))}
                  placeholder="Search dishes..."
                  className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                  aria-label="Search menu"
                />
              </label>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-2 reveal">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`rounded-full border px-4 py-1.5 text-sm transition-all ${
                  cat === c
                    ? "border-transparent btn-gold"
                    : "border-border text-muted-foreground hover:text-primary hover:border-primary/50"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((d) => (
              <article key={d.name} className="group reveal overflow-hidden rounded-2xl border border-border bg-card hover-lift">
                <div className="relative aspect-square overflow-hidden">
                  <img src={d.image} alt={d.name} loading="lazy" width={800} height={800} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute right-3 top-3 rounded-full bg-background/70 px-3 py-1 text-xs backdrop-blur">
                    <i className="fa-solid fa-star text-primary" /> {d.rating}
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-lg">{d.name}</h3>
                    <span className="font-display text-primary">${d.price}</span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{d.desc}</p>
                  <button
                    onClick={() => addToCart(d.name)}
                    className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full border border-border py-2 text-sm font-medium text-foreground transition-all hover:btn-gold hover:border-transparent"
                  >
                    <i className="fa-solid fa-plus" /> Order Now
                  </button>
                </div>
              </article>
            ))}
            {filtered.length === 0 && (
              <div className="col-span-full rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">
                No dishes match your search.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Offers */}
      <section className="relative py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="reveal">
            <SectionKicker>This Season</SectionKicker>
            <h2 className="mt-3 font-display text-4xl md:text-5xl">Special offers, made for sharing.</h2>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {OFFERS.map((o) => (
              <div key={o.title} className="reveal relative overflow-hidden rounded-2xl border border-primary/25 p-8 hover-lift" style={{ background: "linear-gradient(160deg, color-mix(in oklab, var(--gold) 10%, var(--card)), var(--card))" }}>
                <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/15 blur-2xl" />
                <div className="relative flex items-center justify-between">
                  <div className="grid h-12 w-12 place-items-center rounded-full bg-primary/20 text-primary">
                    <i className={`fa-solid ${o.icon}`} />
                  </div>
                  <span className="rounded-full border border-primary/40 px-3 py-1 text-[10px] uppercase tracking-widest text-primary">{o.tag}</span>
                </div>
                <h3 className="relative mt-6 font-display text-2xl">{o.title}</h3>
                <p className="relative mt-2 text-sm text-muted-foreground">{o.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section id="gallery" className="relative py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="reveal">
            <SectionKicker>Gallery</SectionKicker>
            <h2 className="mt-3 font-display text-4xl md:text-5xl">A glimpse inside the haven.</h2>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {GALLERY.map((src, i) => (
              <button
                key={i}
                onClick={() => setLightbox(src)}
                className={`reveal group relative overflow-hidden rounded-2xl ${i === 0 ? "lg:row-span-2 lg:col-span-2 aspect-square lg:aspect-auto" : "aspect-square"}`}
              >
                <img src={src} alt={`Gallery ${i + 1}`} loading="lazy" width={900} height={900} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-background/0 transition-colors group-hover:bg-background/40" />
                <div className="absolute inset-0 grid place-items-center opacity-0 transition-opacity group-hover:opacity-100">
                  <span className="grid h-12 w-12 place-items-center rounded-full bg-primary text-primary-foreground">
                    <i className="fa-solid fa-expand" />
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {lightbox && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-[80] grid place-items-center bg-background/90 p-4 backdrop-blur"
            onClick={() => setLightbox(null)}
          >
            <button aria-label="Close" className="absolute right-6 top-6 grid h-11 w-11 place-items-center rounded-full border border-border text-foreground">
              <i className="fa-solid fa-xmark" />
            </button>
            <img src={lightbox} alt="Preview" className="max-h-[85vh] max-w-[95vw] rounded-2xl object-contain" />
          </div>
        )}
      </section>

      {/* Chefs */}
      <section className="relative py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="reveal">
            <SectionKicker>Meet the Team</SectionKicker>
            <h2 className="mt-3 font-display text-4xl md:text-5xl">The craft behind every plate.</h2>
          </div>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {CHEFS.map((c) => (
              <div key={c.name} className="reveal group">
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
                  <img src={c.image} alt={c.name} loading="lazy" width={800} height={1000} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-background to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <div className="text-xs uppercase tracking-widest text-primary">{c.role}</div>
                    <h3 className="font-display text-2xl">{c.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{c.bio}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="relative overflow-hidden py-24 md:py-32">
        <div className="mx-auto max-w-4xl px-5 text-center md:px-8">
          <SectionKicker>Guests Say</SectionKicker>
          <h2 className="mt-3 font-display text-4xl md:text-5xl">Loved by the city.</h2>

          <div className="relative mt-12 min-h-[240px]">
            {TESTIMONIALS.map((t, i) => (
              <blockquote
                key={t.name}
                className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-700 ${i === tIndex ? "opacity-100" : "pointer-events-none opacity-0 translate-y-4"}`}
              >
                <div className="flex gap-1 text-primary">
                  {Array.from({ length: 5 }).map((_, k) => (
                    <i key={k} className={`fa-solid fa-star ${k < t.rating ? "" : "opacity-25"}`} />
                  ))}
                </div>
                <p className="mt-6 font-display text-2xl leading-relaxed md:text-3xl">"{t.text}"</p>
                <div className="mt-6 flex items-center gap-3">
                  <div className="grid h-11 w-11 place-items-center rounded-full bg-primary/20 font-display text-primary">
                    {t.name.split(" ").map((s) => s[0]).join("").slice(0, 2)}
                  </div>
                  <div className="text-left">
                    <div className="font-medium">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.role}</div>
                  </div>
                </div>
              </blockquote>
            ))}
          </div>

          <div className="mt-8 flex justify-center gap-2">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                aria-label={`Testimonial ${i + 1}`}
                onClick={() => setTIndex(i)}
                className={`h-1.5 rounded-full transition-all ${i === tIndex ? "w-8 bg-primary" : "w-2 bg-border"}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Reservation */}
      <section id="reserve" className="relative py-24 md:py-32">
        <div className="mx-auto grid max-w-7xl gap-14 px-5 md:px-8 lg:grid-cols-2">
          <div className="reveal">
            <SectionKicker>Reservation</SectionKicker>
            <h2 className="mt-3 font-display text-4xl md:text-5xl">Book your table.</h2>
            <p className="mt-4 text-muted-foreground">Reservations open daily from 5 PM. For groups of 8+, please call us directly.</p>

            <div className="mt-8 space-y-4">
              {[
                { i: "fa-clock", t: "Opening Hours", d: "Mon–Sun, 5 PM – 12 AM" },
                { i: "fa-phone", t: "Direct Line", d: "+1 (415) 555 0138" },
                { i: "fa-location-dot", t: "Location", d: "42 Amber Street, Downtown District" },
              ].map((r) => (
                <div key={r.t} className="flex items-start gap-4 rounded-xl border border-border bg-card/40 p-4">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary/15 text-primary">
                    <i className={`fa-solid ${r.i}`} />
                  </div>
                  <div>
                    <div className="font-medium">{r.t}</div>
                    <div className="text-sm text-muted-foreground">{r.d}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={onReserve} className="reveal rounded-2xl border border-border bg-card p-6 md:p-8">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Full Name" name="name" placeholder="Jane Doe" required maxLength={80} />
              <Field label="Email" name="email" type="email" placeholder="you@example.com" required maxLength={120} />
              <Field label="Phone" name="phone" type="tel" placeholder="+1 415 555 0138" required maxLength={20} />
              <Field label="Guests" name="guests" type="number" placeholder="2" required min={1} max={30} defaultValue={2} />
              <Field label="Date" name="date" type="date" required />
              <Field label="Time" name="time" type="time" required />
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-xs uppercase tracking-widest text-muted-foreground">Message</label>
                <textarea name="message" maxLength={500} rows={3} placeholder="Any special request..." className="w-full resize-none rounded-lg border border-border bg-background/50 px-4 py-3 text-sm outline-none focus:border-primary" />
              </div>
            </div>
            <button type="submit" className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold btn-gold">
              <i className="fa-solid fa-calendar-check" /> Reserve Table
            </button>
          </form>
        </div>
      </section>

      {/* FAQ */}
      <section className="relative py-24 md:py-32">
        <div className="mx-auto max-w-3xl px-5 md:px-8">
          <div className="reveal text-center">
            <SectionKicker>FAQ</SectionKicker>
            <h2 className="mt-3 font-display text-4xl md:text-5xl">Things guests ask.</h2>
          </div>
          <div className="mt-10 divide-y divide-border rounded-2xl border border-border bg-card/40">
            {FAQS.map((f, i) => {
              const open = openFaq === i;
              return (
                <div key={f.q} className="reveal">
                  <button
                    onClick={() => setOpenFaq(open ? null : i)}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                    aria-expanded={open}
                  >
                    <span className="font-display text-lg">{f.q}</span>
                    <i className={`fa-solid fa-plus text-primary transition-transform ${open ? "rotate-45" : ""}`} />
                  </button>
                  <div className={`grid overflow-hidden transition-[grid-template-rows] duration-300 ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                    <div className="min-h-0 overflow-hidden px-6 pb-5 text-sm text-muted-foreground">{f.a}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="relative py-24 md:py-32">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 md:px-8 lg:grid-cols-2">
          <div className="reveal">
            <SectionKicker>Contact</SectionKicker>
            <h2 className="mt-3 font-display text-4xl md:text-5xl">Come find us.</h2>
            <p className="mt-4 text-muted-foreground">Two blocks from the riverfront, tucked behind the old amber lamp post.</p>

            <div className="mt-8 space-y-3">
              <ContactRow icon="fa-location-dot" title="42 Amber Street, Downtown District, CA 94103" />
              <ContactRow icon="fa-phone" title="+1 (415) 555 0138" />
              <ContactRow icon="fa-envelope" title="hello@tastehaven.co" />
            </div>

            <div className="mt-8 flex gap-3">
              {["instagram", "facebook", "x-twitter", "tiktok"].map((s) => (
                <a key={s} href="#" aria-label={s} className="grid h-10 w-10 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:text-primary hover:border-primary/60">
                  <i className={`fa-brands fa-${s}`} />
                </a>
              ))}
            </div>
          </div>
          <div className="reveal overflow-hidden rounded-2xl border border-border">
            <iframe
              title="Taste Haven location"
              src="https://www.google.com/maps?q=San+Francisco+downtown&output=embed"
              className="h-[420px] w-full grayscale-[30%]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/40 py-14">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 md:grid-cols-4 md:px-8">
          <div>
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-utensils text-primary" />
              <span className="font-display text-xl">Taste <span className="text-gradient-gold">Haven</span></span>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">Fresh ingredients, memorable experiences — since 2012.</p>
          </div>
          <div>
            <h4 className="font-display text-lg">Quick Links</h4>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              {["Menu", "About", "Gallery", "Reserve", "Contact"].map((l) => (
                <li key={l}><button onClick={() => scrollTo(l.toLowerCase())} className="hover:text-primary">{l}</button></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-display text-lg">Opening Hours</h4>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>Mon–Thu · 5 PM – 11 PM</li>
              <li>Fri–Sat · 5 PM – 1 AM</li>
              <li>Sunday · 4 PM – 11 PM</li>
            </ul>
          </div>
          <div>
            <h4 className="font-display text-lg">Newsletter</h4>
            <p className="mt-4 text-sm text-muted-foreground">Seasonal menus and private events, once a month.</p>
            <form onSubmit={(e) => { e.preventDefault(); toast.success("Subscribed! Welcome to Taste Haven."); (e.currentTarget as HTMLFormElement).reset(); }} className="mt-4 flex overflow-hidden rounded-full border border-border bg-background/60">
              <input required type="email" maxLength={120} placeholder="you@email.com" className="flex-1 bg-transparent px-4 py-2.5 text-sm outline-none" aria-label="Email" />
              <button className="px-4 btn-gold text-sm font-semibold" type="submit">Join</button>
            </form>
          </div>
        </div>
        <div className="mx-auto mt-10 max-w-7xl px-5 md:px-8">
          <div className="divider-gold" />
          <div className="mt-6 flex flex-col items-center justify-between gap-3 text-xs text-muted-foreground md:flex-row">
            <div>© {new Date().getFullYear()} Taste Haven. All rights reserved.</div>
            <div>Crafted with care in the Downtown District.</div>
          </div>
        </div>
      </footer>

      {/* Scroll to top */}
      <button
        aria-label="Back to top"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={`fixed bottom-6 right-6 z-40 grid h-11 w-11 place-items-center rounded-full btn-gold transition-all ${showTop ? "opacity-100 translate-y-0" : "pointer-events-none opacity-0 translate-y-3"}`}
      >
        <i className="fa-solid fa-arrow-up" />
      </button>
    </div>
  );
}

/* ------------------------------ Sub UI -------------------------------- */

function SectionKicker({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-primary">
      <span className="h-px w-8 bg-primary" />
      {children}
    </div>
  );
}

function Field(props: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  maxLength?: number;
  min?: number;
  max?: number;
  defaultValue?: string | number;
}) {
  const { label, ...rest } = props;
  return (
    <div>
      <label className="mb-1.5 block text-xs uppercase tracking-widest text-muted-foreground">{label}</label>
      <input
        {...rest}
        className="w-full rounded-lg border border-border bg-background/50 px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
      />
    </div>
  );
}

function ContactRow({ icon, title }: { icon: string; title: string }) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="grid h-9 w-9 place-items-center rounded-full bg-primary/15 text-primary">
        <i className={`fa-solid ${icon}`} />
      </span>
      <span>{title}</span>
    </div>
  );
}
