"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { ArrowUpRight, Send, X } from "lucide-react";
import gsap from "gsap";
import { FAQ, WELCOME, getReply } from "./faq";
import type { ChatLink } from "./faq";

const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

interface Message {
  id: number;
  from: "bot" | "user";
  text: string;
  links?: ChatLink[];
}

const linkClass =
  "inline-flex items-center gap-1.5 border border-black px-3 py-1.5 text-xs font-bold text-black transition-colors hover:bg-black hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D80005]";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [typing, setTyping] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([{ id: 0, from: "bot", text: WELCOME }]);
  const idRef = useRef(1);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);

  const reduceMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const toggle = () => {
    if (!open) {
      setMounted(true);
      setHasOpened(true);
    }
    setShowHint(false);
    setOpen((o) => !o);
  };

  const close = () => {
    setOpen(false);
    launcherRef.current?.focus();
  };

  // Launcher entrance, then a small hint label
  useEffect(() => {
    const launcher = launcherRef.current;
    if (!launcher || reduceMotion()) return;
    const tween = gsap.fromTo(
      launcher,
      { scale: 0 },
      { scale: 1, duration: 0.7, delay: 1.2, ease: "back.out(2)", clearProps: "transform" }
    );
    return () => {
      tween.kill();
      gsap.set(launcher, { clearProps: "transform" });
    };
  }, []);

  useEffect(() => {
    const show = setTimeout(() => setShowHint(true), 3500);
    const hide = setTimeout(() => setShowHint(false), 12000);
    return () => {
      clearTimeout(show);
      clearTimeout(hide);
    };
  }, []);

  useIsoLayoutEffect(() => {
    const hint = hintRef.current;
    if (showHint && hint && !reduceMotion()) {
      gsap.fromTo(hint, { x: 20, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5, ease: "power3.out" });
    }
  }, [showHint]);

  // Open / close animation of the chat window
  useIsoLayoutEffect(() => {
    const panel = panelRef.current;
    if (!mounted || !panel) return;
    const reduce = reduceMotion();
    gsap.killTweensOf(panel);
    if (open) {
      gsap.fromTo(
        panel,
        { opacity: 0, y: 24, scale: 0.94 },
        { opacity: 1, y: 0, scale: 1, duration: reduce ? 0 : 0.45, ease: "power3.out" }
      );
      inputRef.current?.focus();
    } else {
      gsap.to(panel, {
        opacity: 0,
        y: 16,
        scale: 0.96,
        duration: reduce ? 0 : 0.25,
        ease: "power2.in",
        onComplete: () => setMounted(false),
      });
    }
  }, [open, mounted]);

  // Escape closes the chat
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // New messages slide in and the conversation scrolls down
  useIsoLayoutEffect(() => {
    const log = logRef.current;
    if (!log) return;
    const items = log.querySelectorAll(".chat-msg");
    const last = items[items.length - 1];
    if (last && items.length > 1 && !reduceMotion()) {
      gsap.fromTo(last, { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: "power3.out", clearProps: "transform,opacity" });
    }
    log.scrollTo({ top: log.scrollHeight, behavior: reduceMotion() ? "auto" : "smooth" });
  }, [messages.length, typing, mounted]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const send = (raw: string) => {
    const text = raw.trim();
    if (!text || typing) return;
    setMessages((m) => [...m, { id: idRef.current++, from: "user", text }]);
    setInput("");
    setTyping(true);
    const reply = getReply(text);
    timerRef.current = setTimeout(
      () => {
        setMessages((m) => [...m, { id: idRef.current++, from: "bot", text: reply.text, links: reply.links }]);
        setTyping(false);
      },
      reduceMotion() ? 0 : 800
    );
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    send(input);
  };

  return (
    <div className="fixed bottom-4 right-4 z-[90] flex flex-col items-end gap-4 sm:bottom-6 sm:right-6">
      {/* Chat window */}
      {mounted && (
        <div
          ref={panelRef}
          id="chat-panel"
          role="dialog"
          aria-label="Assistant Auto Zone"
          className="flex h-[min(560px,calc(100svh-9rem))] w-[calc(100vw-2rem)] origin-bottom-right flex-col overflow-hidden border border-gray-200 bg-white shadow-[0_30px_80px_-20px_rgba(0,0,0,0.45)] sm:w-[380px]"
        >
          {/* Header */}
          <div className="relative bg-black px-5 py-4 pr-14 text-white">
            <span aria-hidden="true" className="absolute inset-x-0 top-0 h-[3px] bg-[#D80005]" />
            <p className="text-sm font-black uppercase tracking-wide">Assistant Auto Zone</p>
            <p className="mt-0.5 text-xs text-white/60">Réponses instantanées aux questions fréquentes</p>
            <button
              type="button"
              onClick={close}
              aria-label="Fermer l'assistant"
              className="absolute right-3 top-4 flex h-8 w-8 items-center justify-center text-white/70 transition-colors hover:bg-[#D80005] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <X size={18} />
            </button>
          </div>

          {/* Conversation */}
          <div
            ref={logRef}
            role="log"
            aria-live="polite"
            aria-label="Conversation"
            className="flex-1 space-y-4 overflow-y-auto bg-gray-50 px-4 py-5"
          >
            {messages.map((m) =>
              m.from === "bot" ? (
                <div key={m.id} className="chat-msg flex">
                  <div className="max-w-[88%] whitespace-pre-line border border-gray-200 bg-white px-4 py-3 text-sm leading-relaxed text-gray-800">
                    {m.text}
                    {m.links && m.links.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2 whitespace-normal">
                        {m.links.map((l) =>
                          l.external ? (
                            <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
                              {l.label}
                              <ArrowUpRight size={13} aria-hidden="true" />
                            </a>
                          ) : (
                            <Link key={l.label} href={l.href} className={linkClass}>
                              {l.label}
                              <ArrowUpRight size={13} aria-hidden="true" />
                            </Link>
                          )
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div key={m.id} className="chat-msg flex justify-end">
                  <p className="max-w-[88%] bg-[#D80005] px-4 py-3 text-sm leading-relaxed text-white">{m.text}</p>
                </div>
              )
            )}
            {typing && (
              <div className="flex" aria-label="L'assistant écrit">
                <div className="flex items-center gap-1.5 border border-gray-200 bg-white px-4 py-4">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      aria-hidden="true"
                      className="h-1.5 w-1.5 animate-bounce bg-gray-400"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quick replies and input */}
          <div className="border-t border-gray-200 bg-white">
            <div className="flex gap-2 overflow-x-auto px-4 pb-1 pt-3 [scrollbar-width:none]">
              {FAQ.map((entry) => (
                <button
                  key={entry.id}
                  type="button"
                  onClick={() => send(entry.question)}
                  disabled={typing}
                  className="shrink-0 border border-gray-300 px-3 py-1.5 text-xs font-bold text-black transition-colors hover:border-black hover:bg-black hover:text-white disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D80005]"
                >
                  {entry.question}
                </button>
              ))}
            </div>
            <form onSubmit={onSubmit} className="flex gap-2 px-4 pb-2 pt-3">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                maxLength={200}
                aria-label="Votre question"
                placeholder="Écrivez votre question…"
                className="min-w-0 flex-1 border border-gray-300 px-4 py-3 text-sm text-black placeholder:text-gray-400 focus:border-black focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D80005]"
              />
              <button
                type="submit"
                disabled={!input.trim() || typing}
                aria-label="Envoyer"
                className="flex h-[46px] w-[46px] shrink-0 items-center justify-center bg-[#D80005] text-white transition-colors hover:bg-black disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D80005] focus-visible:ring-offset-2"
              >
                <Send size={18} />
              </button>
            </form>
            <p className="px-4 pb-3 text-[11px] leading-snug text-gray-500">
              Assistant automatique. Pour un devis ou un cas précis, contactez un conseiller.
            </p>
          </div>
        </div>
      )}

      {/* Launcher */}
      <div className="flex items-center gap-3">
        {showHint && !open && (
          <div
            ref={hintRef}
            className="hidden border border-gray-200 border-l-4 border-l-[#D80005] bg-white px-4 py-3 text-sm font-bold text-black shadow-lg sm:block"
          >
            Une question ? Posez-la ici
          </div>
        )}
                  <button
            ref={launcherRef}
            type="button"
            onClick={toggle}
            aria-expanded={open}
            aria-controls="chat-panel"
            aria-label={open ? "Fermer l'assistant" : "Ouvrir l'assistant : poser une question"}
            className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-black text-white shadow-[0_12px_30px_-8px_rgba(0,0,0,0.5)] transition-all duration-300 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
          >
            {!hasOpened && (
              <span aria-hidden="true" className="absolute inset-0 animate-ping bg-[#D80005]/30 [animation-duration:2.6s]" />
            )}
            <span className="relative flex items-center justify-center">
              {open ? (
                <X size={26} />
              ) : (
                <img
                  src="/bot-icon.jpg"
                  alt="Assistant Auto Zone"
                  width={48}
                  height={48}
                  className="h-12 w-12 object-contain"
                />
              )}
            </span>
          </button>
      </div>
    </div>
  );
}