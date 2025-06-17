import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Image,
    ListRenderItemInfo,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

interface Blog {
  id: number;
  title: string;
  content: string;
  date: string;
  image?: string;
}

const PopularTags = ({ tags }: { tags: string[] }) => (
  <ScrollView 
    horizontal 
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={styles.tagsContainer}
  >
    {tags.map((tag, index) => (
      <TouchableOpacity style={styles.tagItem} key={`tag-${index}`}>
        <Text style={styles.tagText}>{tag}</Text>
      </TouchableOpacity>
    ))}
  </ScrollView>
);

const BlogItem = ({ blog }: { blog: Blog }) => (
  <View style={styles.blogItem}>
    {blog.image && (
      <Image 
        source={{ uri: blog.image }} 
        style={styles.blogImage}
        resizeMode="cover"
      />
    )}
    <Text style={styles.blogTitle}>{blog.title}</Text>
    <Text style={styles.blogContent}>{blog.content}</Text>
    {blog.date && (
      <View style={styles.blogDateContainer}>
        <Text style={styles.blogIcon}>💷</Text>
        <Text style={styles.blogDate}>
          {new Date(blog.date).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          })}
        </Text>
        <Text style={styles.blogIcon}>💷</Text>
      </View>
    )}
  </View>
);

const Home = () => {
  const popularTags: string[] = ['Politics', 'Music', 'Sports', 'Ply', 'Technology', 'Food', 'Travel', 'Fashion'];
  const [popularBlogs, setPopularBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch('http://your-django-api.com/api/blogs/');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data: Blog[] = await response.json();
        setPopularBlogs(data);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'An unknown error occurred';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const renderBlogItem = ({ item }: ListRenderItemInfo<Blog>) => (
    <BlogItem blog={item} />
  );

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
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Popular Tag</Text>
      <PopularTags tags={popularTags} />

      <Text style={styles.sectionTitle}>Popular Blog</Text>
      <FlatList
        data={popularBlogs}
        renderItem={renderBlogItem}
        keyExtractor={item => item.id.toString()}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  tagsContainer: {
    paddingBottom: 8,
    marginBottom: 24,
  },
  tagItem: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 8,
  },
  tagText: {
    fontSize: 14,
  },
  blogItem: {
    paddingVertical: 12,
  },
  blogImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
  },
  blogTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  blogContent: {
    fontSize: 14,
    marginBottom: 8,
    color: '#555',
  },
  blogDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  blogDate: {
    fontSize: 12,
    color: '#666',
    marginHorizontal: 4,
  },
  blogIcon: {
    fontSize: 12,
  },
  separator: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 8,
  },
});

export default Home;