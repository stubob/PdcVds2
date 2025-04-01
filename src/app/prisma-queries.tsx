"use server";
import { title } from "process";
import { prisma } from "../prisma";
import { RaceResult } from "@prisma/client";

export async function getCalendar() {
    const data = await prisma.race.findMany({
        where: {
            date: {
                gte: new Date('2025-01-01'),
                lte: new Date('2025-12-31'),
            }
        },
        orderBy: [
            {
                date: 'asc',
            },
        ],
        include: {
            raceResult: {
                where: {
                    sequence: 0,
                },
                include: {
                    rider: {
                        select: {
                            name: true,
                        },
                    },
                },
                orderBy: {
                    sequence: 'asc',
                },

            }
        }

    });
    return data;
}

export async function updateRiderScores() {
    console.log('updateRiderScores');
    const riders = await prisma.rider.findMany();

    for (const rider of riders) {
        const results = await prisma.raceResult.findMany({
            where: {
                riderId: rider.id,
            },
        });

        let score = 0;
        results.forEach(result => {
            score += result.points;
            console.log('result', result);
        });

        console.log("score", score);

        await prisma.rider.update({
            where: { id: rider.id },
            data: {
                score2025: score,
            },
        });
    }
    return riders;
}

export async function updateScores() {
    console.log('updateTeamScores');
    const teams = await prisma.draftTeam.findMany();

    for (const team of teams) {
        const teamRiders = await prisma.draftTeamRiders.findMany({
            where: {
                teamId: team.id,
            },
            include: {
                rider: true,
            },
        });

        let score = 0;
        teamRiders.forEach(teamRider => {
            score += teamRider.rider.score2025;
            console.log('teamRider', teamRider);
        });

        await prisma.draftTeam.update({
            where: { id: team.id },
            data: {
                score2025: score,
            },
        });
    }
    return teams;
}

export async function createRace(name: string, nation: string, category: string, date: Date, type: boolean) {
    const nameKey = String(name).toLowerCase().replace(/ /g, '-');
    console.log('createRace', name, nameKey, nation, category, date, type);
    const data = await prisma.race.create({
        data: {
            name: String(name),
            nameKey: nameKey,
            nation: String(nation),
            category: String(category),
            date: date,
            type: type,
        }     
    });
    return data;
}

export async function createRider(name: string, nation: string, type: boolean, price2025: number, score2024: number, age: number, teamKey: string) {
    const nameKey = String(name).toLowerCase().replace(/ /g, '-');
    console.log('createRider', name, nameKey, nation, type, price2025, score2024, age, teamKey);
    const data = await prisma.rider.create({
        data: {
            name: String(name),
            nameKey: nameKey,
            nation: String(nation),
            type: type,
            price2025: price2025,
            score2024: score2024,
            score2025: 0,
            age: age,
            teamKey: teamKey,

        }     
    });
    return data;
}
export async function getRace(raceId: number) {
    const data = await prisma.race.findUnique({
        where: {
            id: raceId,
        },
    });
    return data;
}


export async function getRaceResult(raceId: number) {
    const results = await prisma.raceResult.findMany({
        where: {
            raceId: raceId
        },
        orderBy: [
            {
                sequence: 'asc',
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
      
        return results.map(result => ({
          id: result.id,
          title: result.title,
          points: result.points,
          riderName: result.rider.name,
          riderId: result.riderId,
            sequence: result.sequence,
        }));
    }

    export async function upsertRaceResult(data: RaceResult) {
        return await prisma.raceResult.upsert({
            where: { 
                raceId_sequence: {
                    raceId: data.raceId,
                    sequence: data.sequence,
                },
             },
            update: { 
                raceId: data.raceId,
                title: data.title,
                points: data.points,
                sequence: data.sequence,
                riderId: data.riderId,
             },
            create: {
                raceId: data.raceId,
                title: data.title,
                points: data.points,
                sequence: data.sequence,
                riderId: data.riderId,
            }
        });
    }
export async function getAllRiders() {
    const data = await prisma.rider.findMany({
        orderBy: [
            {
                price2025: 'desc',
            },
        ],
    });
    return data;
}

export async function getUser(email: string) {
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
        console.error('Error saving user to database:', error);
    }
}

export async function getDraftTeams(type: boolean) {
    const data = await prisma.draftTeam.findMany({
        where: {
            type: type,
        },
        orderBy: [
            {
                score2025: 'desc',
            },
        ],
        include: {
            user: {
                select: {
                    name: true,
                },
            }
        },
    });
    const teamsWithIdIndex = data.map((team, index) => ({
        ...team,
        id: index + 1,
        userName: team.user.name,
    }));

    return teamsWithIdIndex;
}

export async function getDraftTeam(user, type: boolean) {
    const data = await prisma.draftTeam.findFirst({
        where: {
            userId: user.id,
            type: type,
        },
        include: {
            draftTeamRiders: true,
        },
    });
    return data;
}

export async function getDraftTeamById(teamId: number) {
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
    return data;
}

export async function createDraftTeam(user, teamName: string, type: boolean) {
    const data = await prisma.draftTeam.create({
        data: {
            name: teamName,
            type: type,
            year: '2025',
            userId: user.id,
        },
    });
    return data;
}

export async function lockDraftTeam(user, team) {
    return await prisma.draftTeam.update({
        where: { id: team.id, userId: user.id },
        data: {
            locked: true,
        },
    });
}

export const addRiderToTeam = async (user, team, rider) => {
    return await prisma.draftTeamRiders.create({
        data: {
            userId: user.id,
            teamId: team.id,
            riderId: rider.id,
        },
    });
  };
  
  export const removeRiderFromTeam = async (user, team, rider) => {
    return await prisma.draftTeamRiders.deleteMany({
      where: { userId: user.id, teamId: team.id, riderId: rider.id },
    });
  };