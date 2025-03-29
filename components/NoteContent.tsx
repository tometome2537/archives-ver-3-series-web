import { Link } from "@mui/material";
import type React from "react";

export interface NoteContentProps {
    content: string;
}

/**
 * テキスト中の #で始まるハッシュタグをリンクに変換するコンポーネント
 */
const NoteContent: React.FC<NoteContentProps> = ({ content }) => {
    function findHashtags(searchText: string): [string[], string[]] {
        const regexp = /#[^#\s]*/g;
        const hashtags = searchText.match(regexp) || [];
        const result = searchText.split(regexp);
        if (result.length > 0 && result[result.length - 1] === "") {
            result.pop();
        }
        return [result, hashtags];
    }

    const [results, hashtags] = findHashtags(content);

    const hashtagLinks = hashtags.map((x) => (
        <Link
            href="#"
            key={x}
            color="primary"
            sx={{ display: "inline", paddingRight: 1 }}
        >
            {x}
        </Link>
    ));

    if (results === null && hashtagLinks === null) {
        return <span>{content}</span>;
    }

    if (results === null) {
        return <span>{hashtagLinks}</span>;
    }

    if (hashtagLinks === null) {
        return <span>{content}</span>;
    }

    const merged: React.ReactNode[] = [];
    const maxLength = Math.max(results.length, hashtagLinks.length);

    for (let i = 0; i < maxLength; i++) {
        if (i < results.length) {
            if (results[i] != null && results[i].trim() !== "") {
                merged.push(results[i]);
            }
        }
        if (i < hashtagLinks.length) {
            merged.push(hashtagLinks[i]);
        }
    }

    return <span>{merged}</span>;
};

export default NoteContent;
