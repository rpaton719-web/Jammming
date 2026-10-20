import React, { useState, useCallback } from "react";
import "./App.css";
import Playlist from "../Playlist/Playlist";
import SearchBar from "../SearchBar/SearchBar";
import SearchResults from "../SearchResults/SearchResults";

const TrackObjects = [
  {
    name: "Crestfallen",
    artist: "Imminence",
    album: "Axis Mundi",
    id: "track_1",
  },
  {
    name: "Faint",
    artist: "Linkin Park",
    album: "Meteora",
    id: "track_2",
  },
  {
    name: "Granite",
    artist: "Martin Nonstatic",
    album: "Granite",
    id: "track_3",
  },
  {
    name: "DDD",
    artist: "EXID",
    album: "Full Moon",
    id: "track_4",
  },
  {
    name: "Be Without You - Kendu Mix",
    artist: "Mary J. Blige",
    album: "The Breakthrough",
    id: "track_5",
  },
];

function App() {
  return (
    <>
      <h1>Hello, World</h1>
      <SearchBar></SearchBar>
      <SearchResults results={TrackObjects}></SearchResults>
      <Playlist></Playlist>
      <TrackList></TrackList>
      <Track></Track>
      {TrackObjects}
      <button>Save to Spotify</button>
      <button>Search</button>
    </>
  );
}

const App = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [playlistName, setPlaylistName] = useState("New Playlist");
  const [playlistTracks, setPlaylistTracks] = useState([]);

  const search = useCallback((term) => {
    Spotify.search(term).then(setSearchResults);
  }, []);

  const addTrack = useCallback(
    (track) => {
      if (playlistTracks.some((savedTrack) => savedTrack.id === track.id))
        return;

      setPlaylistTracks((prevTracks) => [...prevTracks, track]);
    },
    [playlistTracks],
  );

  const removeTrack = useCallback((track) => {
    setPlaylistTracks((prevTracks) =>
      prevTracks.filter((currentTrack) => currentTrack.id !== track.id),
    );
  }, []);

  const updatePlaylistName = useCallback((name) => {
    setPlaylistName(name);
  }, []);

  const savePlaylist = useCallback(() => {
    const trackUris = playlistTracks.map((track) => track.uri);
    Spotify.savePlaylist(playlistName, trackUris).then(() => {
      setPlaylistName("New Playlist");
      setPlaylistTracks([]);
    });
  }, [playlistName, playlistTracks]);

  return (
    <div>
      <h1>
        Ja<span className="highlight">mmm</span>ing
      </h1>
      <div className="App">
        <SearchBar onSearch={search} />
        <div className="App-playlist">
          <SearchResults searchResults={searchResults} onAdd={addTrack} />
          <Playlist
            playlistName={playlistName}
            playlistTracks={playlistTracks}
            onNameChange={updatePlaylistName}
            onRemove={removeTrack}
            onSave={savePlaylist}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
