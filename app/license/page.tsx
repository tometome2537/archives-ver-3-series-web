"use client";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar/Navbar";
import { Box } from "@mui/material";
import Loading from "@/components/Loading";
import LoadingPage from "@/components/LoadingPage";

// ライセンス情報の型定義
type LicenseDetails = {
    licenses: string;
    repository?: string;
    publisher?: string;
    email?: string;
};

type Licenses = {
    [packageName: string]: LicenseDetails;
};
export default function Home() {
    const [licenses, setLicenses] = useState<Licenses | null>(null);

    useEffect(() => {
        // licenses.json を読み込む
        fetch("/licenses.json")
            .then((response) => response.json())
            .then((data) => setLicenses(data))
            .catch((error) => console.error("Error loading licenses:", error));
    }, []);

    if (!licenses) {
        return <LoadingPage />; // データが読み込まれるまでの表示
    }

    return (
        <>
            <Navbar />
            <Box style={{ padding: "40px", fontFamily: "Arial, sans-serif" }}>
                <h1 style={{ fontSize: "2.5rem", marginBottom: "20px" }}>
                    ライセンス情報
                </h1>
                <p style={{ fontSize: "1.1rem", marginBottom: "30px" }}>
                    このアプリケーションで使用されている依存関係のライセンス情報を以下に示します。
                </p>
                <ul style={{ listStyleType: "none", padding: 0 }}>
                    {Object.entries(licenses).map(([packageName, details]) => (
                        <li
                            key={packageName}
                            style={{
                                marginBottom: "20px",
                                padding: "15px",
                                border: "1px solid #ddd",
                                borderRadius: "8px",
                                // backgroundColor: "#f9f9f9",
                            }}
                        >
                            <Box
                                style={{
                                    fontSize: "1.2rem",
                                    fontWeight: "bold",
                                }}
                            >
                                {packageName}
                            </Box>
                            <Box
                                style={{
                                    marginTop: "5px",
                                    fontSize: "1rem",
                                    // color: "#555",
                                }}
                            >
                                <strong>ライセンス:</strong> {details.licenses}
                            </Box>
                            {details.repository && (
                                <Box style={{ marginTop: "10px" }}>
                                    <strong>リポジトリ:</strong>{" "}
                                    <a
                                        href={details.repository}
                                        target="_blank"
                                        rel="noreferrer"
                                        style={{
                                            color: "#0070f3",
                                            textDecoration: "none",
                                            fontWeight: "bold",
                                        }}
                                    >
                                        {details.repository}
                                    </a>
                                </Box>
                            )}
                        </li>
                    ))}
                </ul>
            </Box>
        </>
    );
}
