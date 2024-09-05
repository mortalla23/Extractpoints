const clusters = require("./generic/clusters");
const commands = require("./generic/commands");
const utils = require("./utils/common-utils");
const pointExtractions = require("./extractPoints");

function decode(bytes, fPort, isUplink) {
    const decoded = {};
    if (fPort !== 125 && fPort !== 6) {
        throw "only fPort 6 or 125 are supported";
    }
    if (fPort === 6) {
        if (bytes.length < 7) {
            throw "payload for fPort 6 is too short";
        }

        let hexBytes = utils.bytesToHex(bytes);

        if (
            (isUplink && hexBytes.startsWith("7ef700f354")) ||
            (!isUplink && hexBytes.startsWith("7ef700f3450000"))
        ) {
            decoded.Header = utils.bytesToHex(bytes.slice(0, 7));
            bytes = bytes.slice(7);
        } else {
            decoded.Version = utils.hexToDec(hexBytes.slice(0, 1));
            hexBytes = hexBytes.slice(1);
            decoded.Priority = utils.hexToDec(hexBytes.slice(0, 1));
            hexBytes = hexBytes.slice(1);
            hexBytes = hexBytes.slice(6);
            decoded.PayLength = utils.hexToDec(hexBytes.slice(0, 4));
            hexBytes = hexBytes.slice(4);
            decoded.NextHdr = hexBytes.slice(0, 2);
            hexBytes = hexBytes.slice(2);
            decoded.HopLimit = utils.hexToDec(hexBytes.slice(0, 2));
            hexBytes = hexBytes.slice(2);
            if (hexBytes.length > 31) {
                decoded.SAddr = hexBytes.slice(0, 32);
                hexBytes = hexBytes.slice(32);
                decoded.DAddr = hexBytes.slice(0, 32);
                hexBytes = hexBytes.slice(32);
                decoded.SrcPortTxt = hexBytes.slice(0, 4);
                decoded.SrcPort = utils.hexToDec(decoded.SrcPortTxt);
                hexBytes = hexBytes.slice(4);
                decoded.DstPortTxt = hexBytes.slice(0, 4);
                decoded.DstPort = utils.hexToDec(decoded.DstPortTxt);
                hexBytes = hexBytes.slice(4);
                decoded.UdpLength = utils.hexToDec(hexBytes.slice(0, 4));
                hexBytes = hexBytes.slice(4);
                if (hexBytes.length > 3) {
                    decoded.Checksum = hexBytes.slice(0, 4);
                } else {
                    decoded.Checksum = hexBytes.slice(0);
                }
                if (hexBytes.length > 0) {
                    hexBytes = hexBytes.slice(4);
                    bytes = utils.hexToBytes(hexBytes);
                }
            }

        }
    }
    const batch = !(bytes[0] & 0x01);
    if (batch === false) {
        if (bytes.length < 4) {
            throw (
                "command size cannot be lower than 4, received: " +
                utils.bytesToHex(bytes)
            );
        }
        decoded.Report = "Standard";
        const endpoint = bytes.shift();
        decoded.EndPoint = ((endpoint & 0xe0) >> 5) | ((endpoint & 0x06) << 2);
        decoded.CommandID = commands.decodeCommandId(bytes.shift());
        decoded.ClusterID = clusters.decodeClusterId([
            bytes.shift(),
            bytes.shift(),
        ]);
        return commands.decodeCommand(decoded, bytes);
    }

    throw "batch commands are not supported";

}

function decodeUplink(input) {
    const message = decode(input.bytes, input.fPort, true);

    if (
        message.CommandID === "ReadAttribute" ||
        message.CommandID === "WriteAttributeNoResponse" ||
        message.CommandID === "ConfigureReporting" ||
        message.CommandID === "ReadReportingConfiguration" ||
        message.CommandID === "ClusterSpecificCommand"
    ) {
        throw (
            "unable to decode uplink because command " +
            message.CommandID +
            " is not an uplink"
        );
    }

    return message;
}

function decodeDownlink(input) {
    const message = decode(input.bytes, input.fPort, false);

    if (
        message.CommandID === "ReadAttributeResponse" ||
        message.CommandID === "ConfigureReportingResponse" ||
        message.CommandID === "ReadReportingConfigurationResponse" ||
        message.CommandID === "ReportAttributes" ||
        message.CommandID === "ReportAttributesAlarm"
    ) {
        throw (
            "unable to decode downlink because command " +
            message.CommandID +
            " is not a downlink"
        );
    }

    return message;
}

function encodeDownlink(message) {
    let bytes = [];
    let result = {};

    utils.checkRequiredField(message, "EndPoint");
    utils.checkRequiredField(message, "ClusterID");
    utils.checkRequiredField(message, "CommandID");
    utils.checkRequiredField(message, "Report");

    utils.checkIntField(message, "EndPoint");

    if (message.Header !== undefined) {
        bytes = bytes.concat(utils.parseHexString(message.Header));
    }

    let fctrl = 0x10;
    if ((message.EndPoint & 0x04) === 0x04) {
        fctrl = fctrl | 0x80;
    }
    if ((message.EndPoint & 0x02) === 0x02) {
        fctrl = fctrl | 0x40;
    }
    if ((message.EndPoint & 0x01) === 0x01) {
        fctrl = fctrl | 0x20;
    }
    if ((message.EndPoint & 0x10) === 0x10) {
        fctrl = fctrl | 0x04;
    }
    if ((message.EndPoint & 0x08) === 0x08) {
        fctrl = fctrl | 0x02;
    }
    if (message.Report !== "Standard") {
        throw "unknown report type: " + message.Report;
    } else {
        fctrl = fctrl | 0x01;
    }

    bytes.push(fctrl);
    bytes.push(commands.encodeCommandId(message.CommandID));
    bytes = bytes.concat(clusters.encodeClusterId(message.ClusterID));

    result.bytes = commands.encodeCommand(message, bytes);
    result.fPort = 125;
    return result;

}

function extractPoints(input) {
    return pointExtractions.extractPoints(input);
}

exports.decodeUplink = decodeUplink;
exports.decodeDownlink = decodeDownlink;
exports.encodeDownlink = encodeDownlink;
exports.extractPoints = extractPoints;