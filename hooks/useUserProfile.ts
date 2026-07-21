"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ResumeContact, ResumeData } from "../data/resume";

export const userProfileStorageKey = "resumecraft:user-profile:v1";
const saveDelayMs = 450;

export type UserProfile = {
  name: string;
  photo: string;
  headline: string;
  contact: ResumeContact;
};

export function useUserProfile(resume: ResumeData, revision: number) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loaded, setLoaded] = useState(false);
  const resumeRef = useRef(resume);
  resumeRef.current = resume;

  useEffect(() => {
    setProfile(readProfile());
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded || revision === 0) return;

    const nextProfile = profileFromResume(resumeRef.current);
    const timeout = window.setTimeout(() => {
      if (writeProfile(nextProfile)) setProfile(nextProfile);
    }, saveDelayMs);

    return () => window.clearTimeout(timeout);
  }, [loaded, revision]);

  const clearProfile = useCallback(() => {
    const cleared = removeProfile();
    if (cleared) setProfile(null);
    return cleared;
  }, []);

  return useMemo(
    () => ({
      applyToEmptyFields: (data: ResumeData) => fillEmptyProfileFields(data, profile),
      clearProfile,
      hasProfile: Boolean(profile && hasProfileValues(profile)),
    }),
    [clearProfile, profile],
  );
}

export function fillEmptyProfileFields(data: ResumeData, profile: UserProfile | null): ResumeData {
  if (!profile) return data;

  return {
    ...data,
    name: preferExisting(data.name, profile.name),
    photo: preferExisting(data.photo ?? "", profile.photo),
    headline: preferExisting(data.headline, profile.headline),
    contact: {
      email: preferExisting(data.contact.email, profile.contact.email),
      phone: preferExisting(data.contact.phone, profile.contact.phone),
      location: preferExisting(data.contact.location, profile.contact.location),
      portfolio: preferExisting(data.contact.portfolio, profile.contact.portfolio),
      linkedIn: preferExisting(data.contact.linkedIn, profile.contact.linkedIn),
      github: preferExisting(data.contact.github, profile.contact.github),
    },
  };
}

function profileFromResume(resume: ResumeData): UserProfile {
  return {
    name: resume.name,
    photo: resume.photo ?? "",
    headline: resume.headline,
    contact: { ...resume.contact },
  };
}

function preferExisting(current: string, saved: string) {
  return current.trim() ? current : saved;
}

function readProfile(): UserProfile | null {
  if (typeof window === "undefined") return null;

  try {
    const saved = window.localStorage.getItem(userProfileStorageKey);
    return saved ? parseProfile(JSON.parse(saved)) : null;
  } catch {
    return null;
  }
}

function writeProfile(profile: UserProfile) {
  if (typeof window === "undefined") return false;
  try {
    window.localStorage.setItem(userProfileStorageKey, JSON.stringify(profile));
    return true;
  } catch {
    return false;
  }
}

function removeProfile() {
  if (typeof window === "undefined") return false;
  try {
    window.localStorage.removeItem(userProfileStorageKey);
    return true;
  } catch {
    return false;
  }
}

function parseProfile(value: unknown): UserProfile | null {
  if (!isRecord(value)) return null;
  const contact = isRecord(value.contact) ? value.contact : {};
  return {
    name: stringValue(value.name),
    photo: stringValue(value.photo),
    headline: stringValue(value.headline),
    contact: {
      email: stringValue(contact.email),
      phone: stringValue(contact.phone),
      location: stringValue(contact.location),
      portfolio: stringValue(contact.portfolio),
      linkedIn: stringValue(contact.linkedIn),
      github: stringValue(contact.github),
    },
  };
}

function hasProfileValues(profile: UserProfile) {
  return [profile.name, profile.photo, profile.headline, ...Object.values(profile.contact)].some(
    (value) => value.trim(),
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function stringValue(value: unknown) {
  return typeof value === "string" ? value : "";
}
