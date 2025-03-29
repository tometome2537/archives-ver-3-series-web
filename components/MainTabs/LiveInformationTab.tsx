import { useApiDataContext } from "@/contexts/ApiDataContext";
import { useAppleMusic } from "@/contexts/AppleMusicContext";
import { Box, Typography } from "@mui/material";
import { Fragment } from "react";
import { AppleMusicControls } from "../LiveInformation/AppleMusicControls";
import { EventCard } from "../LiveInformation/EventCard";
import type { PlayerItem } from "../PlayerView";

type LiveInformationTabProps = {
    playerItem: PlayerItem | undefined;
};

export function LiveInformationTab(props: LiveInformationTabProps) {
    const musicKit = useAppleMusic();
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
            <AppleMusicControls musicKit={musicKit} />
            {props.playerItem && (
                <Box sx={{ mb: 3 }}>
                    <Typography variant="h6"> 現在の再生情報;</Typography>
                    {JSON.stringify(props.playerItem, null, 2)}
                </Box>
            )}
        </Fragment>
    );
}
