import { registerGlobals } from 'react-native-webrtc';
import { UserAgent, Inviter, SessionState, UserAgentOptions } from 'sip.js';

// Polyfill WebRTC for sip.js
registerGlobals();

export class SipClient {
  private userAgent: UserAgent | null = null;
  private currentSession: any = null;

  public initialize(onCallEnd: () => void, onCallAnswered: () => void) {
    const sipUri = `sip:510156@sip.zadarma.com`;
    
    // Zadarma WSS URL (Odatda port 8443 or webrtc.zadarma.com ishlatiladi)
    const wssUrl = 'wss://webrtc.zadarma.com:8443'; 
    
    const options: UserAgentOptions = {
      uri: UserAgent.makeURI(sipUri),
      transportOptions: {
        server: wssUrl,
      },
      authorizationPassword: 'Fxbsg93Nj6',
      authorizationUsername: '510156',
      delegate: {
        onConnect: () => console.log('SIP WSS Socket Connected'),
        onDisconnect: (error) => console.log('SIP WSS Socket Disconnected', error)
      }
    };

    this.userAgent = new UserAgent(options);
    this.userAgent.start().then(() => {
      console.log('Zadarma SIP UserAgent is successfully started.');
    }).catch(e => console.error("SIP UserAgent Start Error:", e));

    return this.userAgent;
  }

  public async makeCall(targetNumber: string, onCallAnswered: () => void, onCallEnd: () => void) {
    if (!this.userAgent) return;

    // Hedef nomerni + belgisisiz, faqat raqamlar bilan yuborish tavsiya qilinadi
    const num = targetNumber.replace(/\+/g, '');
    const targetUri = UserAgent.makeURI(`sip:${num}@sip.zadarma.com`);
    
    if (!targetUri) return;

    this.currentSession = new Inviter(this.userAgent, targetUri, {
      sessionDescriptionHandlerOptions: {
        constraints: { audio: true, video: false }
      }
    });

    this.currentSession.stateChange.addListener((state: SessionState) => {
      console.log('[SIP STATE CHANGE]:', state);
      if (state === SessionState.Established) {
        onCallAnswered();
      } else if (state === SessionState.Terminated || state === SessionState.Terminating) {
        onCallEnd();
      }
    });

    await this.currentSession.invite();
  }

  public hangUp() {
    if (this.currentSession) {
      if (this.currentSession.state === SessionState.Established) {
         this.currentSession.bye();
      } else if (this.currentSession.state === SessionState.Initial || this.currentSession.state === SessionState.Establishing) {
         this.currentSession.cancel();
      }
      this.currentSession = null;
    }
  }

  public dispose() {
    if (this.userAgent) {
      this.userAgent.stop();
      this.userAgent = null;
    }
  }
}

export const sipClient = new SipClient();
