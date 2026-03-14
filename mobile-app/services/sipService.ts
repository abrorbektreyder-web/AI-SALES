import {
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
  mediaDevices,
  MediaStream,
} from 'react-native-webrtc';
import { UserAgent, UserAgentOptions, Inviter, SessionState, InviterOptions, Invitation } from 'sip.js';

// Polyfill WebRTC for sip.js
(window as any).RTCPeerConnection = RTCPeerConnection;
(window as any).RTCIceCandidate = RTCIceCandidate;
(window as any).RTCSessionDescription = RTCSessionDescription;
(window as any).navigator = {
  ...((window as any).navigator || {}),
  mediaDevices: mediaDevices,
};

export class SIPService {
  private userAgent: UserAgent | null = null;
  private currentSession: Inviter | Invitation | null = null;
  private localStream: MediaStream | null = null;

  public async getLocalStream(): Promise<MediaStream> {
    if (this.localStream) return this.localStream;
    
    // Request microphone access
    const isFront = true;
    const sourceInfos = await mediaDevices.enumerateDevices() as any[];
    let videoSourceId;
    for (let i = 0; i < sourceInfos.length; i++) {
        const deviceInfo = sourceInfos[i];
        if (deviceInfo.kind == "videoinput" && deviceInfo.facing == (isFront ? "front" : "environment")) {
            videoSourceId = deviceInfo.deviceId;
        }
    }

    const stream = await mediaDevices.getUserMedia({
        audio: true,
        video: false, // Voice call only
    });
    
    this.localStream = stream as MediaStream;
    return this.localStream;
  }

  public async connect(
    serverAddress: string,
    extension: string,
    password: string,
    onRegistered?: () => void,
    onUnregistered?: () => void
  ): Promise<void> {
    const wsServerUrl = `wss://${serverAddress}/ws`; // Adjust depending on Asterisk/Freeswitch setup

    const uri = UserAgent.makeURI(`sip:${extension}@${serverAddress}`);
    if (!uri) throw new Error("Invalid SIP URI");

    const options: UserAgentOptions = {
        authorizationUsername: extension,
        authorizationPassword: password,
        uri: uri,
        transportOptions: {
            server: wsServerUrl,
        },
        delegate: {
            onInvite: (invitation) => {
                this.currentSession = invitation;
                console.log("Incoming call...");
                // Handle incoming call here
            }
        }
    };

    this.userAgent = new UserAgent(options);

    this.userAgent.transport.onConnect = () => {
        console.log("SIP Connected");
    };

    this.userAgent.transport.onDisconnect = () => {
        console.log("SIP Disconnected");
        if(onUnregistered) onUnregistered();
    };

    await this.userAgent.start();
    // In production we also send REGISTER
    // const registerer = new Registerer(this.userAgent);
    // await registerer.register();
    if(onRegistered) onRegistered();
  }

  public async makeCall(
    destination: string,
    serverAddress: string,
    onCallConnect?: () => void,
    onCallDisconnect?: () => void
  ): Promise<void> {
    if (!this.userAgent) {
        throw new Error("User agent not initialized. Call connect() first.");
    }

    const targetURI = UserAgent.makeURI(`sip:${destination}@${serverAddress}`);
    if (!targetURI) {
        throw new Error("Invalid target SIP URI");
    }

    const stream = await this.getLocalStream();
    
    // We add audio track from our local react-native-webrtc stream to the SIP inviter
    const options: InviterOptions = {
      sessionDescriptionHandlerOptions: {
        constraints: { audio: true, video: false },
        // Need to pass the localStream tracks here manually or rely on standard gUM inside sip.js via the polyfill
      }
    };

    const inviter = new Inviter(this.userAgent, targetURI, options);
    this.currentSession = inviter;

    inviter.stateChange.addListener((newState) => {
        if (newState === SessionState.Established) {
            console.log("Call connected!");
            if(onCallConnect) onCallConnect();
        } else if (newState === SessionState.Terminated) {
            console.log("Call disconnected!");
            this.currentSession = null;
            if(onCallDisconnect) onCallDisconnect();
        }
    });

    await inviter.invite();
  }

  public async hangup(): Promise<void> {
    if (this.currentSession) {
        if (this.currentSession.state === SessionState.Established) {
            await (this.currentSession as Inviter).bye();
        } else if (this.currentSession.state === SessionState.Initial || this.currentSession.state === SessionState.Establishing) {
             if (this.currentSession instanceof Inviter) {
                 await this.currentSession.cancel();
             } else if (this.currentSession instanceof Invitation) {
                 await this.currentSession.reject();
             }
        }
        this.currentSession = null;
    }
  }

  public disconnect(): void {
    if (this.userAgent) {
        this.userAgent.stop();
        this.userAgent = null;
    }
  }
}

export const sipService = new SIPService();
