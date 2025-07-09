import React from "react";
import { FaDownload } from "react-icons/fa";
import QRCode from "react-qr-code";


const QRCodePreview = ({ itemNumber, price }) => {
    if (!itemNumber || !price) return null;

    const qrValue = `Item Number: ${itemNumber}, Price: ${price},total: ${itemNumber * price}`;

    const handleDownload = () => {
        const svg = document.querySelector("#qr-code svg");
        if (!svg) return;

        const serializer = new XMLSerializer();
        const svgBlob = new Blob([serializer.serializeToString(svg)], {
            type: "image/svg+xml",
        });
        const url = URL.createObjectURL(svgBlob);

        const link = document.createElement("a");
        link.href = url;
        link.download = "product-qr.svg";
        link.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="broder text-center flex justify-center gap-2">
            <div id="qr-code" className=" rounded p-2 bg-white ">
                <QRCode value={qrValue} className="w-20 h-20" />
            </div>
            <button
                onClick={handleDownload}
                className=""
            >
                <FaDownload />
            </button>
        </div>
    );
};

export default QRCodePreview;