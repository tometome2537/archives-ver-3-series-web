import Description from "@/components/Description";
import type { MultiSearchBarSearchSuggestion } from "@/components/Navbar/SearchBar/MultiSearchBar";
import type { InputValue } from "@/components/Navbar/SearchBar/SearchBar";
import { Avatar, Box, Chip } from "@mui/material";
import type { Dispatch, SetStateAction } from "react";
import type { PlayerItem } from "./types";

type PlayerInfoProps = {
    isFullscreen: boolean;
    playerItem?: PlayerItem;
    title?: string;
    author?: string;
    searchSuggestion: MultiSearchBarSearchSuggestion[];
    setInputValue: Dispatch<SetStateAction<InputValue[]>>;
    setIsFullscreen: (value: boolean) => void;
    width: number;
};

export default function PlayerInfo({
    isFullscreen,
    playerItem,
    title,
    author,
    searchSuggestion,
    setInputValue,
    setIsFullscreen,
    width,
}: PlayerInfoProps) {
    if (!isFullscreen) return null;

    // チップクリックハンドラー
    const handleChipClick = (id: string) => {
        const suggestion = searchSuggestion.find(
            (item) => item.value === id || item.label === id,
        );

        if (suggestion) {
            const value: InputValue = {
                ...suggestion,
                createdAt: new Date(),
                sort: suggestion.sort || 99,
            };

            setInputValue([value]);
        }

        setIsFullscreen(false);
    };

    const displayTitle = playerItem?.title || title;
    const displayAuthor = (playerItem?.author || author || "").replace(
        " - Topic",
        "",
    );

    return (
        <Box
            sx={{
                width: width,
                maxWidth: "100%",
                margin: "0 auto",
                display: isFullscreen ? "block" : "none",
                overflowY: "auto",
                maxHeight: "50vh",
                paddingBottom: "40vh",
            }}
        >
            {/* 動画タイトル */}
            <h3
                style={{
                    display: "block",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                }}
            >
                {displayTitle}
            </h3>

            {/* チャンネル名 */}
            <p
                style={{
                    display: "block",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                }}
            >
                {displayAuthor}
            </p>

            {/* 出演者・組織名一覧 */}
            <Box
                style={{
                    display: "flex",
                    padding: "8 auto",
                    justifyContent: "center",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "10px",
                }}
            >
                {isFullscreen &&
                playerItem &&
                (playerItem.actorId || playerItem.organizationId) &&
                (playerItem.actorId?.length !== 0 ||
                    playerItem.organizationId?.length !== 0)
                    ? [
                          ...(playerItem.actorId || []),
                          ...(playerItem.organizationId || []),
                      ].map((id) => {
                          const r = searchSuggestion.find(
                              (item) => item.value === id,
                          );
                          const label = r?.label ?? "?";
                          const imgSrc = r?.imgSrc;
                          return (
                              <Chip
                                  key={id}
                                  variant="outlined"
                                  sx={{
                                      "& .MuiChip-label": {
                                          maxWidth: "100%",
                                          whiteSpace: "nowrap",
                                          textOverflow: "ellipsis",
                                      },
                                  }}
                                  avatar={
                                      imgSrc ? (
                                          <Avatar alt={label} src={imgSrc} />
                                      ) : (
                                          <Avatar>{label[0]}</Avatar>
                                      )
                                  }
                                  label={label}
                                  color="success"
                                  onClick={() => handleChipClick(id)}
                                  onKeyPress={(e) => {
                                      if (e.key === "Enter" || e.key === " ") {
                                          e.preventDefault();
                                          e.currentTarget.click();
                                      }
                                  }}
                              />
                          );
                      })
                    : null}
            </Box>

            {/* 概要欄 */}
            <Box style={{ margin: "0.5em" }}>
                {isFullscreen && playerItem?.description && (
                    <Description
                        text={playerItem.description}
                        date={playerItem?.publishedAt}
                        maxLine={2}
                    />
                )}
            </Box>
        </Box>
    );
}
