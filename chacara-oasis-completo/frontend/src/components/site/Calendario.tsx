import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getDailyStatus, type DailyStatus } from "@/lib/api";

const MESES = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
const DIAS = ["D", "S", "T", "Q", "Q", "S", "S"];
const iso = (y: number, m: number, d: number) => `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
const monthStart = (y: number, m: number) => iso(y, m, 1);
const monthEnd = (y: number, m: number) => iso(y, m, new Date(y, m + 1, 0).getDate());

type Props = { inicio: string; fim: string; onChange: (inicio: string, fim: string) => void };

export function Calendario({ inicio, fim, onChange }: Props) {
  const hoje = new Date();
  const hojeIso = iso(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
  const [ref, setRef] = useState({ ano: hoje.getFullYear(), mes: hoje.getMonth() });
  const [status, setStatus] = useState<Record<string, DailyStatus["status"]>>({});
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    let ativo = true;
    setCarregando(true);
    getDailyStatus(monthStart(ref.ano, ref.mes), monthEnd(ref.ano, ref.mes))
      .then((items) => {
        if (!ativo) return;
        setStatus(Object.fromEntries(items.map((item) => [item.date, item.status])));
      })
      .catch(() => {
        if (ativo) setStatus({});
      })
      .finally(() => ativo && setCarregando(false));
    return () => { ativo = false; };
  }, [ref.ano, ref.mes]);

  const dias = useMemo(() => {
    const primeiro = new Date(ref.ano, ref.mes, 1).getDay();
    const total = new Date(ref.ano, ref.mes + 1, 0).getDate();
    const celulas: (number | null)[] = Array.from({ length: primeiro }, () => null);
    for (let d = 1; d <= total; d++) celulas.push(d);
    return celulas;
  }, [ref]);

  const mover = (delta: number) => {
    const d = new Date(ref.ano, ref.mes + delta, 1);
    setRef({ ano: d.getFullYear(), mes: d.getMonth() });
  };

  const selecionar = (valor: string) => {
    if (status[valor] && status[valor] !== "LIVRE") return;
    if (!inicio || (inicio && fim)) return onChange(valor, "");
    if (valor < inicio) return onChange(valor, "");
    onChange(inicio, valor);
  };

  return (
    <div className="rounded-3xl border border-border bg-card p-4 sm:p-6 card-soft">
      <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2">
        <button type="button" aria-label="Mês anterior" onClick={() => mover(-1)} className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-secondary text-secondary-foreground"><ChevronLeft className="h-4 w-4" /></button>
        <p className="truncate text-center font-display text-lg font-semibold">{MESES[ref.mes]} {ref.ano}</p>
        <button type="button" aria-label="Próximo mês" onClick={() => mover(1)} className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-secondary text-secondary-foreground"><ChevronRight className="h-4 w-4" /></button>
      </div>
      <div className="mt-4 grid grid-cols-7 gap-1 text-center text-xs font-semibold text-muted-foreground">{DIAS.map((d, i) => <span key={i} className="py-1">{d}</span>)}</div>
      <div className="mt-1 grid grid-cols-7 gap-1">
        {dias.map((d, i) => {
          if (d === null) return <span key={`v-${i}`} />;
          const valor = iso(ref.ano, ref.mes, d);
          const passado = valor < hojeIso;
          const indisponivel = status[valor] === "OCUPADA" || status[valor] === "BLOQUEADA";
          const selecionado = valor === inicio || valor === fim;
          const intervalo = Boolean(inicio && fim && valor > inicio && valor < fim);
          const bloqueado = passado || indisponivel;
          return <button key={valor} type="button" disabled={bloqueado} onClick={() => selecionar(valor)} title={indisponivel ? "Data indisponível" : undefined} className={["aspect-square rounded-xl text-sm font-medium transition-colors", bloqueado ? "cursor-not-allowed text-muted-foreground/50 line-through" : "hover:bg-secondary", indisponivel && !passado ? "bg-destructive/10 text-destructive/70 no-underline" : "", intervalo ? "bg-agua/40 text-agua-foreground" : "", selecionado ? "bg-primary text-primary-foreground hover:bg-primary" : ""].join(" ")}>{d}</button>;
        })}
      </div>
      <div className="mt-5 flex flex-wrap gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-primary" /> Selecionado</span>
        <span className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-destructive/30" /> Indisponível</span>
        <span className="flex items-center gap-2"><span className="h-3 w-3 rounded-full border border-border bg-card" /> Livre</span>
        {carregando && <span>Atualizando disponibilidade…</span>}
      </div>
    </div>
  );
}
