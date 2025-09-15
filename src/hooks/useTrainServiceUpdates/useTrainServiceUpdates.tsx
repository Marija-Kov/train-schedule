import { useEffect, useState } from "react";

const useTrainServiceUpdates = () => {
    const [updates, setUpdates] = useState<{ id: number, content: string }[]>([]);
    const [loadingUpdates, setLoadingUpdates] = useState(false);

    const trainServiceUpdates = async () => {
        setLoadingUpdates(true);
        const currentDateTime = new Date().toISOString().split(".")[0];
        const currentDate = currentDateTime.split("T")[0];

        const response = await fetch('https://www.srbvoz.rs/wp-json/wp/v2/info_post?per_page=30');
        if ([500, 404, 403, 401].includes(response.status) || !response.ok) {
            // @ts-expect-error TODO: investigate the issue with updates state type
            setUpdates("Data not available");
            setLoadingUpdates(false);
            return
        }

        const data = await response.json();

        const filteredUpdates: { id: number, content: string }[] = data.filter((update: { date: string; slug: string; }) => {
            const updateDate = update.date.split("T")[0];
            return updateDate === currentDate && update.slug.match(/bgvoz/i);
        }).map((update: { id: number, content: { rendered: string } }) => {
            return { id: update.id, content: update.content.rendered.split('\n')[1].slice(3, -4) }
        }).filter((update: { id: number, content: string }) => {
            return !update.content.match(/(Resnik|Mladenov|Lazarev)/i);
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

