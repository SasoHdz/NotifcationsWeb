$(document).ready(function () {
    //Key publica para comunicacion con WEB PUSH
    const VAPID_PUBLIC_KEY =
      "BNyftv47636byp0LRWTP7c1e7GAOWUmjvYAnn1KvPArLDgQ_pKakPxgkhxztqtVKdXz8jkPd18RvqGgaVxUqgy0";
    //API PUBLICADA EN VERCEL
    const API = "https://pushnotifications-saso.vercel.app/api"
    
    //Se busca, sí existe alguna suscripcion con estas keys
    getPermisos();

    //EVENTOS 
    $("#subscribeButton").click(function () {
      if ("serviceWorker" in navigator && "PushManager" in window) {
        navigator.serviceWorker
          .register("service-worker.js")
          .then(function (registration) {
            return registration.pushManager.subscribe({
              userVisibleOnly: true,
              applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
            });
          })
          .then(function (subscription) {
            $("#responseOutput").text(JSON.stringify(subscription));
          })
          .catch(function (error) {
            $("#responseOutput").text("Error: " + error.message);
            console.error("Subscription error:", error);
          });
      } else {
        $("#responseOutput").text(
          "Service Worker or Push Notifications not supported in this browser."
        );
      }
    });


    //FUNCIONES GENERALES

    function urlBase64ToUint8Array(base64String) {
      const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
      const base64 = (base64String + padding)
        .replace(/\-/g, "+")
        .replace(/_/g, "/");

      const rawData = window.atob(base64);
      const outputArray = new Uint8Array(rawData.length);

      for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
      }
      return outputArray;
    }

    function getPermisos(){
      if ("serviceWorker" in navigator && "PushManager" in window) {
        navigator.serviceWorker
          .register("service-worker.js")
          .then(function (registration) {
            return registration.pushManager.subscribe({
              userVisibleOnly: true,
              applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
            });
          })
          .then(function (subscription) {
            const credenciales = JSON.stringify(subscription);
            //$("#responseOutput").text(credenciales);
            $.ajax({
                url: `${API}/subscription/user`,
                type: 'POST',
                contentType: 'application/json',
                data: credenciales,
                success: function(response) {
                    console.log('Datos del usuario:', response);
                    $("#responseOutput").text('Datos del usuario:', response);
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.error('Error en la suscripción:', textStatus, errorThrown);
                    $("#responseOutput").text('Error en la suscripción:', textStatus, errorThrown);

                }
            });
          })
          .catch(function (error) {
            $("#responseOutput").text("Error: " + error.message);
            console.error("Subscription error:", error);
          });
      } else {
        $("#responseOutput").text(
          "Service Worker or Push Notifications not supported in this browser."
        );
      }
    }

  });