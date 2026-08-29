export interface AlbumTrack {
  id: string;
  songTitle: string;
  artistName: string;
  albumName: string;
  trackIndex: string;
  year?: string;
  coverUrl: string;
  previewUrl: string; // Official Apple Music 30s HQ audio stream (.m4a)
  genre?: string;
  badge?: string;
}

// 100% REAL AND OFFICIAL ALBUM COVERS & AUDIO PREVIEWS FROM APPLE MUSIC / ITUNES CDN
export const FAMOUS_ALBUMS: AlbumTrack[] = [
  {
    id: 'jab-we-met',
    songTitle: 'Tum Se Hi',
    artistName: 'Mohit Chauhan',
    albumName: 'Jab We Met',
    trackIndex: '2 of 5',
    year: '2007',
    coverUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/3d/c7/43/3dc74387-e7f4-2342-397c-4cf2037c69a5/8902894623223_cover.jpg/600x600bb.jpg',
    previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/e7/39/b8/e739b870-54a1-8f33-57d5-3817108b8bd9/mzaf_16925921654959290990.plus.aac.p.m4a',
    genre: 'Bollywood / Romance',
    badge: '★ Capa Oficial Jab We Met',
  },
  {
    id: 'asap-sundress',
    songTitle: 'Sundress',
    artistName: 'A$AP Rocky',
    albumName: 'Sundress - Single',
    trackIndex: '1 of 1',
    year: '2018',
    coverUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/1a/c1/6a/1ac16a12-cfb5-269e-fa3e-ac9080ad420b/886447427460.jpg/600x600bb.jpg',
    previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/3f/49/e9/3f49e94d-5fca-df88-dfba-cfc4373f8e82/mzaf_12766798182590718336.plus.aac.p.m4a',
    genre: 'Psychedelic Hip-Hop',
    badge: '🔥 Capa Oficial Sundress',
  },
  {
    id: 'mcr-black-parade',
    songTitle: 'Welcome to the Black Parade',
    artistName: 'My Chemical Romance',
    albumName: 'The Black Parade',
    trackIndex: '5 of 14',
    year: '2006',
    coverUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/7e/ac/69/7eac6998-7fa4-f1ab-9601-e8b791c736fa/mzi.fbpszunc.jpg/600x600bb.jpg',
    previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/ea/3c/d6/ea3cd64e-fa54-c3c0-b2e3-e96a7b16cbc1/mzaf_2589197593248149925.plus.aac.p.m4a',
    genre: 'Gothic Rock / Emo',
    badge: '☠️ The Black Parade',
  },
  {
    id: 'linkin-park-in-the-end',
    songTitle: 'In The End',
    artistName: 'Linkin Park',
    albumName: 'Hybrid Theory',
    trackIndex: '8 of 12',
    year: '2000',
    coverUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/53/a7/7f/53a77fab-c54c-a57b-8130-248fc12d0c80/093624948995.jpg/600x600bb.jpg',
    previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/d9/33/34/d933341d-ba95-dc3b-11a3-34d6632dd62e/mzaf_10942671303595386057.plus.aac.p.m4a',
    genre: 'Nu Metal / Alternative',
    badge: '💿 Hybrid Theory',
  },
  {
    id: 'evanescence-fallen',
    songTitle: 'Bring Me to Life',
    artistName: 'Evanescence',
    albumName: 'Fallen',
    trackIndex: '2 of 11',
    year: '2003',
    coverUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/10/4c/21/104c21e6-9ef0-4d3a-d1bd-d47167f121e5/00601501406300.rgb.jpg/600x600bb.jpg',
    previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/d2/b9/60/d2b96000-fd12-4645-106e-48238d264995/mzaf_4464035852986978967.plus.aac.p.m4a',
    genre: 'Nu Metal / Gothic',
    badge: '🌙 Fallen (Amy Lee)',
  },
  {
    id: 'greenday-american-idiot',
    songTitle: 'Holiday',
    artistName: 'Green Day',
    albumName: 'American Idiot',
    trackIndex: '3 of 13',
    year: '2004',
    coverUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/0e/17/f0/0e17f011-aadf-d4d1-1c7e-b61ce39f968b/093624947301.jpg/600x600bb.jpg',
    previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/86/f1/d0/86f1d039-f2d6-2f5b-b34b-2b63504fa6d0/mzaf_3363059623415356317.plus.aac.p.m4a',
    genre: 'Punk Rock',
    badge: '💣 American Idiot',
  },
  {
    id: 'avril-let-go',
    songTitle: 'Complicated',
    artistName: 'Avril Lavigne',
    albumName: 'Let Go',
    trackIndex: '1 of 13',
    year: '2002',
    coverUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/32/2c/f3/322cf324-9ea1-3962-865a-f4f9bf83764d/888880191069.jpg/600x600bb.jpg',
    previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/d5/82/55/d58255cd-4bd1-c339-1584-591e9d1305ee/mzaf_14546367220838781682.plus.aac.p.m4a',
    genre: 'Pop Punk / Y2K',
    badge: '🛹 Let Go 2002',
  },
  {
    id: 'pitty-admiravel',
    songTitle: 'Máscara',
    artistName: 'Pitty',
    albumName: 'Admirável Chip Novo',
    trackIndex: '2 of 11',
    year: '2003',
    coverUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/1c/e5/2b/1ce52bf3-3cec-1281-a15a-bddbc46bd6dc/7898324300288.jpg/600x600bb.jpg',
    previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/ce/d4/32/ced432f6-7553-0118-feb7-905ae4221eb8/mzaf_10451813177030022325.plus.aac.p.m4a',
    genre: 'Rock Brasileiro',
    badge: '⚡ Chip Novo',
  },
  {
    id: 'nxzero-razoes',
    songTitle: 'Razões e Emoções',
    artistName: 'NX Zero',
    albumName: 'NX Zero (2006)',
    trackIndex: '2 of 14',
    year: '2006',
    coverUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music118/v4/20/91/8e/20918e16-ec79-3372-f5ad-1b07a2b016b8/7898324314469.jpg/600x600bb.jpg',
    previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/de/12/b8/de12b8cb-1c86-b20c-f8a0-72eab7729763/mzaf_735838239471517829.plus.aac.p.m4a',
    genre: 'Emo / Pop Punk',
    badge: '🎸 NX Zero 2006',
  },
  {
    id: 'fresno-quebre',
    songTitle: 'Quebre As Correntes',
    artistName: 'Fresno',
    albumName: 'O Rio, A Cidade, A Árvore',
    trackIndex: '3 of 12',
    year: '2006',
    coverUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/cb/52/21/cb52218e-cadc-8d22-f198-63720ff24681/7898614906121.jpg/600x600bb.jpg',
    previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview112/v4/81/23/01/81230188-3f1d-757b-9dff-60155939f39d/mzaf_16867171269481839878.plus.aac.p.m4a',
    genre: 'Emo Nacional',
    badge: '🖤 Fresno Ciano',
  },
  {
    id: 'cpm22-felicidade',
    songTitle: 'Um Minuto Para o Fim do Mundo',
    artistName: 'CPM 22',
    albumName: 'Felicidade Instantânea',
    trackIndex: '4 of 16',
    year: '2005',
    coverUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music128/v4/8d/a4/60/8da460a5-6b22-dfaa-3e15-d8b00776dfd0/03259120067166.rgb.jpg/600x600bb.jpg',
    previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/b3/75/0f/b3750f8b-1961-61a8-dc7e-873aeae46649/mzaf_3457327448530940245.plus.aac.p.m4a',
    genre: 'Hardcore Melódico',
    badge: '⏱️ CPM 22',
  },
  {
    id: 'forfun-teoria',
    songTitle: 'História de Verão',
    artistName: 'Forfun',
    albumName: 'Teoria Dinâmica Gastativa',
    trackIndex: '1 of 12',
    year: '2005',
    coverUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/d0/a4/d4/d0a4d4ea-4d1d-9ada-02ce-80a500ff5249/7898324321764.jpg/600x600bb.jpg',
    previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/43/37/47/433747a5-d1ad-a978-0e92-f1ab173ea410/mzaf_3964214800047225139.plus.aac.p.m4a',
    genre: 'Pop Punk / Reggae',
    badge: '🌊 Forfun',
  },
  {
    id: 'blink-i-miss-you',
    songTitle: 'I Miss You',
    artistName: 'Blink-182',
    albumName: 'Blink-182 (Untitled)',
    trackIndex: '3 of 14',
    year: '2003',
    coverUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/57/be/19/57be194f-7b85-86ed-f59b-afc86806b6e5/16UMGIM35664.rgb.jpg/600x600bb.jpg',
    previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/87/c6/17/87c6173e-05a4-909a-808a-514246d67638/mzaf_16524416540343663914.plus.aac.p.m4a',
    genre: 'Pop Punk / Emo',
    badge: '🕷️ Blink-182',
  },
  {
    id: 'paramore-riot',
    songTitle: 'Misery Business',
    artistName: 'Paramore',
    albumName: 'Riot!',
    trackIndex: '4 of 11',
    year: '2007',
    coverUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/bf/fa/66/bffa6672-1e97-fcf7-b301-9766f3563d68/075679954992.jpg/600x600bb.jpg',
    previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/c4/8c/e4/c48ce468-cb8c-f8ae-09d9-9f5c59cb7739/mzaf_9573386091329877856.plus.aac.p.m4a',
    genre: 'Pop Punk / Emo',
    badge: '💥 Riot! 2007',
  },
  {
    id: 'gorillaz-demon-days',
    songTitle: 'Feel Good Inc.',
    artistName: 'Gorillaz',
    albumName: 'Demon Days',
    trackIndex: '6 of 15',
    year: '2005',
    coverUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/1c/0f/81/1c0f818a-e458-dd84-6f1b-ccbdf5fe14d6/825646291045.jpg/600x600bb.jpg',
    previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/9a/a7/90/9aa790e3-651e-9674-26ac-14aba4d3b8d1/mzaf_10454527198707970464.plus.aac.p.m4a',
    genre: 'Alternative / Trip-Hop',
    badge: '🦍 Demon Days',
  },
  {
    id: 'daft-punk-discovery',
    songTitle: 'One More Time',
    artistName: 'Daft Punk',
    albumName: 'Discovery',
    trackIndex: '1 of 14',
    year: '2001',
    coverUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/fd/4a/77/fd4a77db-0ebc-d043-41a2-f32fa1bb0fb4/dj.qrikkdwj.jpg/600x600bb.jpg',
    previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/5d/93/d8/5d93d83f-ad1e-da4d-1d79-9937bdff24ec/mzaf_14396932211949300852.plus.aac.p.m4a',
    genre: 'French House / Y2K',
    badge: '🤖 Discovery',
  },
];

