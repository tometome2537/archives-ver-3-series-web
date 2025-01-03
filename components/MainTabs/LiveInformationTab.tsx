import { unescapeHtml } from "@/libs/unescapeHtml";
import { Box, Divider, Typography } from "@mui/material";
import ical from "cal-parser";
import { Fragment, useEffect, useState } from "react";

type Event = {
    dtstart: {
        value: string; // ISO 8601 datetime string
    };
    dtstamp: string; // ISO 8601 datetime string
    uid: {
        value: string; // Unique identifier string
    };
    created: string; // ISO 8601 datetime string
    description: {
        value: string; // HTML content as a string
    };
    lastModified: string; // ISO 8601 datetime string
    location: {
        value: string; // Address or location details
    };
    sequence: {
        value: string; // Sequence number as a string
    };
    status: {
        value: "CONFIRMED" | "CANCELLED" | "TENTATIVE"; // Status of the event
    };
    summary: {
        value: string; // Event title or summary
    };
    transp: {
        value: "OPAQUE" | "TRANSPARENT"; // Transparency status
    };
};

export function LiveInformationTab() {
    const [events, setEvents] = useState<Event[]>([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch("api/liveInfo");
                const data = await response.text();
                const parsedCal = ical.parseString(data);

                setEvents(parsedCal.events);
            } catch (error) {
                console.error("Error fetching YouTube accounts:", error);
            }
        }

        fetchData();
    }, []);

    return (
        <Fragment>
            {events.map((x) => {
                return (
                    <Box
                        key={x.uid.value}
                        sx={{
                            border: "1px solid",
                            borderColor: "grey.400",
                            borderRadius: 1,
                            p: 2,
                            mb: 2,
                        }}
                    >
                        <Typography variant="h6">{x.summary.value}</Typography>
                        <Typography variant="body1">
                            {x.description.value.split("<br>").map((line) => (
                                <Typography key={line}>
                                    {unescapeHtml(
                                        line.replaceAll(/<[^>]+>/g, ""),
                                    )}
                                </Typography>
                            ))}
                        </Typography>
                    </Box>
                );
            })}
        </Fragment>
    );
}
