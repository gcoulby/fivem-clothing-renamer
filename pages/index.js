import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import "bootstrap/dist/css/bootstrap.css";
// const fs = require("fs");
import { FileUploader } from "react-drag-drop-files";
import React, { useState } from "react";
import JSZip from "jszip";

export default function Home() {
    const handleButtonSubmit = (e) => {
        assetIds.push(e.target.value);
    };

    const [gender, setGender] = useState("");
    const [type, setType] = useState("");
    const [files, setFiles] = useState(null);
    const [assetCode, setAssetCode] = useState("");
    const [assetCodes, setAssetCodes] = useState([]);
    const [enableFileDrop, setEnableFileDrop] = useState(false);
    const alphabet = "abcdefghijklmnopqrstuvwxyz".split("");

    const fileTypes = ["YTD", "YDD"];
    const handleChange = (files) => {
        console.log(files);
        setFiles(files);
        let ytdCnt = 0;
        let zip = new JSZip();
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const fileName = file.name;
            const fileType = fileName.split(".")[1];
            console.log(fileName, fileType);

            if (!fileName.includes(type)) {
                console.log("Invalid clothing/hair for the options selected.");
            } else {
                let idx = assetCode.indexOf(type);
                let namePt1 = assetCode.substring(0, idx - 1);
                let namePt2 = assetCode.substring(idx);

                let name = `${namePt1}^${namePt2}`;
                if (fileType.toString().toLowerCase() === "ydd") {
                    name += "_u.ydd";
                } else if (fileType.toString().toLowerCase() === "ytd") {
                    name += `_${alphabet[ytdCnt]}_uni.ytd`;
                    ytdCnt++;
                }

                zip.file(name, files[i]);
            }
        }

        zip.generateAsync({ type: "blob" }).then((blob) => {
            var a = document.createElement("a");
            document.body.appendChild(a);
            a.setAttribute("style", "display:none");
            let url = window.URL.createObjectURL(blob);
            a.href = url;
            a.download = "fivem_clothing.zip";
            a.click();
            window.URL.revokeObjectURL(url);
        });

        fetch(`/api/update-asset?in_use=1&asset_name=${assetCode}`);
        resetState();
    };

    const resetState = () => {
        setGender("");
        setType("");
        setFiles(null);
        setAssetCode("");
        setAssetCodes([]);
        setEnableFileDrop(false);
    };

    const changeGender = (e) => {
        setGender(e.target.value);
        setEnableFileDropIfValid(e.target.value, type, assetCode);
        updateAssetCodes(e.target.value, type);
    };

    const changeType = (e) => {
        setType(e.target.value);
        setEnableFileDropIfValid(gender, e.target.value, assetCode);
        updateAssetCodes(gender, e.target.value);
    };

    const changeAssetCode = (e) => {
        setAssetCode(e.target.value);
        setEnableFileDropIfValid(gender, type, e.target.value);
    };

    const setEnableFileDropIfValid = (gender, type, assetCode) => {
        setEnableFileDrop(gender !== "" && type !== "" && assetCode !== "");
    };

    const updateAssetCodes = (gender, type) => {
        if (gender !== "" && type !== "") {
            //get request to api/get-assets
            fetch(`/api/get-assets?type=${type}&gender=${gender}`)
                .then((response) => response.json())
                .then((data) => {
                    console.log(data);
                    setAssetCodes(data);
                });
        } else {
            setAssetCodes([]);
        }
    };

    return (
        <div className={styles.container}>
            <div className="container bg-dark">
                <Head>
                    <title>Create Next App</title>
                    <meta name="description" content="Generated by create next app" />
                    <link rel="icon" href="/favicon.ico" />
                </Head>

                <main className={styles.main}>
                    <img src="https://integrityroleplay.co.uk/landing-page/integrity-trans.png" width="300" alt="integrity logo" />
                    <h1 className="display-1 text-light">FiveM Clothing Renamer</h1>

                    <p className="text-light">Drag a YDD (for one item of clothing) and corresponding YTDs into the box.</p>

                    <select value={gender} onChange={(e) => changeGender(e)} className="form-control bg-dark text-light mb-4">
                        <option value="">Select gender...</option>
                        <option value="m">Male</option>
                        <option value="f">Female</option>
                    </select>

                    <select value={type} onChange={(e) => changeType(e)} className="form-control bg-dark text-light mb-4">
                        <option value="">Select type...</option>
                        <option value="accs">Shirt (accs)</option>
                        <option value="berd">Mask (berd)</option>
                        <option value="decl">Decals (decl)</option>
                        <option value="feet">Shoes (feet)</option>
                        <option value="hair">Hair (hair)</option>
                        <option value="hand">Bags and parachute (hand)</option>
                        <option value="jbib">Jackets (jbib)</option>
                        <option value="lowr">Legs (lowr)</option>
                        <option value="task">Body armor (task)</option>
                        <option value="teef">Scarfs and Chains (teef)</option>
                        <option value="uppr">Gloves (uppr)</option>
                    </select>
                    {assetCodes.length !== 0 && (
                        <select className="form-control bg-dark text-light mb-4" value={assetCode} onChange={(e) => changeAssetCode(e)}>
                            <option value="">Select code...</option>
                            {assetCodes.map((x, i) => {
                                if (x.in_use === 0) {
                                    return (
                                        <option key={x.asset_id} value={x.asset_code}>
                                            {x.asset_id} | {x.asset_code}
                                        </option>
                                    );
                                }
                            })}
                        </select>
                    )}

                    <FileUploader
                        disabled={!enableFileDrop}
                        handleChange={(e) => handleChange(e)}
                        name="file"
                        types={fileTypes}
                        multiple={true}
                        hoverTitle={"Drop Here"}
                    />
                </main>

                <footer className={styles.footer}>
                    <a
                        href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Powered by{" "}
                        <span className={styles.logo}>
                            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
                        </span>
                    </a>
                </footer>
            </div>
        </div>
    );
}
