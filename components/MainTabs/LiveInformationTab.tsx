import { useApiDataContext } from "@/contexts/ApiDataContext";

import { Box, Typography } from "@mui/material";
import { Fragment } from "react";
import { EventCard } from "../LiveInformation/EventCard";
import type { PlayerItem } from "../PlayerView";

type LiveInformationTabProps = {};

export function LiveInformationTab(props: LiveInformationTabProps) {
    const apiData = useApiDataContext("LiveInformation");

    return (
        <Fragment>
            {/* イベント一覧 */}
            <Typography variant="h6" sx={{ mb: 2 }}>
                イベント情報
            </Typography>
            {apiData.LiveInformation.data.length > 0 ? (
                apiData.LiveInformation.data.map((event) => (
                    <EventCard key={event.id} event={event} />
                ))
            ) : (
                <Typography>イベント情報はありません</Typography>
            )}
        </Fragment>
    );
}
