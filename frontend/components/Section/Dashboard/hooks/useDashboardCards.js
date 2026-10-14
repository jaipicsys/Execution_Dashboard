import { useCallback, useEffect, useState } from "react";
import { fetchDashboardCards } from "../../../../utils/api";

/*
 * Loads the six KPI cards through utils/api.js and refreshes them.
 * Returns { cards, loading, error, reload }:
 *   cards   -> { productDevelopment, productQuality, pilots, deployments, commercial, release }
 *   error   -> message when the backend itself could not be reached
 * A single card can also arrive as { error: "..." } if its data source failed.
 */
export default function useDashboardCards(refreshMs = 60000) {
    const [cards, setCards] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const load = useCallback(async (options) => {
        try {
            setCards(await fetchDashboardCards(options));
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        load();
        const id = setInterval(load, refreshMs);
        return () => clearInterval(id);
    }, [load, refreshMs]);

    // reload() skips the backend cache — handy for a manual refresh button
    const reload = useCallback(() => load({ refresh: true }), [load]);

    return { cards, loading, error, reload };
}
