import { type LinkProps, Link as MUILink } from "@mui/material";
import { default as NextLink } from "next/link";
import type { ReactNode } from "react";
import React from "react";

export default function Link({
	children,
	...props
}: {
	children: ReactNode;
} & LinkProps) {
	return (
		<MUILink component={NextLink} {...props}>
			{children}
		</MUILink>
	);
}
