import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function rawSql() {
  await prisma.$executeRaw`INSERT INTO public.rider (name, nation, team_key, name_key, age, price_2025, score_2025, score_2024, type) VALUES ('Adam Yates', 'GBR', 'UAE Team Emirates - XRG', 'adam-yates', 32, 20, 0, 0, false);`
  await prisma.$executeRaw`INSERT INTO public.rider (name, nation, team_key, name_key, age, price_2025, score_2025, score_2024, type) VALUES ('Remco Evenepole', 'BEL', 'Soudal Quick-Step', 'remco-evenepole', 25, 30, 0, 0, false);`
  await prisma.$executeRaw`INSERT INTO public.rider (name, nation, team_key, name_key, age, price_2025, score_2025, score_2024, type) VALUES ('Mathieu van der Poel', 'NLD', 'Alpecin - Deceuninck', 'mathieu-van-der-poel', 30, 30, 0, 0, false);`
  await prisma.$executeRaw`INSERT INTO public.rider (name, nation, team_key, name_key, age, price_2025, score_2025, score_2024, type) VALUES ('Wout van Aert', 'BEL', 'Jumbo - Visma', 'wout-van-aert', 27, 30, 0, 0, false);`
  await prisma.$executeRaw`INSERT INTO public.rider (name, nation, team_key, name_key, age, price_2025, score_2025, score_2024, type) VALUES ('Tadej Pogacar', 'SVK', 'UAE Team Emirates - XRG', 'tadej-pogacar', 23, 50, 0, 0, false);`
  await prisma.$executeRaw`INSERT INTO public.rider (name, nation, team_key, name_key, age, price_2025, score_2025, score_2024, type) VALUES ('Julian Alaphilippe', 'FRA', 'Soudal Quick-Step', 'julian-alaphilippe', 29, 2, 0, 0, false);`
  await prisma.$executeRaw`INSERT INTO public.rider (name, nation, team_key, name_key, age, price_2025, score_2025, score_2024, type) VALUES ('Primoz Roglic', 'SVK', 'Jumbo - Visma', 'primoz-roglic', 31, 26, 0, 0, false);`
  await prisma.$executeRaw`INSERT INTO public.rider (name, nation, team_key, name_key, age, price_2025, score_2025, score_2024, type) VALUES ('Egan Bernal', 'COL', 'Ineos Grenadiers', 'egan-bernal', 24, 4, 0, 0, false);`
  await prisma.$executeRaw`INSERT INTO public.rider (name, nation, team_key, name_key, age, price_2025, score_2025, score_2024, type) VALUES ('Richard Carapaz', 'ECU', 'Ineos Grenadiers', 'richard-carapaz', 28, 10, 0, 0, false);`
  await prisma.$executeRaw`INSERT INTO public.rider (name, nation, team_key, name_key, age, price_2025, score_2025, score_2024, type) VALUES ('Annemiek van Vleuten', 'NLD', 'Movistar Team', 'annemiek-van-vleuten', 39, 20, 0, 0, true);`
  await prisma.$executeRaw`INSERT INTO public.rider (name, nation, team_key, name_key, age, price_2025, score_2025, score_2024, type) VALUES ('Marianne Vos', 'NLD', 'Jumbo - Visma', 'marianne-vos', 34, 30, 0, 0, true);`
  await prisma.$executeRaw`INSERT INTO public.rider (name, nation, team_key, name_key, age, price_2025, score_2025, score_2024, type) VALUES ('Ellen van Dijk', 'NLD', 'Trek - Segafredo', 'ellen-van-dijk', 34, 30, 0, 0, true);`
  await prisma.$executeRaw`INSERT INTO public.rider (name, nation, team_key, name_key, age, price_2025, score_2025, score_2024, type) VALUES ('Lisa Brennauer', 'GER', 'Ceratizit - WNT', 'lisa-brennauer', 33, 30, 0, 0, true);`
  await prisma.$executeRaw`INSERT INTO public.rider (name, nation, team_key, name_key, age, price_2025, score_2025, score_2024, type) VALUES ('Elisa Longo Borghini', 'ITA', 'Trek - Segafredo', 'elisa-longo-borghini', 30, 50, 0, 0, true);`

    await prisma.$executeRaw`INSERT INTO public.race ("name", name_key, nation, "date", "type", category) VALUES ('Strade Bianche', 'strade-bianche', 'Italy', '2025-03-09 00:00:00.000', false, 'Monuments and Worlds');`
    await prisma.$executeRaw`INSERT INTO public.race ("name", name_key, nation, "date", "type", category) VALUES ('Omloop Nieuwsblad', 'omloop-nieuwsbald', 'Belgium', '2025-03-08 00:00:00.000', false, 'Top Classics');`
    await prisma.$executeRaw`INSERT INTO public.race ("name", name_key, nation, "date", "type", category) VALUES ('Tour De France Stage 1', 'tour-de-france-stage-1', 'France', '2025-07-05 00:00:00.000', false, 'Grand Tour-Stage');`
    await prisma.$executeRaw`INSERT INTO public.race ("name", name_key, nation, "date", "type", category) VALUES ('Paris-Nice Stage 1', 'paris-nice', 'France', '2025-03-14 00:00:00.000', false, 'Top Stage Races-Stage');`
    await prisma.$executeRaw`INSERT INTO public.race ("name", name_key, nation, "date", "type", category) VALUES ('Milano-Sanremo', 'milan-sanremo', 'Italy', '2025-03-21 00:00:00.000', false, 'Monuments and Worlds');`
    await prisma.$executeRaw`INSERT INTO public.race ("name", name_key, nation, "date", "type", category) VALUES ('Strade Bianch-Donne', 'strade-bianche-donne', 'Italy', '2025-03-09 00:00:00.000', true, 'Monuments and Worlds');`
    await prisma.$executeRaw`INSERT INTO public.race ("name", name_key, nation, "date", "type", category) VALUES ('Milano-Sanremo-Donne', 'milan-sanremo-donne', 'Italy', '2025-03-21 00:00:00.000', true, 'Monuments and Worlds');`
    await prisma.$executeRaw`INSERT INTO public.race ("name", name_key, nation, "date", "type", category) VALUES ('Garmin Gravel Worlds', 'garmin-gravel-worlds', 'United States', '2025-07-04 00:00:00.000', false, 'Minor Races (SSRs)');`
}

rawSql()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })