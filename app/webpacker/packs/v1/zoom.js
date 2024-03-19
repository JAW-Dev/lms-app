const zoomElement = document.querySelector("[data-signature]");
const {
  key: apiKey,
  room: meetingNumber,
  email: userEmail,
  name: userName,
  leave: leaveUrl,
  pwd: passWord,
  signature,
} = zoomElement.dataset;

ZoomMtg.setZoomJSLib("https://dmogdx0jrul3u.cloudfront.net/1.7.9/lib", "/av");
ZoomMtg.preLoadWasm();
ZoomMtg.prepareJssdk();

if (signature) {
  ZoomMtg.init({
    leaveUrl,
    success() {
      ZoomMtg.join({
        meetingNumber,
        userName,
        signature,
        apiKey,
        userEmail,
        passWord,
        success() {
          const mainNav = document.querySelector(".main-nav");
          mainNav.classList.add("is-collapsed");
        },
        error: (res) => console.log(res),
      });
    },
    error: (res) => console.log(res),
  });
}
