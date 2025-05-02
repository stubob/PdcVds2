"use server";
import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";
import { prisma } from "../prisma";
import {
  DraftTeam,
  DraftTeamRider,
  Prisma,
  Race,
  RaceResult,
  Rider,
  User,
} from "@prisma/client";
import { addDays } from "date-fns";

const calendarAndResults = Prisma.validator<Prisma.RaceDefaultArgs>()({
  include: {
    raceResult: {
      where: {
        sequence: 1,
      },
      include: {
        rider: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        sequence: "asc",
      },
    },
  },
});
export type RaceWithResults = Prisma.RaceGetPayload<typeof calendarAndResults>;
export async function getCalendar(): Promise<RaceWithResults[]> {
  return getCalendarByDateRange(new Date("2025-01-01"), new Date("2025-12-31"));
}

export async function getCalendarByDateRange(
  startDate: Date,
  endDate: Date
): Promise<RaceWithResults[]> {
  const data = await prisma.race.findMany({
    where: {
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
    orderBy: [
      {
        date: "asc",
      },
    ],
    include: {
      raceResult: {
        where: {
          sequence: 1,
        },
        include: {
          rider: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          sequence: "asc",
        },
      },
    },
  });
  return data;
}

export async function updateRiderScore(
  riderId: number,
  points: number
): Promise<Rider> {
  const rider = await prisma.rider.update({
    where: {
      id: riderId,
    },
    data: {
      score2025: {
        increment: points,
      },
    },
  });

  return rider;
}

export async function updateDraftScores(
  riderId: number,
  points: number
): Promise<void> {
  const teams = await prisma.draftTeam.updateMany({
    where: {
      draftTeamRiders: {
        some: {
          riderId: riderId,
          active: true,
        },
      },
      year: "2025",
    },
    data: {
      score2025: {
        increment: points,
      },
    },
  });

  revalidateTag("draftTeamResults");
  revalidateTag("mensDraftTeamData");
  revalidateTag("womensDraftTeamData");
}

export async function createRaces(races: Prisma.RaceCreateManyInput[]) {
  const data = await prisma.race.createManyAndReturn({
    data: races,
    skipDuplicates: true,
  });
  revalidatePath("/admin/admin-calendar");
  revalidateTag("calendarData");
  return data;
}

export async function updateRace(race: Race): Promise<Race> {
  const data = await prisma.race.update({
    where: {
      id: race.id,
    },
    data: {
      name: race.name,
      nameKey: race.nameKey,
      nation: race.nation,
      category: race.category,
      date: race.date,
      type: race.type,
    },
  });
  revalidateTag("calendarData");
  return data;
}

export async function deleteRace(raceId: number) {
  const data = await prisma.race.delete({
    where: {
      id: raceId,
    },
  });
  revalidateTag("calendarData");
  return data;
}

export async function createRiders(riders: Prisma.RiderCreateManyInput[]) {
  const data = await prisma.rider.createManyAndReturn({
    data: riders,
    skipDuplicates: true,
  });
  revalidatePath("/admin/admin-riders");
  revalidateTag("mensRiders");
  revalidateTag("womensRiders");

  return data;
}

export async function updateRider(rider: Rider): Promise<Rider> {
  const data = await prisma.rider.update({
    where: {
      id: rider.id,
    },
    data: {
      name: rider.name,
      nameKey: rider.nameKey,
      nation: rider.nation,
      teamKey: rider.teamKey,
      age: rider.age,
      price2025: rider.price2025,
      score2024: rider.score2024,
      score2025: rider.score2025,
    },
  });
  revalidateTag("mensRiders");
  revalidateTag("womensRiders");
  return data;
}

export async function deleteRider(riderId: number) {
  const data = await prisma.rider.delete({
    where: {
      id: riderId,
    },
  });
  revalidateTag("mensRiders");
  revalidateTag("womensRiders");
  return data;
}

export async function getRace(raceId: number): Promise<Race | null> {
  const data = await prisma.race.findUnique({
    where: {
      id: raceId,
    },
  });
  return data;
}

interface RaceResultTable extends RaceResult {
  riderName: string;
}
export async function getRaceResult(
  raceId: number
): Promise<RaceResultTable[] | null> {
  const results = await prisma.raceResult.findMany({
    where: {
      raceId: raceId,
    },
    orderBy: [
      {
        sequence: "asc",
      },
    ],
    include: {
      rider: {
        select: {
          name: true,
        },
      },
    },
  });

  return results.map((result) => ({
    id: result.id,
    title: result.title,
    points: result.points,
    riderName: result.rider.name,
    riderId: result.riderId,
    sequence: result.sequence,
    raceId: result.raceId,
  }));
}

export async function getRaceResultsByDraftTeam(
  draftTeamId: number
): Promise<RaceResult[]> {
  const currentYear = new Date().getFullYear();
  const startDate = new Date(`${currentYear}-01-01`);
  const endDate = new Date(`${currentYear}-12-31`);
  const teamData = await prisma.draftTeam.findUnique({
    where: {
      id: draftTeamId,
      year: "2025",
    },
    include: {
      draftTeamRiders: {
        include: {
          rider: true,
        },
      },
    },
  });
  const riderIds = teamData?.draftTeamRiders.map((rider) => rider.rider.id);
  const data = await prisma.raceResult.findMany({
    where: {
      race: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      rider: {
        id: {
          in: riderIds,
        },
      },
    },
    orderBy: [
      {
        sequence: "asc",
      },
    ],
    include: {
      rider: {
        select: {
          name: true,
        },
      },
      race: {
        select: {
          name: true,
          date: true,
          nation: true,
          category: true,
        },
      },
    },
  });

  return data.map((result) => ({
    id: result.id,
    title: result.title,
    points: result.points,
    riderName: result.rider.name,
    riderId: result.riderId,
    sequence: result.sequence,
    raceId: result.raceId,
    raceName: result.race.name,
    raceDate: result.race.date,
    raceNation: result.race.nation,
    raceCategory: result.race.category,
  }));
}

export async function createRaceResult(data: {
  raceId: number;
  title: string;
  points: number;
  sequence: number;
  riderId: number;
}): Promise<RaceResult> {
  const result = await prisma.raceResult.upsert({
    where: {
      raceId_sequence: {
        raceId: data.raceId,
        sequence: data.sequence,
      },
    },
    create: {
      raceId: data.raceId,
      title: data.title,
      points: data.points,
      sequence: data.sequence,
      riderId: data.riderId,
    },
    update: {
      raceId: data.raceId,
      title: data.title,
      points: data.points,
      sequence: data.sequence,
      riderId: data.riderId,
    },
  });
  revalidateTag("draftTeamResults");
  console.log("result", result);
  return result;
}
export async function updateRaceResult(data: RaceResult): Promise<RaceResult> {
  const result = await prisma.raceResult.update({
    where: {
      raceId_sequence: {
        raceId: data.raceId,
        sequence: data.sequence,
      },
    },
    data: {
      raceId: data.raceId,
      title: data.title,
      points: data.points,
      sequence: data.sequence,
      riderId: data.riderId,
    },
  });
  revalidateTag("draftTeamResults");
  return result;
}
export async function getAllRiders(): Promise<Rider[]> {
  const data = await prisma.rider.findMany({
    orderBy: [
      {
        price2025: "desc",
      },
    ],
  });
  return data;
}

export async function getUser(email: string): Promise<User | null> {
  const data = await prisma.user.findFirst({
    where: {
      email: email,
    },
  });
  return data;
}

export async function updateUser(user: { email: string; name: string }) {
  try {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {
        name: user.name,
      },
      create: {
        email: user.email,
        name: user.name,
      },
    });
    const dbuser = await prisma.user.findUnique({
      where: { email: user.email },
    });
  } catch (error) {
    console.error("Error saving user to database:", error);
  }
}

