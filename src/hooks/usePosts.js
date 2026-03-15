import { useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { collection, query, where, orderBy, limit, getDocs, startAfter } from 'firebase/firestore';

const usePosts = (type, pageSize = 10) => {
  const [posts, setPosts] = useState([]);
  const [lastDoc, setLastDoc] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchPosts = async (loadMore = false) => {
    setLoading(true);
    let q = query(
      collection(db, 'posts'),
      where('type', 'in', type),
      orderBy('createdAt', 'desc'),
      limit(pageSize)
    );

    if (loadMore && lastDoc) {
      q = query(q, startAfter(lastDoc));
    }

    const snap = await getDocs(q);
    setLastDoc(snap.docs[snap.docs.length - 1]);
    const newPosts = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

    if (loadMore) {
      setPosts((prevPosts) => [...prevPosts, ...newPosts]);
    } else {
      setPosts(newPosts);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, [type]);

  return { posts, loading, fetchMore: () => fetchPosts(true) };
};

export default usePosts;
