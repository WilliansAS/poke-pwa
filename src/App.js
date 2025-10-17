import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  // Estados para la lista de pokémon y el estado de carga
  const [pokemonList, setPokemonList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const response = await fetch(
          "https://pokeapi.co/api/v2/pokemon?limit=120"
        );
        const data = await response.json();

        // Mapeamos los resultados para darles el formato que necesitamos
        const formattedPokemon = data.results.map((pokemon, index) => {
          // Extraemos el ID de la URL para construir la URL de la imagen
          const id = pokemon.url.split("/")[6];
          const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

          return {
            id,
            name: pokemon.name,
            imageUrl,
          };
        });

        setPokemonList(formattedPokemon);
      } catch (error) {
        console.error("Hubo un error al buscar los Pokémon:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemon();
  }, []);

  // Filtro de busqueda
  const filteredPokemon = pokemonList.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Renderizado condicional mientras se cargan los datos
  if (loading) {
    return <div className="loading-container">Cargando Pokédex...</div>;
  }

  return (
    <div className="App">
      <header>
        <h1>Pokédex</h1>
        <p>Explora el mundo de los Pokémon</p>
        <input
          type="text"
          placeholder="Buscar Pokémon por nombre..."
          className="search-bar"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </header>
      <main className="pokemon-grid">
        {filteredPokemon.map((pokemon) => (
          <div key={pokemon.id} className="pokemon-card">
            <div className="pokemon-image-wrapper">
              <img src={pokemon.imageUrl} alt={pokemon.name} />
            </div>
            <div className="pokemon-info">
              <span className="pokemon-id">
                #{String(pokemon.id).padStart(3, "0")}
              </span>
              <h3 className="pokemon-name">{pokemon.name}</h3>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}

export default App;
