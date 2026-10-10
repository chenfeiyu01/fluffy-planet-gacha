import React, { useEffect, useRef, useState } from 'react';
import { getCollectionArtwork, loadCollectionArtwork } from '../collectionArtwork';

export default function CollectionArt({ card, back = false }) {
  const host = useRef(null);
  const [visible, setVisible] = useState(false);
  const [artwork, setArtwork] = useState(() => getCollectionArtwork(card, back));
  useEffect(() => {
    if (visible) return;
    if (!('IntersectionObserver' in window)) { setVisible(true); return; }
    const observer = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting) {
        setVisible(true);
        observer.disconnect();
      }
    }, { rootMargin: '500px' });
    observer.observe(host.current);
    return () => observer.disconnect();
  }, [visible]);
  useEffect(() => {
    let live = true;
    const cached = getCollectionArtwork(card, back);
    setArtwork(cached);
    if (visible && !cached) loadCollectionArtwork(card, back).then(result => {
      if (live) setArtwork(result);
    }).catch(console.error);
    return () => { live = false; };
  }, [card.id, back, visible]);
  return artwork ? <img ref={host} className="collection-thumbnail" src={artwork.url}
    width="360" height="540" decoding="async" draggable="false"
    alt={back ? '待解锁卡背' : `${card.name} · ${card.rarity}`} />
    : <span ref={host} className="collection-thumbnail-placeholder" aria-hidden="true" />;
}
