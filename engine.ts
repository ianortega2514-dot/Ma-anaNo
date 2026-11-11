import type { Answers, DocDef, Level, Tramite } from "@/data/types";

export type Verdict = {
  level: Level;
  headline: string;
  reason: string;
  missing: DocDef[];
  ready: DocDef[];
  applicable: DocDef[];
  blocked: boolean;
};

export function applicableDocs(tramite: Tramite, answers: Answers) {
  return tramite.docs.filter((doc) => (doc.when ? doc.when(answers) : true));
}

export function isBlocking(doc: DocDef, answers: Answers) {
  if (doc.blocking === undefined) return true;
  if (typeof doc.blocking === "function") return doc.blocking(answers);
  return doc.blocking;
}

export function verdict(tramite: Tramite, answers: Answers, have: Record<string, boolean>): Verdict {
  const stop = tramite.hardStop?.(answers) ?? null;
  const applicable = applicableDocs(tramite, answers);
  const missing = applicable.filter((doc) => !have[doc.id]);
  const ready = applicable.filter((doc) => have[doc.id]);
  const blockingMissing = missing.filter((doc) => isBlocking(doc, answers));

  if (stop) {
    return {
      level: stop.level,
      headline: stop.headline,
      reason: stop.reason,
      missing,
      ready,
      applicable,
      blocked: true,
    };
  }

  if (blockingMissing.length === 0) {
    return {
      level: "go",
      headline: tramite.goHeadline,
      reason:
        tramite.readyNote?.(answers) ??
        (missing.length
          ? "Lo que de verdad piden ya lo marcas. Lo que queda es útil, no es motivo para devolverte."
          : "Con lo que marcas, este expediente está completo."),
      missing,
      ready,
      applicable,
      blocked: false,
    };
  }

  if (blockingMissing.length === 1) {
    const one = blockingMissing[0];
    return {
      level: "almost",
      headline: "Te falta una cosa",
      reason: `Sin «${one.label}» es fácil que te hagan volver. Consíguelo antes de pedir cita o de ir.`,
      missing,
      ready,
      applicable,
      blocked: false,
    };
  }

  return {
    level: "back",
    headline: "Te devuelven",
    reason: `Faltan ${blockingMissing.length} cosas que la ventanilla suele exigir. Ir ahora es gastar la cita.`,
    missing,
    ready,
    applicable,
    blocked: false,
  };
}

export function caseSummary(tramite: Tramite, answers: Answers) {
  return tramite.questions
    .filter((question) => answers[question.id] && (!question.when || question.when(answers)))
    .map((question) => question.options.find((option) => option.id === answers[question.id])?.label)
    .filter((label): label is string => Boolean(label))
    .join(" · ");
}
