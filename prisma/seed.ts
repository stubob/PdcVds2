import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function rawSql() {
  await prisma.$executeRaw`INSERT INTO public.rider (id, name, nation, team_key, name_key, age, price_2025, score_2025, score_2024, type) VALUES (1, 'Adam Yates', 'GBR', 'UAE Team Emirates - XRG', 'adam-yates', 32, 20, 0, 0, false);`
  await prisma.$executeRaw`INSERT INTO public.rider (id, name, nation, team_key, name_key, age, price_2025, score_2025, score_2024, type) VALUES (2, 'Remco Evenepole', 'BEL', 'Soudal Quick-Step', 'remco-evenepole', 25, 30, 0, 0, false);`
  await prisma.$executeRaw`INSERT INTO public.rider (id, name, nation, team_key, name_key, age, price_2025, score_2025, score_2024, type) VALUES (3, 'Mathieu van der Poel', 'NED', 'Alpecin - Deceuninck', 'mathieu-van-der-poel', 30, 30, 0, 0, false);`
  await prisma.$executeRaw`INSERT INTO public.rider (id, name, nation, team_key, name_key, age, price_2025, score_2025, score_2024, type) VALUES (5, 'Wout van Aert', 'BEL', 'Jumbo - Visma', 'wout-van-aert', 27, 30, 0, 0, false);`
  await prisma.$executeRaw`INSERT INTO public.rider (id, name, nation, team_key, name_key, age, price_2025, score_2025, score_2024, type) VALUES (4, 'Tadej Pogacar', 'SLO', 'UAE Team Emirates - XRG', 'tadej-pogacar', 23, 50, 0, 0, false);`
  await prisma.$executeRaw`INSERT INTO public.rider (id, name, nation, team_key, name_key, age, price_2025, score_2025, score_2024, type) VALUES (6, 'Julian Alaphilippe', 'FRA', 'Soudal Quick-Step', 'julian-alaphilippe', 29, 2, 0, 0, false);`
  await prisma.$executeRaw`INSERT INTO public.rider (id, name, nation, team_key, name_key, age, price_2025, score_2025, score_2024, type) VALUES (7, 'Primoz Roglic', 'SLO', 'Jumbo - Visma', 'primoz-roglic', 31, 26, 0, 0, false);`
  await prisma.$executeRaw`INSERT INTO public.rider (id, name, nation, team_key, name_key, age, price_2025, score_2025, score_2024, type) VALUES (8, 'Egan Bernal', 'COL', 'Ineos Grenadiers', 'egan-bernal', 24, 4, 0, 0, false);`
  await prisma.$executeRaw`INSERT INTO public.rider (id, name, nation, team_key, name_key, age, price_2025, score_2025, score_2024, type) VALUES (9, 'Richard Carapaz', 'ECU', 'Ineos Grenadiers', 'richard-carapaz', 28, 10, 0, 0, false);`
  await prisma.$executeRaw`INSERT INTO public.rider (id, name, nation, team_key, name_key, age, price_2025, score_2025, score_2024, type) VALUES (10, 'Annemiek van Vleuten', 'NED', 'Movistar Team', 'annemiek-van-vleuten', 39, 20, 0, 0, true);`
  await prisma.$executeRaw`INSERT INTO public.rider (id, name, nation, team_key, name_key, age, price_2025, score_2025, score_2024, type) VALUES (11, 'Marianne Vos', 'NED', 'Jumbo - Visma', 'marianne-vos', 34, 30, 0, 0, true);`
  await prisma.$executeRaw`INSERT INTO public.rider (id, name, nation, team_key, name_key, age, price_2025, score_2025, score_2024, type) VALUES (12, 'Ellen van Dijk', 'NED', 'Trek - Segafredo', 'ellen-van-dijk', 34, 30, 0, 0, true);`
  await prisma.$executeRaw`INSERT INTO public.rider (id, name, nation, team_key, name_key, age, price_2025, score_2025, score_2024, type) VALUES (13, 'Lisa Brennauer', 'GER', 'Ceratizit - WNT', 'lisa-brennauer', 33, 30, 0, 0, true);`
  await prisma.$executeRaw`INSERT INTO public.rider (id, name, nation, team_key, name_key, age, price_2025, score_2025, score_2024, type) VALUES (14, 'Elisa Longo Borghini', 'ITA', 'Trek - Segafredo', 'elisa-longo-borghini', 30, 50, 0, 0, true);`

    await prisma.$executeRaw`INSERT INTO public.race (id, "name", name_key, nation, "date", "type", category) VALUES (2, 'Strade Bianche', 'strade-bianche', 'Italy', '2025-03-09 00:00:00.000', false, 'UCI World Tour');`
    await prisma.$executeRaw`INSERT INTO public.race (id, "name", name_key, nation, "date", "type", category) VALUES (3, 'Omloop Nieuwsblad', 'omloop-nieuwsbald', 'Belgium', '2025-03-08 00:00:00.000', false, 'UCI World Tour');`
    await prisma.$executeRaw`INSERT INTO public.race (id, "name", name_key, nation, "date", "type", category) VALUES (4, 'Tour De France Stage 1', 'tour-de-france-stage-1', 'France', '2025-07-05 00:00:00.000', false, 'UCI World Tour');`
    await prisma.$executeRaw`INSERT INTO public.race (id, "name", name_key, nation, "date", "type", category) VALUES (5, 'Paris-Nice', 'paris-nice', 'France', '2025-03-14 00:00:00.000', false, 'UCI World Tour');`
    await prisma.$executeRaw`INSERT INTO public.race (id, "name", name_key, nation, "date", "type", category) VALUES (6, 'Milano-Sanremo', 'milan-sanremo', 'Italy', '2025-03-21 00:00:00.000', false, 'UCI World Tour');`

    await prisma.$executeRaw`INSERT INTO public.race (id, "name", name_key, nation, "date", "type", category) VALUES (7, 'Strade Bianch-Donne', 'strade-bianche-donne', 'Italy', '2025-03-09 00:00:00.000', true, 'WWT');`
    await prisma.$executeRaw`INSERT INTO public.race (id, "name", name_key, nation, "date", "type", category) VALUES (8, 'Milano-Sanremo-Donne', 'milan-sanremo-donne', 'Italy', '2025-03-21 00:00:00.000', true, 'WWT');`
}

rawSql()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })