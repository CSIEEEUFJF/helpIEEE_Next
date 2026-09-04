"use client";

import { useSyncExternalStore } from "react";

import CurriculumExplorer from "./CurriculumExplorer";

function subscribeToLocation(callback) {
  window.addEventListener("popstate", callback);
  return () => window.removeEventListener("popstate", callback);
}

function getCourseFromLocation() {
  return new URLSearchParams(window.location.search).get("curso") ?? undefined;
}

function getServerCourse() {
  return undefined;
}

export default function FlowCurriculumExplorer() {
  const initialCourse = useSyncExternalStore(
    subscribeToLocation,
    getCourseFromLocation,
    getServerCourse,
  );

  return (
    <CurriculumExplorer
      initialCourse={initialCourse}
      key={initialCourse ?? "default"}
    />
  );
}
