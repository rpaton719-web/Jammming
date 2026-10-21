import { useCallback } from "react";
import "./Playlist.css";
import TrackList from "../TrackList/TrackList";

function Playlist({
  onNameChange,
  playlistTracks,
  onRemove,
  onSave,
  saveError,
  saveMessage,
  isSaving,
  canSave,
}) {
  const handleNameChange = useCallback(
    (event) => {
      onNameChange(event.target.value);
    },
    [onNameChange],
  );

  return (
    <div className="Playlist">
      <input onChange={handleNameChange} defaultValue="New Playlist" />
      <TrackList
        tracks={playlistTracks}
        isRemoval
        onRemove={onRemove}
      />
      <button
        className="Playlist-save"
        onClick={onSave}
        disabled={isSaving || !canSave}
      >
        {isSaving ? "SAVING..." : "SAVE TO SPOTIFY"}
      </button>
      {saveError && (
        <p className="Playlist-status" role="alert">
          {saveError}
        </p>
      )}
      {saveMessage && (
        <p className="Playlist-status" role="status">
          {saveMessage}
        </p>
      )}
    </div>
  );
}

export default Playlist;
