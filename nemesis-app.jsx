// NEMESIS · restaurant site app

const { useState, useEffect, useRef, useMemo } = React;

// ─── content ─────────────────────────────────────────────────────────

const MENU = {
  antipasti: {
    title: "Antipasti",
    sub: "Przystawki · do dzielenia",
    items: [
      { name: "Vitello tonnato",       price: "42 zł", desc: "cielęcina, sos tuńczykowy, kapary, świeży tymianek" },
      { name: "Carpaccio di manzo",    price: "46 zł", desc: "polędwica wołowa, czarne trufle, parmezan reggiano" },
      { name: "Burrata di Puglia",     price: "38 zł", desc: "pomidor heritage, oliwa toskańska, bazylia" },
      { name: "Tatar wołowy",          price: "42 zł", desc: "żółtko, anchois, ogórek konserwowy, brioche" },
    ],
  },
  primi: {
    title: "Primi",
    sub: "Makarony · risotto",
    items: [
      { name: "Tagliatelle al ragù",    price: "48 zł", desc: "ośmiogodzinne żeberka, parmezan reggiano" },
      { name: "Risotto al carciofo",    price: "46 zł", desc: "karczochy, mascarpone, skórka cytryny" },
      { name: "Pappardelle con agnello",price: "52 zł", desc: "duszona jagnięcina, rozmaryn, czerwone wino" },
      { name: "Cacio e pepe",           price: "38 zł", desc: "tonnarelli, pecorino, czarny pieprz" },
    ],
  },
  secondi: {
    title: "Secondi",
    sub: "Dania główne",
    items: [
      { name: "Polędwica wołowa",       price: "86 zł", desc: "sos bordelaise, ziemniak gratin, młody szpinak" },
      { name: "Kaczka po bordosku",     price: "74 zł", desc: "wytrawne czerwone wino, suszone wiśnie, seler" },
      { name: "Halibut z patelni",      price: "68 zł", desc: "beurre blanc, fenkuł confit, kawior z cytryny" },
      { name: "Kotlet jagnięcy",        price: "78 zł", desc: "salsa verde, bób, młode ziemniaki w maśle" },
    ],
  },
  dolci: {
    title: "Dolci",
    sub: "Desery",
    items: [
      { name: "Tiramisu Nemesis",       price: "28 zł", desc: "kawa Sumatra Mandheling, mascarpone, Marsala" },
      { name: "Crème brûlée",           price: "26 zł", desc: "bourbon vanilla, karmelizowany cukier trzcinowy" },
      { name: "Panna cotta z malinami", price: "24 zł", desc: "sezonowe maliny, redukcja balsamico" },
      { name: "Affogato al caffè",      price: "22 zł", desc: "lody waniliowe, espresso, biscotti" },
    ],
  },
  aperitivi: {
    title: "Aperitivi",
    sub: "Bar · klasyka",
    items: [
      { name: "Negroni",                price: "32 zł", desc: "Campari, Vermouth Rosso, dżin Tanqueray" },
      { name: "Boulevardier",           price: "34 zł", desc: "bourbon Buffalo Trace, Campari, Vermouth Rosso" },
      { name: "Vesper Martini",         price: "36 zł", desc: "dżin, wódka, Lillet Blanc, skórka cytryny" },
      { name: "Sgroppino al limone",    price: "28 zł", desc: "prosecco, sorbet cytrynowy, wódka" },
    ],
  },
};

const TABS = [
  { id: "antipasti", label: "Antipasti" },
  { id: "primi",     label: "Primi" },
  { id: "secondi",   label: "Secondi" },
  { id: "dolci",     label: "Dolci" },
  { id: "aperitivi", label: "Aperitivi" },
];

const PRESS = [
  { quote: "Kuchnia bez kompromisów i serwis, który pamięta się latami. Najlepsza włoska kolacja, jaką jadłem w stolicy w tym roku.",
    source: "Gazeta Wyborcza · Stół" },
  { quote: "Nemesis przywróciła Warszawie wieczór w pełnym tego słowa znaczeniu.",
    source: "Vogue Polska" },
  { quote: "Skromna karta, perfekcyjne wykonanie. Tagliatelle al ragù na poziomie najlepszych trattorii Bolonii.",
    source: "Forbes Polska" },
];

