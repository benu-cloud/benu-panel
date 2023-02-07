import { useEffect } from 'react';
import emitter from '../Modules/emitter';

const useWebRtcStats = (peerConnection) => {

    useEffect(() => {
        let startTime = new Date().getTime() / 1000;
        let constStartTime = new Date().getTime() / 1000;
        let vBytesStart = 0;
        let connectionDetails = {
            timeElapsed: 0,
            timestamp: 0, // from transport.candidate_pair
            codecName: "NA", // from incoming-rtp.codec
            connectionType: "NA", // from the transport.candiate-pair.remote-candidate
            transportBytesReceived: 0, // from the transport
            transportBytesSent: 0, // from the transport
            latency: 0, // calculated
            videoBytesReceived: 0, //from incoming-rtp
            currentRoundTripTime: 0, // from transport.candidate_pair
            decoder: "NA", // from incoming-rtp
            framesPerSecond: 0, // from incoming-rtp
            packetsReceived: 0, // from incoming-rtp
            packetsLost: 0, // from incoming-rtp
            packetsLostPct: 0, // calculated
            transportBitrateNow: 0, // calculated
            transportBitrateAvg: 0, // calculated
            frameHeight: 0, // from incoming-rtp
            frameWidth: 0, // from incoming-rtp
            availableOutgoingBitrate: 0, // from transport.candidate-pair
        };
        const fetchStat = () => {
            peerConnection.getStats(null).then((stats) => {
                stats.forEach((report) => {
                    switch (report.type) {
                        case "transport":
                            connectionDetails.transportBytesReceived = (report.bytesReceived * 1e-6).toFixed(2) + " MB";
                            connectionDetails.transportBytesSent = (report.bytesSent * 1e-6).toFixed(2) + " MB";
                            var now = new Date().getTime() / 1000;
                            connectionDetails.timeElapsed = (now - constStartTime).toFixed(2) + "s";
                            connectionDetails.transportBitrateNow = (((report.bytesReceived - vBytesStart) / (now - startTime)) * 8 / 1e+6).toFixed(2) + "Mb";
                            connectionDetails.transportBitrateAvg = (((report.bytesReceived) / (now - constStartTime)) * 8 / 1e+6).toFixed(2) + "Mb";
                            vBytesStart = report.bytesReceived;
                            break;
                        case "candidate-pair":
                            connectionDetails.availableOutgoingBitrate = (parseInt(report.availableOutgoingBitrate) / 1e+6).toFixed(2) + " mbps";
                            connectionDetails.currentRoundTripTime = report.currentRoundTripTime * 1000 + "ms";
                            connectionDetails.totalRoundTripTime = report.totalRoundTripTime * 1000 + "ms";
                            connectionDetails.timestamp = report.timestamp;
                            break;
                        case "inbound-rtp":
                            // https://w3c.github.io/webrtc-stats/#streamstats-dict*
                            if (report.kind === "video") {
                                connectionDetails.videoBytesReceived = (report.bytesReceived * 1e-6).toFixed(2) + " MB";
                                connectionDetails.decoder = report.decoderImplementation;
                                connectionDetails.frameHeight = report.frameHeight;
                                connectionDetails.frameWidth = report.frameWidth;
                                connectionDetails.framesPerSecond = report.framesPerSecond;
                                connectionDetails.packetsReceived = report.packetsReceived;
                                connectionDetails.packetsLost = report.packetsLost;
                                connectionDetails.packetsLostPct = (report.packetsLost / report.packetsReceived * 100);
                            }
                            break;
                        case "track":
                            // https://w3c.github.io/webrtc-stats/#dom-rtcinboundrtpstreamstats-slicount
                            if (report.kind === "video") {
                                // connectionDetails.jitterBufferDelay = report.jitterBufferDelay;
                                connectionDetails.latency = parseInt(report.jitterBufferDelay / report.jitterBufferEmittedCount * 1000) + "ms";
                            }
                            break;
                        case "remote-candidate":
                            connectionDetails.connectionType = report.candidateType;
                            break;
                        case "codec":
                            if (report.payloadType === 123) {
                                connectionDetails.codecName = report.mimeType.split("/")[1];
                            }
                            break;
                        default:
                            break;
                    }
                });
                emitter.emit('webrtcStats', connectionDetails);
            });
        }
        const interval = setInterval(() => fetchStat(), 250);
        console.log('useWebrtcstate useEffet');
        console.log('**', peerConnection);
        return () => {
            clearInterval(interval);
        }
    }, [peerConnection]);
}

export default useWebRtcStats;