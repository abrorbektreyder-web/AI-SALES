const Zadarma = require('zadarma');
const api = new Zadarma({
    user: '8566b102fc85b36d638a',
    secret: 'b309d9eb3873e704eccd'
});

api.api('/v1/webrtc/get_key/', { sip: '510156' }, "GET")
   .then(response => {
       console.log("Success:", response);
   })
   .catch(err => {
       console.error("Error:", err);
   });
