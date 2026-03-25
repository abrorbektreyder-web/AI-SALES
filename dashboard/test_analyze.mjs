import fetch from 'node-fetch';

async function testAnalyze() {
    console.log("Starting analysis test...");
    const url = 'https://ai-sales-roan-three.vercel.app/api/analyze';
    const payload = {
        callId: 'e7f49ca6-0508-49b3-a9ed-c47dd5fd14cb',
        audioUrl: 'https://dlcplppycmlqatqpozqk.supabase.co/storage/v1/object/public/audio-records/calls/16df039d-3f9c-4ee5-9a4f-1d8da0180917_1774457443136.m4a'
    };
    
    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        
        console.log("Status:", res.status);
        const text = await res.text();
        console.log("Response:", text);
    } catch (e) {
        console.error("Error:", e);
    }
}

testAnalyze();
