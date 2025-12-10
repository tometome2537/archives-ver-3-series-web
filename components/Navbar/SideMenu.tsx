"use client";

import { useColorModeContext } from "@/contexts/ThemeContext";
import packageJson from "@/package.json";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import { useTheme } from "@mui/material/styles";
import { BetaSiteLinkSection } from "./SideMenuSections/BetaSiteLinkSection";
import { ContactSection } from "./SideMenuSections/ContactSection";
import { CopyrightSection } from "./SideMenuSections/CopyrightSection";
import { HeaderSection } from "./SideMenuSections/HeaderSection";
import { LegalSection } from "./SideMenuSections/LegalSection";
import { OfficialLinkSection } from "./SideMenuSections/OfficialLinkSection";
import { ProjectLinkSection } from "./SideMenuSections/ProjectLinkSection";
import { SpecialThanksSection } from "./SideMenuSections/SpecialThanksSection";
import { ThemeSection } from "./SideMenuSections/ThemeSection";
import { AppleMusicSection } from "./SideMenuSections/AppleMusicSection";

interface SideMenuProps {
    open: boolean;
    onClose: () => void;
}

export default function SideMenu({ open, onClose }: SideMenuProps) {
    const theme = useTheme();
    const { selectedMode, setColorMode } = useColorModeContext();

    return (
        <Drawer anchor={"left"} open={open} onClose={onClose}>
            <List>
                <HeaderSection onClose={onClose} />
                <Divider sx={{ borderBottomWidth: 3 }} />

                <AppleMusicSection theme={theme} />
                <Divider sx={{ borderBottomWidth: 3 }} />

                <OfficialLinkSection theme={theme} />
                <Divider sx={{ borderBottomWidth: 3 }} />

                <ThemeSection
                    selectedMode={selectedMode}
                    setColorMode={(mode) => {
                        setColorMode(mode);
                        onClose();
                    }}
                />
                <Divider sx={{ borderBottomWidth: 3 }} />

                <ProjectLinkSection theme={theme} />
                <ContactSection />

                <Divider sx={{ borderBottomWidth: 3 }} />
                <SpecialThanksSection onClose={onClose} />

                <Divider sx={{ borderBottomWidth: 3 }} />
                <LegalSection />

                <Divider sx={{ borderBottomWidth: 3 }} />
                <BetaSiteLinkSection theme={theme} />

                <Divider sx={{ borderBottomWidth: 3 }} />
                <CopyrightSection
                    onClose={onClose}
                    version={packageJson.version}
                />
            </List>
        </Drawer>
    );
}
