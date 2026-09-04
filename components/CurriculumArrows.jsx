"use client";

import { memo, useEffect, useRef } from "react";

import {
  buildCurriculumArrowEdges,
  buildCurriculumArrowPath,
} from "@/lib/curriculum-arrows";

import styles from "./CurriculumExplorer.module.css";

const SVG_NAMESPACE = "http://www.w3.org/2000/svg";
const COARSE_POINTER_QUERY =
  "(max-width: 720px), (hover: none), (pointer: coarse)";

function getFrame(element, canvasFrame) {
  const frame = element.getBoundingClientRect();

  return {
    bottom: frame.bottom - canvasFrame.top,
    left: frame.left - canvasFrame.left,
    right: frame.right - canvasFrame.left,
    top: frame.top - canvasFrame.top,
  };
}

function getCardId(courseKey, code) {
  return `flow-discipline-${courseKey}-${code}`;
}

function CurriculumArrows({
  canvasRef,
  courseKey,
  curriculum,
  layoutKey,
  selectedCode,
  visibleCodes,
}) {
  const groupRef = useRef(null);
  const svgRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const group = groupRef.current;
    const svg = svgRef.current;

    if (!canvas || !group || !svg) return undefined;

    const coarsePointer = window.matchMedia(COARSE_POINTER_QUERY);
    let animationFrame = 0;
    let disposed = false;
    let resizeObserver;
    const observedElements = new Set();

    function drawArrows() {
      animationFrame = 0;
      if (disposed) return;

      const edges = buildCurriculumArrowEdges(
        curriculum,
        selectedCode,
        visibleCodes,
        { directOnly: coarsePointer.matches },
      );
      const canvasFrame = canvas.getBoundingClientRect();
      const width = Math.max(canvas.scrollWidth, canvas.offsetWidth);
      const height = Math.max(canvas.scrollHeight, canvas.offsetHeight);
      const elementFrames = new Map();
      const elementsToObserve = new Set([canvas]);
      const fragment = document.createDocumentFragment();

      svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
      svg.setAttribute("width", String(width));
      svg.setAttribute("height", String(height));

      function findFrame(code) {
        if (elementFrames.has(code)) return elementFrames.get(code);

        const element = document.getElementById(getCardId(courseKey, code));
        const frame = element ? getFrame(element, canvasFrame) : null;

        if (element) elementsToObserve.add(element);
        elementFrames.set(code, frame);
        return frame;
      }

      for (const edge of edges) {
        const geometry = buildCurriculumArrowPath(
          findFrame(edge.from),
          findFrame(edge.to),
        );

        if (!geometry) continue;

        const path = document.createElementNS(SVG_NAMESPACE, "path");
        const relationClass =
          edge.relation === "prerequisite"
            ? styles.flowArrowPrerequisite
            : edge.relation === "unlock"
              ? styles.flowArrowUnlock
              : edge.relation === "dimmed"
                ? styles.flowArrowDimmed
                : "";
        const marker = ["prerequisite", "unlock"].includes(edge.relation)
          ? edge.relation
          : "default";

        path.setAttribute(
          "class",
          [styles.flowArrowLine, relationClass].filter(Boolean).join(" "),
        );
        path.setAttribute("d", geometry.d);
        path.setAttribute("data-arrow-from", edge.from);
        path.setAttribute("data-arrow-relation", edge.relation);
        path.setAttribute("data-arrow-to", edge.to);
        path.setAttribute("marker-end", `url(#flow-arrow-${marker})`);
        path.setAttribute("vector-effect", "non-scaling-stroke");
        fragment.appendChild(path);
      }

      group.replaceChildren(fragment);

      if (resizeObserver) {
        elementsToObserve.forEach((element) => {
          if (observedElements.has(element)) return;

          observedElements.add(element);
          resizeObserver.observe(element);
        });
      }
    }

    function scheduleDraw() {
      if (animationFrame || disposed) return;
      animationFrame = window.requestAnimationFrame(drawArrows);
    }

    if ("ResizeObserver" in window) {
      resizeObserver = new ResizeObserver(scheduleDraw);
    }

    scheduleDraw();
    window.addEventListener("resize", scheduleDraw, { passive: true });
    coarsePointer.addEventListener?.("change", scheduleDraw);
    document.fonts?.ready.then(scheduleDraw);

    return () => {
      disposed = true;
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
      resizeObserver?.disconnect();
      window.removeEventListener("resize", scheduleDraw);
      coarsePointer.removeEventListener?.("change", scheduleDraw);
    };
  }, [
    canvasRef,
    courseKey,
    curriculum,
    layoutKey,
    selectedCode,
    visibleCodes,
  ]);

  return (
    <svg
      aria-hidden="true"
      className={styles.flowArrows}
      focusable="false"
      ref={svgRef}
    >
      <defs>
        <marker
          id="flow-arrow-default"
          markerHeight="6"
          markerWidth="6"
          orient="auto"
          refX="8"
          refY="5"
          viewBox="0 0 10 10"
        >
          <path className={styles.flowArrowMarkerDefault} d="M2 2L8 5L2 8" />
        </marker>
        <marker
          id="flow-arrow-prerequisite"
          markerHeight="6"
          markerWidth="6"
          orient="auto"
          refX="8"
          refY="5"
          viewBox="0 0 10 10"
        >
          <path
            className={styles.flowArrowMarkerPrerequisite}
            d="M2 2L8 5L2 8"
          />
        </marker>
        <marker
          id="flow-arrow-unlock"
          markerHeight="6"
          markerWidth="6"
          orient="auto"
          refX="8"
          refY="5"
          viewBox="0 0 10 10"
        >
          <path className={styles.flowArrowMarkerUnlock} d="M2 2L8 5L2 8" />
        </marker>
      </defs>
      <g ref={groupRef} />
    </svg>
  );
}

export default memo(CurriculumArrows);