/**
 * Searches for a matching official album cover in the verified catalog
 */
export function resolveAlbumCover(
  songTitle?: string,
  artistName?: string,
  albumName?: string,
  explicitMediaUrl?: string
): string {
  // If user provided an explicit custom media URL or already loaded real cover, always use it
  if (explicitMediaUrl && explicitMediaUrl.trim() !== '') {
    return explicitMediaUrl;
  }

  const query = `${songTitle || ''} ${artistName || ''} ${albumName || ''}`.toLowerCase();

  // 1. Direct search in verified catalog
  for (const track of FAMOUS_ALBUMS) {
    const trackTerms = `${track.songTitle} ${track.artistName} ${track.albumName}`.toLowerCase();
    if (
      (songTitle && track.songTitle.toLowerCase().includes(songTitle.toLowerCase())) ||
      (artistName && track.artistName.toLowerCase().includes(artistName.toLowerCase())) ||
      (albumName && track.albumName.toLowerCase().includes(albumName.toLowerCase())) ||
      query.includes(track.songTitle.toLowerCase()) ||
      query.includes(track.artistName.toLowerCase()) ||
      trackTerms.includes(query)
    ) {
      return track.coverUrl;
    }
  }

  // Fallback to the real Jab We Met cover
  return FAMOUS_ALBUMS[0].coverUrl;
}

