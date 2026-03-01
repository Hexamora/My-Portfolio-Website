(() => {
const allowedKey = "OX48I-9x71A";

const runProtection = () => {

    const params = new URLSearchParams(window.location.search);
    const key = params.get("key");

    const allow = () => {
        document.documentElement.style.setProperty("display","block","important");
        document.body.style.setProperty("display","block","important");
    };

    const deny = () => {
        document.open();
        document.write(`
        <h1 style="
        margin:0;
        height:100vh;
        display:flex;
        flex-direction:column;
        align-items:center;
        justify-content:center;
        background:linear-gradient(135deg,#020617,#0f172a);
        color:white;
        font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;
        text-align:center;
        letter-spacing:0.5px;
        ">

        <span style="
        font-size:48px;
        margin-bottom:20px;
        ">🔐 Access Restricted</span>

        <span style="
        font-size:18px;
        color:#cbd5e1;
        max-width:600px;
        line-height:1.6;
        ">
        Untuk mengakses website ini anda harus mendapatkan <b style='color:#38bdf8'>Secret Key</b> terlebih dahulu.
        Silakan hubungi pemilik website atau gunakan link invite.
        </span>

        <span style="
        margin-top:30px;
        font-size:14px;
        color:#64748b;
        ">
        Error Code: 403 • Unauthorized Access
        </span>

        </h1>
        `);
        document.close();
        throw new Error("ACCESS BLOCKED");
    };

    if (key === allowedKey) {
        sessionStorage.setItem("access", "granted");
        allow();
    } else if (sessionStorage.getItem("access") === "granted") {
        allow();
    } else {
        deny();
    }
};

document.addEventListener("DOMContentLoaded", runProtection);
})();