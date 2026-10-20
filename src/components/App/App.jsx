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
      <Tracklist></Tracklist>
      <Track></Track>
      {TrackObjects}
      <button>Save to Spotify</button>
      <button>Search</button>
    </>
  );
}

export default App;
