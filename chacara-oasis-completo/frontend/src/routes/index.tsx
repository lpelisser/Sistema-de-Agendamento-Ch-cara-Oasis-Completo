import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowDown,
  BedDouble,
  Car,
  Dices,
  Flame,
  Instagram,
  Mail,
  MapPin,
  MessageCircle,
  MoonStar,
  PawPrint,
  Phone,
  Trees,
  Volleyball,
  Waves,
} from "lucide-react";
import { Header } from "@/components/site/Header";
import { FormReserva } from "@/components/site/FormReserva";
import { EMAIL, ENDERECO, NAV, TELEFONE, WHATSAPP } from "@/components/site/data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Chácara Oasis — Aluguel em Araçariguama" },
      {
        name: "description",
        content:
          "Chácara Oasis em Araçariguama: piscina, área de churrasco, acomodações e lazer. Consulte datas e faça sua pré-reserva.",
      },
      { property: "og:title", content: "Chácara Oasis — Seu refúgio na natureza" },
      {
        property: "og:description",
        content:
          "Chácara para eventos e lazer em Araçariguama, com acomodações para até 20 pessoas.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const ESTRUTURA = [
  { icon: Waves, titulo: "Piscina", texto: "Um espaço refrescante para aproveitar os dias de sol." },
  { icon: Flame, titulo: "Área de churrasco", texto: "Ambiente para preparar refeições e reunir todo mundo." },
  { icon: BedDouble, titulo: "Acomodações", texto: "Pernoite confortável para grupos de até 20 pessoas." },
  { icon: Dices, titulo: "Salão de jogos", texto: "Diversão para completar os momentos de lazer." },
  { icon: Trees, titulo: "Área verde", texto: "Natureza ao redor para descansar e respirar novos ares." },
  { icon: Volleyball, titulo: "Área recreativa", texto: "Espaço aberto para brincar e aproveitar em grupo." },
];

const POSTS_INSTAGRAM = [
  { codigo: "DQvGpbMEcbr", rotulo: "Conheça a chácara" },
  { codigo: "DFL54O3JlVj", rotulo: "Momentos na Oasis" },
  { codigo: "DBQxpdbuFH0p8j18hYKFxsmwbW9HGxT7yB6LHo0", rotulo: "Espaços de lazer" },
  { codigo: "C_oCk8apw7-", rotulo: "Área externa" },
  { codigo: "C8PnPVrAe85", rotulo: "Detalhes do ambiente" },
  { codigo: "C7c644lNvLr", rotulo: "Natureza e descanso" },
];