const GALLERY = [
  { tag: "wnętrze · sala główna",   cls: "big" },
  { tag: "stół szefa kuchni",       cls: "tall" },
  { tag: "tagliatelle al ragù",     cls: "sm" },
  { tag: "negroni w aldze",         cls: "sm" },
  { tag: "bar · południowa ściana", cls: "wide" },
  { tag: "patio · róg Wilcza",      cls: "" },
];

// ─── small helpers ──────────────────────────────────────────────────

function Placeholder({ tag, className = "", style }) {
  return (
    <div className={`ph ${className}`} style={style}>
      <span className="ph-tag">{tag}</span>
    </div>
  );
}

function Ornament({ glyph = "✦ ✦ ✦" }) {
  return <div className="ornament" aria-hidden="true">{glyph}</div>;
}

function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("in"); }),
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

function Reveal({ children, as: Tag = "div", className = "", ...rest }) {
  const ref = useReveal();
  return <Tag ref={ref} className={`reveal ${className}`} {...rest}>{children}</Tag>;
}

// ─── nav ────────────────────────────────────────────────────────────

function Nav() {
  const scroll = (id) => (e) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.offsetTop - 60, behavior: "smooth" });
  };
  return (
    <nav className="nav">
      <div className="wrap nav-inner">
        <div className="nav-links">
          <a href="#about" onClick={scroll("about")}>O nas</a>
          <a href="#menu"  onClick={scroll("menu")}>Karta</a>
          <a href="#gallery" onClick={scroll("gallery")}>Galeria</a>
        </div>
        <div className="nav-logo">Nemesis</div>
        <div className="nav-links right">
          <a href="#press" onClick={scroll("press")}>Prasa</a>
          <a href="#contact" onClick={scroll("contact")}>Kontakt</a>
          <a href="#reserve" onClick={scroll("reserve")} className="nav-cta">Rezerwuj</a>
        </div>
      </div>
    </nav>
  );
}

// ─── hero ───────────────────────────────────────────────────────────

function Hero() {
  return (
    <header className="hero">
      <span className="hero-est">Est. MMXXII · Trattoria & Bar</span>
      <span className="hero-loc">ul. Mokotowska 03 · Warszawa</span>

      <Reveal className="wrap">
        <div className="hero-eyebrow eyebrow">
          <span>Trattoria</span><span className="dot"></span>
          <span>Bar</span><span className="dot"></span>
          <span>Spotkania</span>
        </div>
        <h1 className="hero-title">
          Nem<span className="italic">e</span>sis
        </h1>
        <p className="hero-sub">
          Kuchnia bez pośpiechu,&nbsp;wino bez ceremonii,<br />
          wieczory, które chce się pamiętać.
        </p>
        <div className="hero-meta">
          <span>śr–nd</span>
          <span className="sep">·</span>
          <span>17:00 — 24:00</span>
          <span className="sep">·</span>
          <span>+48 22 408 11 02</span>
        </div>
      </Reveal>

      <Marquee />
    </header>
  );
}

function Marquee() {
  const items = [
    "Karta zimowa MMXXVI",
    "Tagliatelle al ragù",
    "Negroni godziny 17—19",
    "Menu degustacyjne · 7 dań",
    "Wina naturalne, 120 etykiet",
    "Live jazz · piątki",
    "Patio od kwietnia",
  ];
  const row = (
    <div className="marquee-track">
      {[...items, ...items].map((t, i) => (
        <React.Fragment key={i}>
          <span>{t}</span>
          <span className="glyph">✦</span>
        </React.Fragment>
      ))}
    </div>
  );
  return <div className="marquee">{row}</div>;
}

// ─── about ──────────────────────────────────────────────────────────

function About() {
  return (
    <section id="about" className="section">
      <div className="wrap">
        <Reveal className="section-head">
          <h2><em>O nas</em></h2>
          <span className="num">— I —</span>
        </Reveal>

        <div className="about-grid">
          <Reveal className="about-body">
            <p className="lead">
              Nemesis to mała trattoria na warszawskiej Mokotowskiej, prowadzona od MMXXII roku
              przez Joannę Wrońską i&nbsp;Tomasza Kalitę. Codziennie gotujemy z tego, co tego
              poranka przyjechało z&nbsp;Hali Banacha, od&nbsp;rybaków z&nbsp;Helu i&nbsp;od&nbsp;naszych
              dostawców z&nbsp;Mazowsza.
            </p>
            <p>
              W&nbsp;karcie znajdziesz klasyki północnych Włoch — tagliatelle al ragù, vitello
              tonnato, risotto z karczochami — przygotowywane bez skrótów, ze szczerą zazdrością
              o&nbsp;składniki. Czternaście stolików, jedna otwarta kuchnia, sto dwadzieścia
              etykiet wina od&nbsp;Piemontu po Loarę.
            </p>
            <p>
              Nazwa Nemesis to drobny żart — bogini, która przywraca równowagę.
              Przy stole stara się o&nbsp;to każdy talerz i&nbsp;każdy kieliszek.
            </p>

            <div className="about-pull">
              „Najlepsza włoska kolacja, jaką jadłem w stolicy w tym roku.”
              <small>— Gazeta Wyborcza, listopad 2025</small>
            </div>
          </Reveal>

          <Reveal>
            <div className="about-image">
              <Placeholder tag="[ portret · szefowie kuchni ]" />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ─── menu ───────────────────────────────────────────────────────────

function Menu() {
  const [active, setActive] = useState(null); // null = wszystko
  const cats = active ? [active] : TABS.map((t) => t.id);

  return (
    <section id="menu" className="section" style={{ background: "var(--bg-2)" }}>
      <div className="wrap">
        <Reveal className="section-head">
          <h2><em>Karta</em></h2>
          <span className="num">— II —</span>
        </Reveal>

        <Reveal>
          <div className="menu-tabs">
            <button
              className={`menu-tab ${active === null ? "active" : ""}`}
              onClick={() => setActive(null)}
            >Wszystko</button>
            {TABS.map((t) => (
              <button key={t.id}
                className={`menu-tab ${active === t.id ? "active" : ""}`}
                onClick={() => setActive(t.id)}
              >{t.label}</button>
            ))}
          </div>
        </Reveal>

        <Reveal>
          <Ornament />
          <div style={{ height: 28 }} />
          <div className="menu-grid">
            {cats.map((cid) => {
              const cat = MENU[cid];
              return (
                <div className="menu-cat" key={cid}>
                  <h3 className="menu-cat-title">{cat.title}</h3>
                  <div className="menu-cat-sub">{cat.sub}</div>
                  {cat.items.map((it) => (
                    <div className="menu-item" key={it.name}>
                      <div className="menu-name">{it.name}</div>
                      <div className="menu-price">{it.price}</div>
                      <div className="menu-desc">{it.desc}</div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </Reveal>

        <Reveal>
          <div style={{ textAlign: "center", marginTop: 60 }}>
            <Ornament glyph="⁂" />
            <div className="eyebrow" style={{ marginTop: 18 }}>
              Menu degustacyjne · 7 dań · 320 zł od osoby
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─── gallery ────────────────────────────────────────────────────────

function Gallery() {
  return (
    <section id="gallery" className="section">
      <div className="wrap">
        <Reveal className="section-head">
          <h2><em>Galeria</em></h2>
          <span className="num">— III —</span>
        </Reveal>

        <Reveal>
          <div className="gallery">
            {GALLERY.map((g, i) => (
              <Placeholder key={i} tag={`[ ${g.tag} ]`} className={g.cls} />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─── press ──────────────────────────────────────────────────────────

function Press() {
  return (
    <section id="press" className="section" style={{ background: "var(--bg-2)" }}>
      <div className="wrap">
        <Reveal className="section-head">
          <h2><em>Prasa</em></h2>
          <span className="num">— IV —</span>
        </Reveal>

        <Reveal className="press-hero">
          <div className="press-stars">✦ ✦ ✦ ✦ ✦</div>
          <blockquote>{PRESS[0].quote}</blockquote>
          <cite>{PRESS[0].source}</cite>
        </Reveal>

        <Reveal>
          <div className="press-grid">
            {PRESS.slice(1).map((p, i) => (
              <div className="press-card" key={i}>
                <div className="press-stars">✦ ✦ ✦ ✦ ✦</div>
                „{p.quote}”
                <cite>— {p.source}</cite>
              </div>
            ))}
            <div className="press-card">
              <div className="press-stars">✦ ✦ ✦ ✦ ✦</div>
              „Warszawska klasyka nowego pokolenia — bez krzyku, bez pozy. Tylko smak.”
              <cite>— Wprost</cite>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─── reservation ────────────────────────────────────────────────────

function Reservation() {
  const [form, setForm] = useState({
    date: "", time: "19:30", party: 2, name: "", phone: "", email: "", notes: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const valid = form.date && form.time && form.name && form.phone;

  const onSubmit = (e) => {
    e.preventDefault();
    if (valid) setSubmitted(true);
  };

  const times = [];
  for (let h = 17; h <= 22; h++) {
    times.push(`${String(h).padStart(2,"0")}:00`);
    times.push(`${String(h).padStart(2,"0")}:30`);
  }

  // default date = today
  const today = useMemo(() => {
    const d = new Date();
    return d.toISOString().slice(0,10);
  }, []);

  return (
    <section id="reserve" className="reserve section">
      <div className="wrap">
        <Reveal className="section-head">
          <h2><em>Rezerwacja</em></h2>
          <span className="num">— V —</span>
        </Reveal>

        <div className="reserve-grid">
          <Reveal className="reserve-aside">
            <p>
              Rezerwacje przyjmujemy na ten sam dzień oraz do <em>sześćdziesięciu</em> dni
              naprzód. Dla grup powyżej ośmiu osób prosimy o kontakt telefoniczny.
            </p>
            <p>
              Stolik utrzymujemy <em>piętnaście minut</em> od godziny rezerwacji.
              W razie spóźnienia — zawsze odbierzemy telefon.
            </p>
            <div className="reserve-hours">
              <div><b>Środa — Czwartek</b> &nbsp; 17:00 — 23:00</div>
              <div><b>Piątek — Sobota</b> &nbsp; 17:00 — 24:00</div>
              <div><b>Niedziela</b> &nbsp; 14:00 — 22:00</div>
              <div><b>Poniedziałek — Wtorek</b> &nbsp; zamknięte</div>
            </div>
          </Reveal>

          <Reveal>
            <form className="reserve-card" onSubmit={onSubmit}>
              {!submitted ? (
                <>
                  <h3>Zarezerwuj stolik</h3>
                  <div className="sub">— przy świetle świec —</div>

                  <div className="field-row">
                    <div className="field">
                      <label>Data</label>
                      <input type="date" required min={today}
                             value={form.date || today}
                             onChange={set("date")} />
                    </div>
                    <div className="field">
                      <label>Godzina</label>
                      <select value={form.time} onChange={set("time")}>
                        {times.map((t) => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="field">
                    <label>Liczba osób</label>
                    <div className="steppers">
                      <button type="button" onClick={() => setForm((f) => ({...f, party: Math.max(1, f.party - 1)}))}>−</button>
                      <span className="val">{form.party}</span>
                      <button type="button" onClick={() => setForm((f) => ({...f, party: Math.min(12, f.party + 1)}))}>+</button>
                      <span className="eyebrow" style={{ marginLeft: 8 }}>
                        {form.party === 1 ? "osoba" : form.party < 5 ? "osoby" : "osób"}
                      </span>
                    </div>
                  </div>

                  <div className="field">
                    <label>Imię i nazwisko</label>
                    <input type="text" required value={form.name} onChange={set("name")}
                           placeholder="Jan Kowalski" />
                  </div>

                  <div className="field-row">
                    <div className="field">
                      <label>Telefon</label>
                      <input type="tel" required value={form.phone} onChange={set("phone")}
                             placeholder="+48 600 000 000" />
                    </div>
                    <div className="field">
                      <label>E-mail</label>
                      <input type="email" value={form.email} onChange={set("email")}
                             placeholder="jan@kowalski.pl" />
                    </div>
                  </div>

                  <div className="field">
                    <label>Życzenia szczególne</label>
                    <textarea value={form.notes} onChange={set("notes")}
                              placeholder="urodziny, alergie, stolik przy oknie…" />
                  </div>

                  <button type="submit" className="submit" disabled={!valid}>
                    Zarezerwuj
                  </button>
                </>
              ) : (
                <div className="reserve-confirm">
                  <Ornament glyph="⁂" />
                  <h3><em>Do zobaczenia.</em></h3>
                  <p>
                    Dziękujemy, {form.name.split(" ")[0] || "Państwo"}.<br />
                    Stolik dla {form.party} {form.party === 1 ? "osoby" : "osób"} na{" "}
                    {form.date || today}, godz. {form.time}.<br />
                    Potwierdzenie wysłaliśmy SMS-em.
                  </p>
                  <button className="submit" style={{ marginTop: 30 }}
                          onClick={() => setSubmitted(false)}>
                    Nowa rezerwacja
                  </button>
                </div>
              )}
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ─── newsletter ─────────────────────────────────────────────────────

function Newsletter() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  return (
    <section className="section news">
      <div className="wrap">
        <Reveal>
          <div className="eyebrow" style={{ marginBottom: 24 }}>Listownie</div>
          <h2 style={{ fontFamily: "var(--f-display)", fontStyle: "italic",
            fontSize: "clamp(48px,7vw,86px)", margin: 0, lineHeight: .95 }}>
            <em>Sześć listów rocznie.</em>
          </h2>
          <p className="lede">
            Nowa karta, kameralne kolacje degustacyjne, kilka stolików,
            które trzymamy dla czytelników. Bez spamu, bez wyjątku.
          </p>

          {!sent ? (
            <form className="news-form" onSubmit={(e) => { e.preventDefault(); if (email) setSent(true); }}>
              <input type="email" required placeholder="adres e-mail"
                     value={email} onChange={(e) => setEmail(e.target.value)} />
              <button type="submit">Subskrybuj →</button>
            </form>
          ) : (
            <div className="lede" style={{ color: "var(--gold-2)" }}>
              ⁂&nbsp;&nbsp;Dziękujemy. Pierwsza wiadomość — w piątek.
            </div>
          )}

          <div className="small">Anulujesz jednym kliknięciem.</div>
        </Reveal>
      </div>
    </section>
  );
}

// ─── footer ─────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer id="contact" className="foot">
      <div className="wrap">
        <div className="foot-grid">
          <div>
            <div className="foot-logo"><em>Nemesis</em></div>
            <div className="foot-tag">Trattoria · Bar</div>
            <p>
              ul. Mokotowska 03<br />
              00-561 Warszawa<br />
              Mokotów
            </p>
          </div>
          <div>
            <h4>Godziny</h4>
            <ul>
              <li>śr — czw &nbsp; 17—23</li>
              <li>pt — sb &nbsp; 17—24</li>
              <li>niedz &nbsp; 14—22</li>
              <li>pn — wt &nbsp; zamknięte</li>
            </ul>
          </div>
          <div>
            <h4>Kontakt</h4>
            <ul>
              <li>+48 22 408 11 02</li>
              <li>kontakt@nemesis.pl</li>
              <li>prasa@nemesis.pl</li>
              <li>catering@nemesis.pl</li>
            </ul>
          </div>
          <div>
            <h4>Sieci</h4>
            <ul>
              <li><a href="#">Instagram</a></li>
              <li><a href="#">Facebook</a></li>
              <li><a href="#">The Fork</a></li>
              <li><a href="#">Google Maps</a></li>
            </ul>
          </div>
        </div>

        <div className="foot-bottom">
          <span>© MMXXVI · Restauracja Nemesis · wszelkie prawa zastrzeżone</span>
          <span>Polityka prywatności · Karta podarunkowa</span>
          <span className="spin" style={{ display: "inline-block", color: "var(--gold)" }}>✦</span>
        </div>
      </div>
    </footer>
  );
}

// ─── app shell with tweaks ──────────────────────────────────────────

const FONT_PAIRS = [
  { value: "bodoni",   label: "Bodoni" },
  { value: "playfair", label: "Playfair" },
  { value: "dmserif",  label: "DM Serif" },
];

function App() {
  const [t, setTweak] = useTweaks(window.TWEAK_DEFAULTS);

  // apply body classes for dark/light + font pair + animations
  useEffect(() => {
    const b = document.body;
    b.classList.toggle("day", !t.dark);
    b.classList.toggle("anim-off", !t.animations);
    ["fp-bodoni", "fp-playfair", "fp-dmserif"].forEach((c) => b.classList.remove(c));
    b.classList.add(`fp-${t.fontPair}`);
  }, [t.dark, t.animations, t.fontPair]);

  return (
    <>
      <Nav />
      <Hero />
      <About />
      <Menu />
      <Gallery />
      <Press />
      <Reservation />
      <Newsletter />
      <Footer />

      <TweaksPanel title="Tweaks · Nemesis">
        <TweakSection label="Atmosfera" />
        <TweakToggle label="Tryb nocny"
          value={t.dark} onChange={(v) => setTweak("dark", v)} />
        <TweakToggle label="Animacje"
          value={t.animations} onChange={(v) => setTweak("animations", v)} />

        <TweakSection label="Typografia" />
        <TweakRadio label="Para fontów" value={t.fontPair}
          options={FONT_PAIRS} onChange={(v) => setTweak("fontPair", v)} />
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
