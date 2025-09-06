import { useEffect, useState } from "react";

const useTrainServiceUpdates = () => {
    const [updates, setUpdates] = useState([]);
    const [loadingUpdates, setLoadingUpdates] = useState(false);

    const trainServiceUpdates = async () => {
        setLoadingUpdates(true);
        const currentDateTime = new Date().toISOString().split(".")[0];
        const currentLocalTime = new Date().toTimeString().split(" ")[0]
        const currentDate = currentDateTime.split("T")[0];
        const currentTimeNum = parseInt(currentLocalTime.split(":").join(""))

        const response = await fetch('https://www.srbvoz.rs/wp-json/wp/v2/info_post?per_page=30');

        const readable = response.body;

        async function read(stream: ReadableStream<Uint8Array> | null) {
            const reader = stream?.getReader();

            const chunks: Uint8Array[] = [];
            let result;
            do {
                result = await reader?.read();
                if (result?.value !== undefined) chunks.push(result.value);
            } while (!result?.done);

            const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
            const concatenated = new Uint8Array(totalLength);

            let offset = 0;
            for (const chunk of chunks) {
                concatenated.set(chunk, offset);
                offset += chunk.length;
            }

            return concatenated;
        }

        const dataArrayBuffer = await read(readable);
        const data = JSON.parse(new TextDecoder('utf-8').decode(dataArrayBuffer));

        const filteredUpdates = data.filter((update: { date: string; slug: string; }) => {
            const updateDate = update.date.split("T")[0];
            const updateTimeNum = parseInt(update.date.split("T")[1].split(":").join(""));
            return updateDate == currentDate
                && updateTimeNum >= currentTimeNum
                && update.slug.match(/bgvoz/i);
        }).map((update: { content: { rendered: string; }; }) => update.content.rendered.split('\n')[1].slice(3, -4)
        ).filter((update: string | string[]) => {
            return update.indexOf("Resnik") === -1 && update.indexOf("Mladenov") === -1 && update.indexOf("Lazarev") === -1
        });

        setUpdates(filteredUpdates);
        setLoadingUpdates(false);
    }

    useEffect(() => {
        trainServiceUpdates();
    }, []);

    return { updates, loadingUpdates }
}

export default useTrainServiceUpdates;