function Index() {
  const [inicio, setInicio] = useState("");
  const [fim, setFim] = useState("");
  const [pessoas, setPessoas] = useState("");

  const setDatas = (i: string, f: string) => {
    setInicio(i);
    setFim(f);
  };

  const irParaReservas = () => {
    document.getElementById("reservas")?.scrollIntoView({ behavior: "smooth" });
  };

  const campoHero =
    "w-full rounded-lg border border-input bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/30";

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section id="inicio" className="relative min-h-[94vh] overflow-hidden bg-primary text-primary-foreground">
        <div className="absolute inset-0 oasis-grid opacity-60" />
        <div className="absolute -right-24 top-24 h-72 w-72 rounded-full border-[42px] border-accent/70 sm:h-96 sm:w-96" />
        <div className="absolute -bottom-32 right-[28%] h-64 w-64 rounded-full border-[32px] border-sol/80" />
        <div className="relative mx-auto flex min-h-[94vh] max-w-7xl flex-col justify-center px-4 pb-20 pt-32 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-primary-foreground/75">
            Araçariguama · São Paulo
          </p>
          <h1 className="mt-5 max-w-4xl text-5xl leading-[1.02] sm:text-6xl lg:text-8xl">
            Chácara <span className="text-sol">Oasis</span>
          </h1>
          <p className="mt-5 max-w-2xl font-display text-2xl leading-snug sm:text-3xl">
            Seu refúgio perfeito para momentos inesquecíveis em meio à natureza.
          </p>
          <p className="mt-5 max-w-xl text-sm leading-relaxed text-primary-foreground/75 sm:text-base">
            Piscina, área de churrasco, acomodações, salão de jogos e espaço ao ar livre para reunir quem importa.
          </p>

          <div className="mt-10 w-full max-w-4xl border-l-4 border-sol bg-background p-4 text-foreground sm:p-5 card-soft">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <label className="text-xs font-semibold text-muted-foreground">
                Data de entrada
                <input type="date" value={inicio} onChange={(e) => setInicio(e.target.value)} className={`${campoHero} mt-1`} />
              </label>
              <label className="text-xs font-semibold text-muted-foreground">
                Data de saída
                <input type="date" value={fim} onChange={(e) => setFim(e.target.value)} className={`${campoHero} mt-1`} />
              </label>
              <label className="text-xs font-semibold text-muted-foreground">
                Pessoas
                <input type="number" min={1} placeholder="Ex: 20" value={pessoas} onChange={(e) => setPessoas(e.target.value)} className={`${campoHero} mt-1`} />
              </label>
              <button type="button" onClick={irParaReservas} className="mt-1 self-end rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02] sm:mt-0">
                Consultar datas
              </button>
            </div>
          </div>
          <a href="#sobre" aria-label="Conhecer a chácara" className="mt-9 inline-flex w-fit items-center gap-2 text-sm font-semibold text-primary-foreground/80">
            Conheça o espaço <ArrowDown className="h-4 w-4" />
          </a>
        </div>
      </section>

      <section id="sobre" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-28">
        <div className="grid items-start gap-12 lg:grid-cols-[0.72fr_1.28fr]">
          <div className="border-t-4 border-accent pt-5">
            <span className="font-display text-8xl leading-none text-primary/10 sm:text-9xl">O</span>
            <p className="-mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Um lugar para desacelerar, celebrar e aproveitar dias inteiros cercado de verde.
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-folha">A Chácara</p>
            <h2 className="mt-3 max-w-2xl text-3xl sm:text-5xl">Conforto, lazer e natureza no mesmo lugar</h2>
            <p className="mt-6 max-w-2xl text-muted-foreground">
              A Chácara Oasis fica no Condomínio Real Village, em Araçariguama. O espaço reúne ambientes de lazer e descanso para famílias, amigos e celebrações especiais.
            </p>
            <dl className="mt-10 grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-3">
              {[
                ["20 pessoas", "limite para dormir"],
                ["Araçariguama", "interior de São Paulo"],
                ["Sem animais", "não é permitida a entrada"],
              ].map(([n, t]) => (
                <div key={t} className="bg-background p-5">
                  <dt className="font-display text-2xl font-semibold text-primary">{n}</dt>
                  <dd className="mt-1 text-xs uppercase tracking-wide text-muted-foreground">{t}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section id="estrutura" className="bg-areia py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-folha">Estrutura</p>
              <h2 className="mt-3 text-3xl sm:text-5xl">Espaço para viver o dia inteiro</h2>
            </div>
            <span className="font-display text-6xl text-primary/15">01—06</span>
          </div>
          <div className="mt-10 grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
            {ESTRUTURA.map(({ icon: Icon, titulo, texto }, index) => (
              <article key={titulo} className="group min-h-56 bg-card p-6 transition-colors hover:bg-secondary/50">
                <div className="flex items-start justify-between">
                  <Icon className="h-7 w-7 text-primary" />
                  <span className="text-xs font-semibold text-muted-foreground">0{index + 1}</span>
                </div>
                <h3 className="mt-12 text-xl">{titulo}</h3>
                <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">{texto}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-primary py-12 text-primary-foreground">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 md:grid-cols-2">
          <div className="flex items-center gap-5">
            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-primary-foreground/10"><MoonStar className="h-6 w-6 text-sol" /></span>
            <div><p className="font-display text-xl">Pernoite para até 20 pessoas</p><p className="mt-1 text-sm text-primary-foreground/70">Informe a quantidade de hóspedes na solicitação.</p></div>
          </div>
          <div className="flex items-center gap-5">
            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-primary-foreground/10"><PawPrint className="h-6 w-6 text-sol" /></span>
            <div><p className="font-display text-xl">Não é permitida a entrada de animais</p><p className="mt-1 text-sm text-primary-foreground/70">Considere esta condição ao planejar sua estadia.</p></div>
          </div>
        </div>
      </section>

      <section id="ambientes" className="bg-background py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-folha">Ambientes reais</p>
              <h2 className="mt-3 text-3xl sm:text-5xl">Veja a Chácara Oasis</h2>
              <p className="mt-4 text-muted-foreground">Publicações do perfil oficial mostram os espaços e detalhes da chácara.</p>
            </div>
            <a href="https://www.instagram.com/chacara_oasis_oficial/" target="_blank" rel="noreferrer" className="inline-flex w-fit items-center gap-2 rounded-lg border border-border px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-secondary">
              <Instagram className="h-4 w-4" /> Ver perfil completo
            </a>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {POSTS_INSTAGRAM.map(({ codigo, rotulo }, index) => (
              <a
                key={codigo}
                href={`https://www.instagram.com/p/${codigo}/`}
                target="_blank"
                rel="noreferrer"
                className="group relative flex aspect-[4/5] flex-col justify-between overflow-hidden border border-primary/15 bg-primary p-6 text-primary-foreground card-soft"
              >
                <div className="absolute inset-0 oasis-grid opacity-50" />
                <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full border-[22px] border-accent/70 transition-transform duration-500 group-hover:scale-110" />
                <div className="relative flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-[0.25em] text-primary-foreground/70">Post 0{index + 1}</span>
                  <Instagram className="h-5 w-5 text-sol" />
                </div>
                <div className="relative">
                  <p className="font-display text-3xl">{rotulo}</p>
                  <p className="mt-3 text-sm text-primary-foreground/70">Abrir foto no Instagram</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section id="reservas" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-28">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-folha">Agendamento</p>
          <h2 className="mt-3 text-3xl sm:text-5xl">Consulte a disponibilidade</h2>
          <p className="mt-4 text-muted-foreground">Escolha as datas, preencha seus dados e envie a solicitação pelo WhatsApp ou e-mail.</p>
        </div>
        <div className="mt-10"><FormReserva inicio={inicio} fim={fim} pessoas={pessoas} setDatas={setDatas} setPessoas={setPessoas} /></div>
      </section>

      <section id="contato" className="bg-areia py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-folha">Como chegar</p>
          <h2 className="mt-3 text-3xl sm:text-5xl">Chácara Oasis em Araçariguama</h2>
          <div className="mt-10 grid gap-8 lg:grid-cols-[1.25fr_0.75fr]">
            <div className="overflow-hidden border border-border card-soft">
              <iframe title="Mapa da Chácara Oasis em Araçariguama - SP" src="https://www.google.com/maps?q=Estrada%20de%20Aparecedinha%2C%20811%20-%20Cruz%20das%20Almas%2C%20Ara%C3%A7ariguama%20-%20SP%2C%2018147-000&output=embed" loading="lazy" className="h-96 w-full lg:h-full" />
            </div>
            <div className="grid gap-px bg-border">
              {[
                { icon: MapPin, titulo: "Endereço", texto: ENDERECO },
                { icon: Car, titulo: "Localização", texto: "Condomínio Real Village, Araçariguama - SP." },
                { icon: Phone, titulo: "Telefone / WhatsApp", texto: TELEFONE },
                { icon: Mail, titulo: "E-mail", texto: EMAIL },
              ].map(({ icon: Icon, titulo, texto }) => (
                <div key={titulo} className="flex gap-4 bg-card p-5">
                  <Icon className="mt-1 h-5 w-5 shrink-0 text-primary" />
                  <div className="min-w-0"><p className="font-semibold">{titulo}</p><p className="mt-1 break-words text-sm text-muted-foreground">{texto}</p></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-primary py-14 text-primary-foreground">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <p className="font-display text-3xl font-semibold">Chácara Oasis</p>
            <p className="mt-3 max-w-sm text-sm opacity-75">Seu refúgio para momentos inesquecíveis em meio à natureza, em Araçariguama - SP.</p>
            <div className="mt-5 flex gap-3">
              <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noreferrer" aria-label="WhatsApp" className="grid h-10 w-10 place-items-center rounded-full bg-primary-foreground/10 transition-colors hover:bg-primary-foreground/20"><MessageCircle className="h-5 w-5" /></a>
              <a href="https://www.instagram.com/chacara_oasis_oficial/" target="_blank" rel="noreferrer" aria-label="Instagram da Chácara Oasis" className="grid h-10 w-10 place-items-center rounded-full bg-primary-foreground/10 transition-colors hover:bg-primary-foreground/20"><Instagram className="h-5 w-5" /></a>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide">Navegação</p>
            <ul className="mt-4 space-y-2 text-sm opacity-80">{NAV.map((n) => <li key={n.href}><a href={n.href} className="hover:underline">{n.label}</a></li>)}</ul>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide">Contato</p>
            <ul className="mt-4 space-y-2 text-sm opacity-80"><li>{TELEFONE}</li><li>{EMAIL}</li><li>{ENDERECO}</li></ul>
          </div>
        </div>
        <div className="mx-auto mt-10 max-w-7xl border-t border-primary-foreground/20 px-4 pt-6 text-xs opacity-70 sm:px-6">© {new Date().getFullYear()} Chácara Oasis. Todos os direitos reservados.</div>
      </footer>

      <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noreferrer" aria-label="Falar no WhatsApp" className="fixed bottom-5 right-5 z-50 grid h-14 w-14 place-items-center rounded-full bg-folha text-primary-foreground shadow-lg transition-transform hover:scale-105"><MessageCircle className="h-6 w-6" /></a>
    </div>
  );
}
