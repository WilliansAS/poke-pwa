const { override, addWebpackPlugin } = require("customize-cra");
const WorkboxWebpackPlugin = require("workbox-webpack-plugin");

module.exports = override(
  addWebpackPlugin(
    new WorkboxWebpackPlugin.GenerateSW({
      clientsClaim: true,
      skipWaiting: true,
      // Excluye archivos que no queremos cachear
      exclude: [
        /\.map$/,
        /asset-manifest\.json$/,
        /robots\.txt/,
        /LICENSE\.txt/,
      ],

      // Define cómo cachear cosas que no son parte del build (como la API)
      runtimeCaching: [
        {
          // Cachea las peticiones a la API de Pokémon
          urlPattern: new RegExp("^https://pokeapi.co/api/v2/pokemon"),
          handler: "NetworkFirst",
          options: {
            cacheName: "pokeapi-cache",
            expiration: {
              maxEntries: 150,
              maxAgeSeconds: 30 * 24 * 60 * 60,
            },
          },
        },
        {
          // Cachea las imágenes de Pokémon
          urlPattern: new RegExp(
            "^https://raw.githubusercontent.com/PokeAPI/sprites/"
          ),
          handler: "CacheFirst", // Si está en caché, no la vuelve a pedir
          options: {
            cacheName: "pokemon-images-cache",
            expiration: {
              maxEntries: 200,
              maxAgeSeconds: 30 * 24 * 60 * 60,
            },
          },
        },
      ],
    })
  )
);
