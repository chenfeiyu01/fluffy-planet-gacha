import React, { useEffect, useState } from 'react';
import { getCollectionArtwork, loadCollectionArtwork } from '../collectionArtwork';

export default function CollectionArt({ card, back = false }) {
  const [artwork, setArtwork] = useState(() => getCollectionArtwork(card, back));
  useEffect(() => {
    let live = true;
    const cached = getCollectionArtwork(card, back);
    setArtwork(cached);
    if (!cached) loadCollectionArtwork(card, back).then(result => {
      if (live) setArtwork(result);
    }).catch(console.error);
    return () => { live = false; };
  }, [card.id, back]);
  return artwork ? <img className="collection-thumbnail" src={artwork.url}
    width="360" height="540" decoding="async" draggable="false"
    alt={back ? '待解锁卡背' : `${card.name} · ${card.rarity}`} />
    : <span className="collection-thumbnail-placeholder" aria-hidden="true" />;
}
