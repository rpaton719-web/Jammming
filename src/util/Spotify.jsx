const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const redirectUri =
  import.meta.env.VITE_SPOTIFY_REDIRECT_URI || `${window.location.origin}/`;
const tokenStorageKey = "spotify_access_token";
const verifierStorageKey = "spotify_code_verifier";
const scopes = "playlist-modify-public user-read-private";

const base64UrlEncode = (bytes) =>
  btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

const createCodeChallenge = async (verifier) => {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(verifier),
  );
  return base64UrlEncode(new Uint8Array(digest));
};

const getResponseJson = async (response) => {
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.error?.message || "Spotify request failed.");
  }
  return result;
};

const Spotify = {
  async getAccessToken() {
    const storedToken = sessionStorage.getItem(tokenStorageKey);
    if (storedToken) {
      const { accessToken, expiresAt } = JSON.parse(storedToken);
      if (expiresAt > Date.now()) {
        return accessToken;
      }
      sessionStorage.removeItem(tokenStorageKey);
    }

    if (!clientId) {
      throw new Error(
        "Set VITE_SPOTIFY_CLIENT_ID in your local environment before connecting Spotify.",
      );
    }

    const params = new URLSearchParams(window.location.search);
    const authorizationCode = params.get("code");
    if (params.has("error")) {
      throw new Error(`Spotify authorization failed: ${params.get("error")}`);
    }

    if (authorizationCode) {
      const codeVerifier = sessionStorage.getItem(verifierStorageKey);
      if (!codeVerifier) {
        throw new Error(
          "Spotify authorization could not be completed. Please try signing in again.",
        );
      }

      const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          code: authorizationCode,
          redirect_uri: redirectUri,
          client_id: clientId,
          code_verifier: codeVerifier,
        }),
      });
      const tokenResponse = await getResponseJson(response);
      sessionStorage.removeItem(verifierStorageKey);
      sessionStorage.setItem(
        tokenStorageKey,
        JSON.stringify({
          accessToken: tokenResponse.access_token,
          expiresAt: Date.now() + tokenResponse.expires_in * 1000,
        }),
      );
      window.history.replaceState(
        null,
        "",
        `${window.location.pathname}${window.location.hash}`,
      );
      return tokenResponse.access_token;
    }

    const verifierBytes = crypto.getRandomValues(new Uint8Array(32));
    const codeVerifier = base64UrlEncode(verifierBytes);
    sessionStorage.setItem(verifierStorageKey, codeVerifier);
    const codeChallenge = await createCodeChallenge(codeVerifier);
    const authorizationParams = new URLSearchParams({
      client_id: clientId,
      response_type: "code",
      redirect_uri: redirectUri,
      scope: scopes,
      code_challenge_method: "S256",
      code_challenge: codeChallenge,
    });
    window.location.assign(
      `https://accounts.spotify.com/authorize?${authorizationParams}`,
    );
    return null;
  },

  async search(term) {
    const accessToken = await Spotify.getAccessToken();
    if (!accessToken) {
      return [];
    }

    const params = new URLSearchParams({ type: "track", q: term });
    const response = await fetch(
      `https://api.spotify.com/v1/search?${params}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      },
    );
    const jsonResponse = await getResponseJson(response);
    if (!jsonResponse.tracks) {
      return [];
    }
    return jsonResponse.tracks.items.map((track) => ({
      id: track.id,
      name: track.name,
      artist: track.artists[0].name,
      album: track.album.name,
      uri: track.uri,
    }));
  },

  async savePlaylist(name, trackUris) {
    if (!name || !trackUris.length) {
      return;
    }

    const accessToken = await Spotify.getAccessToken();
    if (!accessToken) {
      return;
    }

    const headers = {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    };
    const user = await getResponseJson(
      await fetch("https://api.spotify.com/v1/me", { headers }),
    );
    const playlist = await getResponseJson(
      await fetch(`https://api.spotify.com/v1/users/${user.id}/playlists`, {
        headers,
        method: "POST",
        body: JSON.stringify({ name }),
      }),
    );
    return getResponseJson(
      await fetch(
        `https://api.spotify.com/v1/users/${user.id}/playlists/${playlist.id}/tracks`,
        {
          headers,
          method: "POST",
          body: JSON.stringify({ uris: trackUris }),
        },
      ),
    );
  },
};

export default Spotify;
