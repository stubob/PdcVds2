"use server";
import { unstable_cache } from "next/cache";
import {
  createRaces,
  getAllRiders,
  getCalendar,
  getDraftTeam,
  getDraftTeams,
  getRace,
  getRaceResult,
  getRaceResultsByDraftTeam,
  getRider,
  getUser,
} from "./prisma-queries";
import dotenv from 'dotenv';

dotenv.config();

// Get cache revalidation time from .env or use a default value
const CACHE_REVALIDATION_TIME = parseInt(process.env.CACHE_REVALIDATION_TIME || '3600', 10);

declare module "next-auth" {
  interface Session {
    id: string;
    name: string | null;
    admin: boolean;
    email: string;
    emailVerified: Date | null;
    image: string | null;
    createdAt: Date;
    updatedAt: Date;
    expires: Date;
    user: {
      id: string;
      name: string | null;
      email: string;
      emailVerified: Date | null;
      image: string | null;
      admin: boolean;
      createdAt: Date;
      updatedAt: Date;
    };
  }
}
const fetchUserSessionData = async (email: string) => {
  const dbuser = await getUser(email);
  console.log("fetchUserSessionData", dbuser);
  return dbuser;
};

export const fetchUserSession = async (session: Session | null) => {
  if (!session?.user?.email) {
    return null;
  }
  return unstable_cache(
    async () => {
      const userData = await fetchUserSessionData(session?.user?.email);
      if (userData) {
        const userSession: Session = {
          id: session.id,
          name: session.name || null,
          email: session.email,
          emailVerified: session.emailVerified || null,
          image: session.image || null,
          admin: session.admin || false,
          createdAt: new Date(session.createdAt),
          updatedAt: new Date(session.updatedAt),
          user: userData,
          expires: session.expires
        };
        return userSession;
      }
      return null;
    },
    [`session_${session.user.email}`],
    { revalidate: CACHE_REVALIDATION_TIME, tags: [`session_${session.user.email}`] }
  )();
};
export const cachedLogin = async (session: Session) => {
  if (!session?.id) {
    return null;
  }
  return unstable_cache(
    async () => session,
    [`auth_${session.id}`],
    { revalidate: CACHE_REVALIDATION_TIME, tags: [`auth_${session.id}`] }
  )();
};

export const getMensTeamData = unstable_cache(
  async (session) => {
    if (session) {
      return await getDraftTeam(session, false);
    }
  },
  ["mensDraftTeamData"],
  { revalidate: CACHE_REVALIDATION_TIME, tags: ["mensDraftTeamData"] }
);

export const getWomensTeamData = unstable_cache(
  async (session) => {
    if (session) {
      return await getDraftTeam(session, true);
    }
  },
  ["womensDraftTeamData"],
  { revalidate: CACHE_REVALIDATION_TIME, tags: ["womensDraftTeamData"] }
);

export const getDraftTeamResults = async (draftTeamId: number) => unstable_cache(
  async () => {
    return await getRaceResultsByDraftTeam(draftTeamId);
  },
  [`draftTeamResults_${draftTeamId}`],
  { revalidate: CACHE_REVALIDATION_TIME, tags: [`draftTeamResults_${draftTeamId}`] }
)();

export const getMensRiders = unstable_cache(
  async () => {
    const riders = await getAllRiders();
    return riders.filter((rider) => rider.type === false);
  },
  ["mensRiders"],
  { revalidate: CACHE_REVALIDATION_TIME, tags: ["mensRiders"] }
);

export const getMensDraftTeam = async (session: Session | null) => {
  if (session && session.id) {

  return unstable_cache(
    async () => {
      return await getDraftTeam(session.id, false);
    },
    [`mensDraftTeamData_${session.id}`],
    { revalidate: CACHE_REVALIDATION_TIME, tags: [`mensDraftTeamData_${session.id}`] }
  )();
}
};

export const getWomensDraftTeam = async (session: Session | null) => {
  if (session && session.id) {
  return unstable_cache(
    async () => {
      return await getDraftTeam(session.id, true);
    },
    [`womensDraftTeamData_${session.id}`],
    { revalidate: CACHE_REVALIDATION_TIME, tags: [`womensDraftTeamData_${session.id}`] }
  )();
}
};

export const getWomensRiders = unstable_cache(
  async () => {
    const riders = await getAllRiders();
    return riders.filter((rider) => rider.type === true);
  },
  ["womensRiders"],
  { revalidate: CACHE_REVALIDATION_TIME, tags: ["womensRiders"] }
);

export const getMensDraftTeams = unstable_cache(
  async () => {
    return await getDraftTeams(false);
  },
  ["mensTeamData"],
  { revalidate: CACHE_REVALIDATION_TIME, tags: ["mensTeamData"] }
);

export const getWomensDraftTeams = unstable_cache(
  async () => {
    return await getDraftTeams(true);
  },
  ["womensTeamData"],
  { revalidate: CACHE_REVALIDATION_TIME, tags: ["womensTeamData"] }
);

export const getRiderById = async (id: number) =>
  unstable_cache(
    async () => {
      console.log("getCachedRiderById");
      return await getRider(id); // Assuming getRider is the correct function to fetch a rider by id
    },
    [`rider_${id}`],
    { revalidate: CACHE_REVALIDATION_TIME, tags: [`rider_${id}`] }
  )();

export const getRaceResultById = async (id: number) =>
  unstable_cache(
    async () => {
      console.log("getCachedRaceResultById");
      return await getRaceResult(id); // Assuming getRider is the correct function to fetch a rider by id
    },
    [`race_${id}`],
    { revalidate: CACHE_REVALIDATION_TIME, tags: [`race_${id}`] }
  )();

export const getRaceById = async (id: number) => 
  unstable_cache(
    async () => {
      console.log("getCachedRace");
      return await getRace(id); // Assuming getRider is the correct function to fetch a rider by id
    },
    [`race_${id}`],
    { revalidate: CACHE_REVALIDATION_TIME, tags: [`race_${id}`] }
  )();

export const newRaces = async (races: Race[]) => {
  const data = await createRaces(races);
  console.log("datalayer createRaces", data);

  return data;
}

export const getCalendarData = unstable_cache(
  async () => {
    return await getCalendar();
  },
  ["calendarData"],
  { revalidate: CACHE_REVALIDATION_TIME, tags: ["calendarData"] }
);
import { addDays } from "date-fns";
import { Race, User } from "@prisma/client";
import { Session } from "next-auth";

export const getCachedUpcomingCalendarData = unstable_cache(
  async () => {
    const upcomingCalendar = await getCalendarData();
    return upcomingCalendar.filter((race: Race) => race.date > new Date() && race.date < addDays(new Date(), 365));
  },
  ['upcomingCalendar'],
  { revalidate: CACHE_REVALIDATION_TIME, tags: ['upcomingCalendar'] }
);

export const getCachedRecentCalendarData = unstable_cache(
  async () => {
    const recentCalendar = await getCalendarData();
    return recentCalendar.filter((race: Race) => race.date > addDays(new Date(), -365) && race.date < new Date());
  },
  ['upcomingCalendar'],
  { revalidate: CACHE_REVALIDATION_TIME, tags: ['recentCalendar'] }
);
