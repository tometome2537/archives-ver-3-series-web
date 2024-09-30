import { Box } from "@mui/material";

export interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

export function CustomTabPanel(props: TabPanelProps) {
    const { children, index, value, ...other } = props;

    return (
        <Box
            role="tabpanel"
            hidden={value !== index}
            id={`tab_${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 1 }}>{children}</Box>}
        </Box>
    );
}
