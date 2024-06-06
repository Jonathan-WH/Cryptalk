importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
//   apiKey: "environment.firebase.apiKey",
//   authDomain: 'environment.firebase.authDomain',
//   projectId: 'environment.firebase.projectId',
//   storageBucket: 'environment.firebase.storageBucket',
//   messagingSenderId: 'environment.firebase.messagingSenderId',
//   appId: 'environment.firebase.appId',
//   measurementId: 'environment.firebase.measurementId'
firebase: {
    apiKey: "AIzaSyAZ-0Z1cM8E5LqJ6ma8Ue6ZTZKD0ZzdzI8",
authDomain: "cryptalk-3db24.firebaseapp.com",
projectId: "cryptalk-3db24",
storageBucket: "cryptalk-3db24.appspot.com",
messagingSenderId: "1022113900826",
appId: "1:1022113900826:web:201b10ee0449e204ea64a3",
measurementId: "G-RZPRQF989Y"
}});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = 'New Message';
  const notificationOptions = {
    body: 'You have received a new message!',
    icon: '/assets/icons/icon-72x72.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
