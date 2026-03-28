import { registerGlobals } from 'react-native-webrtc';
import { UserAgent, Inviter, SessionState, UserAgentOptions, Registerer, RegistererState } from 'sip.js';

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
    const wssUrl = 'wss://webrtc.zadarma.com'; 
    
    if (this.userAgent) return; // Allaqachon yaratilgan bo'lsa

    const options: UserAgentOptions = {
      uri: UserAgent.makeURI(sipUri),
      transportOptions: {
        server: wssUrl,
        connectionTimeout: 10,
        traceSip: true,
      },
      authorizationPassword: 'Fxbsg93Nj6',
      authorizationUsername: '510156',
    };

    this.userAgent = new UserAgent(options);
    
    // Transport event listenerlarini to'g'ri biriktiramiz
    this.userAgent.transport.onDisconnect = (error) => {
       console.log('[SIP] WSS Socket Disconnected', error);
       if (this.onCallEnd) this.onCallEnd();
    };

    this.userAgent.transport.stateChange.addListener((state) => {
      console.log(`[SIP] Transport State changed to: ${state}`);
    });

    try {
      console.log('[SIP] Starting UserAgent...');
      await this.userAgent.start(); // WSS ga ulanadi
      console.log('[SIP] UserAgent is successfully started. Now Registering...');
      
      // WSS ulangandan keyin birdaniga Ro'yxatdan o'tamiz!
      this.register();
    } catch (e) {
      console.error("[SIP] UserAgent Start Error:", e);
    }
  }

  private register() {
    if (!this.userAgent) return;
    this.registerer = new Registerer(this.userAgent);
    
    // Add state change listener for debugging
    this.registerer.stateChange.addListener((state: RegistererState) => {
      console.log(`[SIP] Registerer State changed to: ${state}`);
    });

    this.registerer.register()
      .then(() => {
        console.log('[SIP] Registered successfully via UserAgent');
      })
      .catch(e => console.error('[SIP] Registration error', e));
  }

  // Ro'yxatdan o'tishni kutish uchun yordamchi funksiya
  public async isRegistered(): Promise<boolean> {
    if (!this.registerer) return false;
    return this.registerer.state === RegistererState.Registered;
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
        constraints: { audio: true, video: false },
        peerConnectionConfiguration: {
          iceServers: [{ urls: 'stun:stun.zadarma.com' }]
        }
      } as any
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

