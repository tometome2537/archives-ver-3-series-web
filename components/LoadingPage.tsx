import Image from "next/image";

export default function LoadingPage() {
    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
            }}
        >
            <div style={{ textAlign: "center" }}>
                {/* 画像のプレースホルダー */}
                <div style={{ marginBottom: "16px" }}>
                    <Image
                        src="/icon_border_radius.png"
                        alt="Loading"
                        width={40}
                        height={40}
                        style={{ objectFit: "contain" }}
                    />
                </div>

                {/* 読み込み中メッセージ */}
                <p
                    style={{
                        fontSize: "18px",
                        color: "#555",
                        animation: "fade 1s infinite",
                    }}
                >
                    読 み 込 み 中...
                </p>

                {/* CSSアニメーション */}
                <style jsx>{`
          @keyframes fade {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `}</style>
            </div>
        </div>
    );
}