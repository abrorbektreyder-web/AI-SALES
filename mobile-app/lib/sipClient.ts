import { registerGlobals } from 'react-native-webrtc';
import { UserAgent, Inviter, SessionState, UserAgentOptions, Registerer } from 'sip.js';

// Polyfill WebRTC for sip.js
registerGlobals();

export class SipClient {
  private userAgent: UserAgent | null = null;
  private registerer: Registerer | null = null;
  private currentSession: any = null;
  private onCallEnd: (() => void) | null = null;
  private onCallAnswered: (() => void) | null = null;

  public async initialize(onCallEnd: () => void, onCallAnswered: () => void) {
    this.onCallEnd = onCallEnd;
    this.onCallAnswered = onCallAnswered;

    const sipUri = `sip:510156@sip.zadarma.com`;
    const wssUrl = 'wss://webrtc.zadarma.com:8443'; 
    
    if (this.userAgent) return; // Allaqachon yaratilgan bo'lsa

    const options: UserAgentOptions = {
      uri: UserAgent.makeURI(sipUri),
      transportOptions: {
        server: wssUrl,
      },
      authorizationPassword: 'Fxbsg93Nj6',
      authorizationUsername: '510156',
      delegate: {
        onConnect: () => {
          console.log('[SIP] WSS Socket Connected');
          // WSS ulangandan keyin ro'yxatdan o'tamiz
          this.register();
        },
        onDisconnect: (error) => {
          console.log('[SIP] WSS Socket Disconnected', error);
          if (this.onCallEnd) this.onCallEnd();
        }
      }
    };

    this.userAgent = new UserAgent(options);
    try {
      await this.userAgent.start();
      console.log('[SIP] UserAgent is successfully started.');
    } catch (e) {
      console.error("[SIP] UserAgent Start Error:", e);
    }
  }

  private register() {
    if (!this.userAgent) return;
    this.registerer = new Registerer(this.userAgent);
    this.registerer.register()
      .then(() => console.log('[SIP] Registered successfully'))
      .catch(e => console.error('[SIP] Registration error', e));
  }

  public async makeCall(targetNumber: string, onCallAnswered: () => void, onCallEnd: () => void) {
    if (!this.userAgent) {
      console.error("[SIP] UserAgent not initialized");
      return;
    }

    // Hedef nomerni + belgisisiz, faqat raqamlar bilan yuborish
    const num = targetNumber.replace(/\D/g, ''); // Faqat raqamlarni qoldirish
    const targetUri = UserAgent.makeURI(`sip:${num}@sip.zadarma.com`);
    
    if (!targetUri) {
      console.error("[SIP] Invalid target URI");
      return;
    }

    console.log(`[SIP] Dialing: ${num}...`);

    this.currentSession = new Inviter(this.userAgent, targetUri, {
      sessionDescriptionHandlerOptions: {
        constraints: { audio: true, video: false }
      }
    });

    this.currentSession.stateChange.addListener((state: SessionState) => {
      console.log('[SIP STATE CHANGE]:', state);
      if (state === SessionState.Established) {
        onCallAnswered();
      } else if (state === SessionState.Terminated) {
        onCallEnd();
      }
    });

    try {
      await this.currentSession.invite();
    } catch (e) {
      console.error("[SIP] Invite Error:", e);
      onCallEnd();
    }
  }

  public hangUp() {
    if (this.currentSession) {
      const state = this.currentSession.state;
      if (state === SessionState.Established) {
         this.currentSession.bye();
      } else if (state === SessionState.Initial || state === SessionState.Establishing) {
         this.currentSession.cancel();
      }
      this.currentSession = null;
    }
  }

  public dispose() {
    if (this.registerer) {
        this.registerer.unregister();
        this.registerer = null;
    }
    if (this.userAgent) {
      this.userAgent.stop();
      this.userAgent = null;
    }
  }
}

export const sipClient = new SipClient();

