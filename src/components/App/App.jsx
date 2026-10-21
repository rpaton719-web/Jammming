import { useState, useCallback } from "react";
import "./App.css";
import Playlist from "../Playlist/Playlist";
import SearchBar from "../SearchBar/SearchBar";
import SearchResults from "../SearchResults/SearchResults";
import Spotify from "../../util/Spotify";

const App = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [playlistName, setPlaylistName] = useState("New Playlist");
  const [playlistTracks, setPlaylistTracks] = useState([]);
  const [saveError, setSaveError] = useState("");
  const [saveMessage, setSaveMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

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

  const savePlaylist = useCallback(async () => {
    if (isSaving || !playlistName.trim() || !playlistTracks.length) {
      return;
    }

    const trackUris = playlistTracks.map((track) => track.uri);
    setSaveError("");
    setSaveMessage("");
    setIsSaving(true);
    try {
      await Spotify.savePlaylist(playlistName, trackUris);
      setPlaylistName("New Playlist");
      setPlaylistTracks([]);
      setSaveMessage("Playlist saved to Spotify.");
    } catch (error) {
      setSaveError(
        error instanceof Error
          ? error.message
          : "The playlist could not be saved to Spotify.",
      );
    } finally {
      setIsSaving(false);
    }
  }, [isSaving, playlistName, playlistTracks]);

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
            saveError={saveError}
            saveMessage={saveMessage}
            isSaving={isSaving}
            canSave={Boolean(playlistName.trim() && playlistTracks.length)}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
