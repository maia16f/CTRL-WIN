import { useState, useEffect, useRef } from 'react';
import { db } from '../config/firebase';
import { collection, query, where, orderBy, limit, getDocs, startAfter } from 'firebase/firestore';

const usePosts = (type, pageSize = 10) => {
  const typeArray = Array.isArray(type) ? type : [type];
  const typeKey = typeArray.join(',');
  const [posts, setPosts] = useState([]);
  const [lastDoc, setLastDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const lastDocRef = useRef(null);

  const fetchPosts = async (loadMore = false) => {
    setLoading(true);
    try {
      const typeConstraint = typeArray.length === 1
        ? where('type', '==', typeArray[0])
        : where('type', 'in', typeArray);
      const baseCollection = collection(db, 'posts');

      // Pentru un singur tip folosim doar filtrul de tip.
      // Evităm orderBy('createdAt') ca să includem și posturile mai vechi care nu au acest câmp.
      let q;
      if (typeArray.length === 1) {
        q = query(baseCollection, typeConstraint, limit(pageSize));
      } else {
        q = query(
          baseCollection,
          typeConstraint,
          limit(pageSize)
        );
      }

      if (loadMore && lastDocRef.current && typeArray.length === 1) {
        q = query(q, startAfter(lastDocRef.current));
      }

      const snap = await getDocs(q);
      if (snap.docs.length > 0) {
        lastDocRef.current = snap.docs[snap.docs.length - 1];
      } else {
        lastDocRef.current = null;
      }
      const newPosts = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

      if (loadMore) {
        setPosts((prev) => [...prev, ...newPosts]);
      } else {
        setPosts(newPosts);
      }
    } catch (err) {
      console.error('usePosts fetch error:', err);
      if (!loadMore) setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    lastDocRef.current = null;
    fetchPosts();
  }, [typeKey]);

  return { posts, loading, fetchMore: () => fetchPosts(true) };
};

export default usePosts;
