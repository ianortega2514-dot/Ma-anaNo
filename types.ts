export type Level = "go" | "almost" | "back";
export type Answers = Record<string, string>;
export type Fit = "best" | "ok" | "no";

export type Question = {
  id: string;
  prompt: string;
  hint?: string;
  when?: (a: Answers) => boolean;
  options: { id: string; label: string; detail?: string }[];
};

export type DocDef = {
  id: string;
  label: string;
  why: string;
  when?: (a: Answers) => boolean;
  /** Defaults to true. False = useful, but they should not send you home for it. */
  blocking?: boolean | ((a: Answers) => boolean);
};

export type Channel = {
  title: string;
  where: string;
  time: string;
  note: string;
  fit: (a: Answers) => Fit;
};

export type Tramite = {
  id: string;
  name: string;
  short: string;
  blurb: string;
  organism: string;
  fee: string;
  plazo: string;
  tags: string[];
  officialUrl?: string;
  officialLabel?: string;
  questions: Question[];
  docs: DocDef[];
  online: Channel;
  desk: Channel;
  steps: { title: string; detail: string }[];
  rejections: { title: string; detail: string }[];
  script: (a: Answers) => string[];
  warnings: (a: Answers) => string[];
  hardStop?: (a: Answers) => { level: Level; headline: string; reason: string } | null;
  readyNote?: (a: Answers) => string | null;
  goHeadline: string;
};
