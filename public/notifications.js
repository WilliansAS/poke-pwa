self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SHOW_NOTIFICATION") {
    // Obtenemos el nombre del Pokémon del mensaje
    const pokemonName = event.data.pokemonName || "un nuevo Pokémon";
    // Convertimos la primera letra a mayúscula
    const capitalizedPokemonName =
      pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1);

    const title = "¡Pokémon Consultado!";
    const options = {
      body: `Has hecho clic en ${capitalizedPokemonName}. ¡Atrápalo ya!`,
      icon: "/pokebola192.png",
      vibrate: [200, 100, 200],
      tag: "poke-notify",
      renotify: true,
    };

    // Mostramos la notificación
    event.waitUntil(self.registration.showNotification(title, options));
  }
});
