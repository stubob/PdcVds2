import RaceResultTable from "./RaceResultTable";
import { headers } from "next/headers";
import { getMensRiders, getRaceById, getRaceResultById, getWomensRiders } from "../../../../datalayer";

export default async function RaceAdminPage() {
    const headerList = await headers();
    const pathname = headerList.get("x-current-path") ?? '';
    const id = parseInt(pathname[pathname.length - 1], 10); // Get the last part of the pathname and convert to number

    const dataPromise = getRaceResultById(Number(id));
    const metadataPromise = getRaceById(Number(id));
    const mensRiderDataPromise = getMensRiders();
    const womensRiderDataPromise = getWomensRiders();
    
    const [data, metadata, mensRiderData, womensRiderData] = await Promise.all([
        dataPromise,
        metadataPromise,
        mensRiderDataPromise,
        womensRiderDataPromise,
    ]);

    // Handle null or undefined data
    const raceData = data ?? []; // Default to an empty array if data is null

    // Provide a proper fallback for metadata
    const raceMetadata = metadata ?? {
        name: "Unknown Race",
        id: 0,
        nameKey: "unknown",
        nation: "Unknown",
        type: false,
        date: new Date(),
        category: "Unknown",
    };
    const mensRiderDataSafe = mensRiderData ?? []; // Default to an empty array if mensRiderData is null
    const womensRiderDataSafe = womensRiderData ?? []; // Default to an empty array if womensRiderData is null

    return (
        <main>
            <RaceResultTable
                raceData={raceData}
                metadata={raceMetadata}
                mensRiderData={mensRiderDataSafe}
                womensRiderData={womensRiderDataSafe}
            />
        </main>
    );
}