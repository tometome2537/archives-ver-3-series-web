// import { DatePickerProps } from "@mui/x-data-pickers/DatePicker.types";
import {
    DatePicker as DatePickerBase,
    LocalizationProvider,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { jaJP } from "@mui/x-date-pickers/locales";
import dayjs from "dayjs";
import "dayjs/locale/ja";
import ja from "dayjs/locale/ja";

type MyDatePickerProps = {
    id: string;
    label: string;
    autoComplete?: string | undefined;
    error?: boolean | undefined;
    helperText?: string | undefined;
    defaultValue?: dayjs.Dayjs | undefined;
    value: dayjs.Dayjs | null;
    setValue: (value: dayjs.Dayjs | null) => void;
    disabled?: boolean;
};

export const DatePicker: React.FC<MyDatePickerProps> = ({
    id,
    label,
    autoComplete,
    error,
    helperText,
    value,
    setValue,
    defaultValue,
    disabled,
}): JSX.Element => {
    dayjs.locale(ja);

    return (
        <LocalizationProvider
            dateAdapter={AdapterDayjs}
            adapterLocale="ja"
            dateFormats={{ year: "YYYY年" }}
            localeText={
                jaJP.components.MuiLocalizationProvider.defaultProps.localeText
            }
        >
            <DatePickerBase
                defaultValue={defaultValue}
                value={value}
                format="YYYY年MM月DD日"
                slotProps={{
                    calendarHeader: { format: "YYYY年MM月" },
                    textField: {
                        error: error,
                        size: "medium",
                        helperText: helperText,
                        margin: "normal",
                        fullWidth: true,
                        id: id,
                        label: label,
                        autoComplete: autoComplete,
                    },
                }}
                onChange={(newValue) => {
                    if (setValue) {
                        setValue(newValue);
                    }
                }}
                disabled={disabled}
            />
        </LocalizationProvider>
    );
};
