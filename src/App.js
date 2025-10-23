import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  // Estados para la lista de pokémon y el estado de carga
  const [pokemonList, setPokemonList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Estados para el Modal
  const [selectedPokemonId, setSelectedPokemonId] = useState(null);
  const [pokemonDetails, setPokemonDetails] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

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

  // Detalles
  const handleCardClick = async (id) => {
    setSelectedPokemonId(id);
    setModalLoading(true);

    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
      const data = await response.json();
      setPokemonDetails(data);
    } catch (error) {
      console.error("Error al buscar detalles del Pokémon:", error);
    } finally {
      setModalLoading(false);
    }
  };

  // Función para cerrar el modal
  const closeModal = () => {
    setSelectedPokemonId(null);
    setPokemonDetails(null);
  };

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
          <div
            key={pokemon.id}
            className="pokemon-card"
            onClick={() => handleCardClick(pokemon.id)}
          >
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

      {/* --- Sección del Modal --- */}
      {selectedPokemonId && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={closeModal}>
              &times;
            </button>

            {modalLoading && (
              <div className="loading-container">Cargando detalles...</div>
            )}

            {/* <-- Contenido --> */}
            {pokemonDetails && (
              <>
                <div className="modal-header">
                  <img
                    src={
                      pokemonDetails.sprites.other["official-artwork"]
                        .front_default
                    }
                    alt={pokemonDetails.name}
                    className="modal-pokemon-image"
                  />
                  <h2 className="modal-pokemon-name">{pokemonDetails.name}</h2>
                  <div className="pokemon-types">
                    {pokemonDetails.types.map((typeInfo) => (
                      <span
                        key={typeInfo.type.name}
                        className={`type-badge type-${typeInfo.type.name}`}
                      >
                        {typeInfo.type.name}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pokemon-stats">
                  <h3>Estadísticas</h3>
                  {pokemonDetails.stats.map((statInfo) => (
                    <div className="stat-item" key={statInfo.stat.name}>
                      <span className="stat-name">{statInfo.stat.name}</span>
                      <span className="stat-value">{statInfo.base_stat}</span>
                      <div className="stat-bar-background">
                        <div
                          className="stat-bar-foreground"
                          style={{
                            width: `${(statInfo.base_stat / 255) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
