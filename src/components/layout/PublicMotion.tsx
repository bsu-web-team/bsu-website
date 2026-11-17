"use client";

import { useEffect, useRef } from "react";

const GRID = '.grid, [class*="grid-cols-"], [data-bsu-motion-list], ul, ol, tbody, [class*="space-y-"]';
const CARD = 'a[class*="rounded"], article, li, tr, [data-bsu-reveal], [data-bsu-motion-item], [class*="rounded"][class*="bg-white"], [class*="rounded"][class*="border"]';
const HEADING = 'h1,h2,h3,h4';
const EXCLUDE = 'header,footer,nav,[role="dialog"],[data-bsu-no-motion],[aria-hidden="true"],[hidden]';
const CAP = 300;

/** A single observer handles independent items, never an entire directory grid. */
export default function PublicMotion() {
  const marker = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const scope = marker.current?.parentElement;
    if (!scope || !('IntersectionObserver' in window)) return;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    let stop: (() => void) | undefined;
    function start() {
      stop?.();
      stop = undefined;
      if (!scope || media.matches) return;
      const tracked = new Set<HTMLElement>();
      const shown = new WeakSet<HTMLElement>();
      let frame = 0;
      const observer = new IntersectionObserver(entries => {
        for (const entry of entries) {
          const node = entry.target as HTMLElement;
          if (entry.isIntersecting && entry.intersectionRatio > 0) {
            if (!shown.has(node)) {
              shown.add(node);
              node.classList.add('bsu-motion-in');
            }
          } else if (!entry.isIntersecting) {
            shown.delete(node);
            node.classList.remove('bsu-motion-in');
          }
        }
      }, {threshold: 0.01, rootMargin: '32px 0px 32px 0px'});
      const clear = (el: HTMLElement) => {
        el.classList.remove('bsu-motion-in');
        el.removeAttribute('data-bsu-motion-kind');
        el.style.removeProperty('--bsu-motion-delay');
        el.style.removeProperty('--bsu-motion-x');
        shown.delete(el);
      };
      const refresh = () => {
        frame = 0;
        const main = scope.querySelector('main');
        const next = new Set<HTMLElement>();
        const atomic = new Set<HTMLElement>();
        if (main) {
          const eligible = (el: HTMLElement) => !el.closest(EXCLUDE) && !el.matches('svg, script, style, input, select, textarea, option');
          const composite = (el: HTMLElement) => !el.matches('a,li,tr,[data-bsu-motion-item]') && !!el.querySelector(GRID + ',' + CARD);
          const candidates = main.querySelectorAll<HTMLElement>(`${CARD},${HEADING},p,${GRID.split(',').map(s=>s.trim()+' > *').join(',')}`);
          for (const el of candidates) {
            if (next.size >= CAP || !eligible(el)) continue;
            if (el.closest('table') && !el.matches('tr')) continue;
            if (el.parentElement?.closest('a,li,tr') && !el.matches('a,li,tr')) continue;
            let inside = false;
            for (let parent = el.parentElement; parent && parent !== main; parent = parent.parentElement) {
              if (atomic.has(parent)) { inside = true; break; }
            }
            if (inside) continue;
            const heading = el.matches(HEADING);
            const directCell = Boolean(el.parentElement?.matches(GRID));
            const card = el.matches(CARD) || directCell;
            const paragraph = el.matches('p') && !el.closest(CARD) && !el.closest('form');
            if (!heading && !paragraph && (!card || composite(el))) continue;
            next.add(el);
            if (card && !heading && !paragraph) atomic.add(el);
            const siblings = el.parentElement ? Array.from(el.parentElement.children) : [];
            const index = Math.max(0, siblings.indexOf(el));
            const kind = heading ? 'heading' : paragraph ? 'text' : el.matches('tr') ? 'row' : 'cell';
            el.setAttribute('data-bsu-motion-kind',kind);
            el.style.setProperty('--bsu-motion-delay',`${Math.min(index % 4, 3) * 65}ms`);
            el.style.setProperty('--bsu-motion-x',`${index % 2 ? 16 : -16}px`);
          }
        }
        for (const el of tracked) if (!next.has(el)) { observer.unobserve(el); clear(el); tracked.delete(el); }
        for (const el of next) if (!tracked.has(el)) { tracked.add(el); observer.observe(el); }
      };
      const changes = new MutationObserver(() => { if (!frame) frame = window.requestAnimationFrame(refresh); });
      refresh();
      changes.observe(scope, {childList:true,subtree:true});
      stop = () => {
        if (frame) window.cancelAnimationFrame(frame);
        changes.disconnect(); observer.disconnect();
        for (const el of tracked) clear(el);
        tracked.clear();
      };
    }
    start();
    media.addEventListener('change', start);
    return () => { media.removeEventListener('change',start); stop?.(); };
  }, []);
  return <span ref={marker} hidden aria-hidden="true" />;
}
