import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client'; // Import supabase directly
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const Reviews = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching reviews:', error.message);
      } else {
        setReviews(data);
      }
    };

    fetchReviews();
  }, []);

  return (
    <div>
      <Header />
      <main className="container mx-auto p-4 mt-16">
        <h1 className="text-2xl font-bold mb-4">Reviews</h1>
        {reviews.length === 0 ? (
          <p>No reviews yet.</p>
        ) : (
          <ul>
            {reviews.map((review) => (
              <li key={review.id} className="border-b border-gray-200 py-2">
                <h2 className="text-lg font-semibold">{review.title}</h2>
                <p>{review.content}</p>
                <span className="text-sm text-gray-500">{new Date(review.created_at).toLocaleDateString()}</span>
              </li>
            ))}
          </ul>
        )}
      </main>
      <Footer />
    </div>
  );
  
};

export default Reviews;