const draftTeamWithUser = Prisma.validator<Prisma.DraftTeamDefaultArgs>()({
  include: {
    user: {
      select: {
        name: true,
      },
    },
  },
});
export type DraftTeamWithUser = Prisma.DraftTeamGetPayload<
  typeof draftTeamWithUser
>;

const draftRiderDetails = Prisma.validator<Prisma.DraftTeamRiderDefaultArgs>()({
  include: {
    rider: true,
  },
});

export type DraftTeamRiderWithDetails = Prisma.DraftTeamRiderGetPayload<
  typeof draftRiderDetails
>;

export async function getDraftTeams(
  type: boolean
): Promise<DraftTeamWithUser[] | null> {
  const data = await prisma.draftTeam.findMany({
    where: {
      type: type,
      year: "2025",
    },
    orderBy: [
      {
        score2025: "desc",
      },
    ],
    include: {
      user: {
        select: {
          name: true,
        },
      },
    },
  });
  return data;
}

export async function getDraftTeam(
  userId: string,
  type: boolean
): Promise<DraftTeamWithRiders | undefined> {
  const data = await prisma.draftTeam.findFirst({
    where: {
      userId: userId,
      type: type,
      year: "2025",
    },
    include: {
      draftTeamRiders: {
        include: {
          rider: true,
        },
      },
    },
  });
  return data ?? undefined;
}

const dratTeamWithRiders = Prisma.validator<Prisma.DraftTeamDefaultArgs>()({
  include: {
    draftTeamRiders: {
      include: {
        rider: true,
      },
    },
  },
});

export type DraftTeamWithRiders = Prisma.DraftTeamGetPayload<
  typeof dratTeamWithRiders
>;

export async function getDraftTeamById(
  teamId: number
): Promise<DraftTeamWithRiders | undefined> {
  const data = await prisma.draftTeam.findUnique({
    where: {
      id: teamId,
    },
    include: {
      draftTeamRiders: {
        include: {
          rider: true,
        },
      },
    },
  });
  return data ?? undefined;
}

export async function createDraftTeam(
  user: User,
  teamName: string,
  type: boolean
): Promise<DraftTeam> {
  const data = await prisma.draftTeam.create({
    data: {
      name: teamName,
      type: type,
      year: "2025",
      userId: user.id,
    },
  });
  revalidateTag("mensDraftTeamData");
  revalidateTag("womensDraftTeamData");
  return data;
}

export async function lockDraftTeam(
  userId: string,
  team: DraftTeam
): Promise<DraftTeam> {
  const data = await prisma.draftTeam.update({
    where: { id: team.id, userId: userId },
    data: {
      locked: true,
    },
  });
  revalidateTag("mensDraftTeamData");
  revalidateTag("womensDraftTeamData");
  return data;
}

export const addRiderToTeam = async (
  user: User,
  team: DraftTeamWithRiders,
  rider: Rider
): Promise<DraftTeamRider> => {
  const draftTeamRider = await prisma.draftTeamRider.create({
    data: {
      userId: user.id,
      teamId: team.id,
      riderId: rider.id,
    },
  });
  if (team.type === false) {
    revalidateTag(`mensDraftTeamData_${user.id}`);
  } else {
    revalidateTag(`womensDraftTeamData_${user.id}`);
  }
  return draftTeamRider;
};

export const removeRiderFromTeam = async (
  user: User,
  team: DraftTeam,
  rider: Rider
): Promise<{ count: number }> => {
  if (team.type === false) {
    revalidateTag(`mensDraftTeamData_${user.id}`);
  } else {
    revalidateTag(`womensDraftTeamData_${user.id}`);
  }
  return await prisma.draftTeamRider.deleteMany({
    where: { userId: user.id, teamId: team.id, riderId: rider.id },
  });
};

const resultsWithRace = Prisma.validator<Prisma.RaceResultDefaultArgs>()({
  include: {
    race: {},
  },
});
export type ResultsWithRace = Prisma.RaceResultGetPayload<
  typeof resultsWithRace
>;

const riderWithResults = Prisma.validator<Prisma.RiderDefaultArgs>()({
  include: {
    results: {
      include: {
        race: {},
      },
    },
  },
});
export type RiderWithResults = Prisma.RiderGetPayload<typeof riderWithResults>;
export async function getRider(
  riderId: number
): Promise<RiderWithResults | undefined> {
  const currentYear = new Date().getFullYear();
  const startDate = new Date(`${currentYear}-01-01`);
  const endDate = new Date(`${currentYear}-12-31`);

  const rider = await prisma.rider.findUnique({
    where: { id: riderId },
    include: {
      results: {
        where: {
          race: {
            date: {
              gte: startDate,
              lte: endDate,
            },
          },
        },
        orderBy: {
          race: {
            date: "desc",
          },
        },
        include: {
          race: true,
        },
      },
    },
  });

  return rider ?? undefined;
}
