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

declare const licenses: Licenses;

export default licenses;
