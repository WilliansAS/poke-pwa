export function register() {
  if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/service-worker.js")
        .then((registration) => {
          console.log("SW registrado:", registration);
        })
        .catch((registrationError) => {
          console.log("Fallo en el registro del SW:", registrationError);
        });
    });
  }
}