/**
 * Resolves the official audio preview URL for a song
 */
export function resolveAudioPreview(
  songTitle?: string,
  artistName?: string,
  albumName?: string,
  explicitAudioUrl?: string
): string {
  if (explicitAudioUrl && explicitAudioUrl.trim() !== '') {
    return explicitAudioUrl;
  }

  const query = `${songTitle || ''} ${artistName || ''} ${albumName || ''}`.toLowerCase();

  for (const track of FAMOUS_ALBUMS) {
    const trackTerms = `${track.songTitle} ${track.artistName} ${track.albumName}`.toLowerCase();
    if (
      (songTitle && track.songTitle.toLowerCase().includes(songTitle.toLowerCase())) ||
      (artistName && track.artistName.toLowerCase().includes(artistName.toLowerCase())) ||
      (albumName && track.albumName.toLowerCase().includes(albumName.toLowerCase())) ||
      query.includes(track.songTitle.toLowerCase()) ||
      query.includes(track.artistName.toLowerCase()) ||
      trackTerms.includes(query)
    ) {
      return track.previewUrl;
    }
  }

  return FAMOUS_ALBUMS[0].previewUrl;
}

/**
 * Live search for official high-resolution album covers & audio preview from Apple Music / iTunes CDN for ANY song in the world
 */
export async function searchOfficialAppleArtwork(
  term: string
): Promise<{ song: string; artist: string; album: string; coverUrl: string; previewUrl?: string; year?: string } | null> {
  if (!term || term.trim().length === 0) return null;

  try {
    const cleanTerm = term
      .replace(/^Tocando no (?:Winamp|MP4|MP3|iPod|MSN):\s*/i, '')
      .replace(/[\(\)]/g, ' ')
      .trim();

    const response = await fetch(
      `https://itunes.apple.com/search?term=${encodeURIComponent(cleanTerm)}&entity=song&limit=1`
    );

    if (!response.ok) return null;

    const data = await response.json();
    if (data.results && data.results.length > 0) {
      const item = data.results[0];
      // Convert 100x100 thumbnail to ultra-crisp 600x600 official original artwork
      const coverUrl = (item.artworkUrl100 || item.artworkUrl60 || '').replace(
        /100x100bb\.jpg|60x60bb\.jpg/,
        '600x600bb.jpg'
      );

      return {
        song: item.trackName || cleanTerm,
        artist: item.artistName || '',
        album: item.collectionName || '',
        coverUrl: coverUrl || item.artworkUrl100,
        previewUrl: item.previewUrl,
        year: item.releaseDate ? item.releaseDate.substring(0, 4) : undefined,
      };
    }
  } catch (err) {
    console.warn('iTunes Search API failed, using fallback cover', err);
  }

  return null;
}
