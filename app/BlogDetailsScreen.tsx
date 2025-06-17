import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  ActivityIndicator,
  Image 
} from 'react-native';
import axios from 'axios';

interface Blog {
  id: number;
  title: string;
  author: string;
  date: string;
  content: string[];
  image?: string;
}

interface BlogDetailsScreenProps {
  route: {
    params: {
      blogId: number;
    };
  };
}

const BlogDetailsScreen: React.FC<BlogDetailsScreenProps> = ({ route }) => {
  const { blogId } = route.params;
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get<Blog>(`http://your-django-api.com/api/blogs/${blogId}/`);
        setBlog(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogDetails();
  }, [blogId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!blog) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Blog not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {blog.image && (
        <Image 
          source={{ uri: blog.image }} 
          style={styles.featuredImage}
          resizeMode="cover"
        />
      )}

      <View style={styles.contentContainer}>
        <Text style={styles.title}>{blog.title}</Text>
        
        <View style={styles.metaContainer}>
          <Text style={styles.author}>{blog.author}</Text>
          <Text style={styles.date}>{blog.date}</Text>
        </View>

        <View style={styles.divider} />

        {blog.content.map((paragraph, index) => (
          <Text key={index} style={styles.paragraph}>
            {index === 0 ? <Text style={styles.subtitle}>{paragraph}</Text> : paragraph}
          </Text>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
  contentContainer: {
    padding: 20,
  },
  featuredImage: {
    width: '100%',
    height: 200,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  author: {
    fontSize: 16,
    color: '#555',
    fontWeight: '600',
  },
  date: {
    fontSize: 14,
    color: '#777',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 16,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    color: '#444',
    marginBottom: 16,
  },
});

export default BlogDetailsScreen;