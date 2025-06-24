import React from "react";
import QRCode from "react-qr-code";

const QRCodePreview = ({ itemNumber, price, size }) => {
    if (!itemNumber || !price || !size) return null;

    const qrValue = `Item Number: ${itemNumber}, Price: ${price}, Size: ${size} `;

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
        <div className="mt-4 text-center">
            {/* <h3 className="font-semibold mb-2">QR Code Preview</h3> */}
            <div id="qr-code" className="inline-block border rounded p-2 bg-white">
                <QRCode value={qrValue} />
            </div>
            <button
                onClick={handleDownload}
                className="mt-2 bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
            >
                Download QR Code
            </button>
        </div>
    );
};

export default QRCodePreview;