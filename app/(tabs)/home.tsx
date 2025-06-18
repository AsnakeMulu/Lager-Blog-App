import React, { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const ProfileScreen = () => {
  const [activeTab, setActiveTab] = useState<"SAVED" | "BONUSES">("SAVED");
  const [topics, setTopics] = useState<string[]>(["Sports", "Home Racing"]);
  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <Image
          source={{ uri: "https://example.com/profile-pic.jpg" }}
          style={styles.profileImage}
        />
        <Text style={styles.profileName}>John Snow</Text>
        <Text style={styles.profileHandle}>@J.Snow_notting</Text>

        {/* Stats Row */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>230</Text>
            <Text style={styles.statLabel}>R E A D S</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>100</Text>
            <Text style={styles.statLabel}>S A Y E D</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>200</Text>
            <Text style={styles.statLabel}>S H A R E</Text>
          </View>
        </View>
      </View>

      <View style={styles.emptyStateContainer}>
        <Text style={styles.emptyStateText}>
          Hey John, it seems like you have not
        </Text>
        <Text style={styles.emptyStateText}>added any topic yet.</Text>

        <TouchableOpacity style={styles.addTopicsButton}>
          <Text style={styles.addTopicsText}>+ Add topics</Text>
        </TouchableOpacity>
      </View>

      {/* SAVED | BONUSES Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === "SAVED" && styles.activeTab]}
          onPress={() => setActiveTab("SAVED")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "SAVED" && styles.activeTabText,
            ]}
          >
            SAVED
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "BONUSES" && styles.activeTab,
          ]}
          onPress={() => setActiveTab("BONUSES")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "BONUSES" && styles.activeTabText,
            ]}
          >
            BONUSES
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.feedItem}>
        {/* Topics Chips */}
        <View style={styles.topicsContainer}>
          {topics.map((topic, index) => (
            <View key={index} style={styles.topicChip}>
              <Text style={styles.topicText}>{topic}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.feedTitle}>
          Racing association may set up company in Malta
        </Text>
        <Text style={styles.feedMeta}>Feeds Aug 12, 2022</Text>
      </View>

      {/* Navigation Tabs */}
      {/* <View style={styles.tabsContainer}>
        <TouchableOpacity style={styles.tabButton}>
          <Text style={styles.tabText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabButton}>
          <Text style={styles.tabText}>History</Text>
        </TouchableOpacity>
      </View> */}

      {/* Feed Items */}
      <View style={styles.feedItem}>
        <Text style={styles.feedTitle}>
          Racing association may set up company in Malta
        </Text>
        <Text style={styles.feedMeta}>Feeds - Aug 12, 2022</Text>
        {/* <View style={styles.feedActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionText}>Score</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionText}>Kodolsi</Text>
          </TouchableOpacity>
        </View> */}
      </View>

      <View style={styles.feedItem}>
        <Text style={styles.feedTitle}>
          Chronicle: Björkander Ēāmnar Mjällby – går till Turkiet
        </Text>
        <Text style={styles.feedMeta}>Alien K - Mar 01, 2022</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  profileHeader: {
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  profileName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  profileHandle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 15,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 10,
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "bold",
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 5,
  },
  emptyState: {
    padding: 20,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  // emptyStateText: {
  //   fontSize: 16,
  //   color: "#666",
  //   textAlign: "center",
  // },
  emptyStateAuthor: {
    fontSize: 14,
    fontStyle: "italic",
    color: "#666",
    marginTop: 10,
  },
  sectionHeader: {
    padding: 15,
    backgroundColor: "#f5f5f5",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  searchContainer: {
    padding: 15,
  },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    paddingHorizontal: 15,
    backgroundColor: "#f9f9f9",
  },
  tabsContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  // tabButton: {
  //   flex: 1,
  //   padding: 15,
  //   alignItems: "center",
  // },
  // tabText: {
  //   fontSize: 16,
  //   fontWeight: "bold",
  //   color: "#333",
  // },
  // feedItem: {
  //   padding: 15,
  //   borderBottomWidth: 1,
  //   borderBottomColor: "#eee",
  // },
  // feedTitle: {
  //   fontSize: 16,
  //   fontWeight: "bold",
  //   marginBottom: 5,
  // },
  // feedMeta: {
  //   fontSize: 12,
  //   color: "#666",
  //   marginBottom: 10,
  // },
  feedActions: {
    flexDirection: "row",
    marginTop: 10,
  },
  actionButton: {
    marginRight: 15,
  },
  actionText: {
    color: "#1a73e8",
    fontWeight: "bold",
  },
  emptyStateContainer: {
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    marginBottom: 20,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    lineHeight: 24,
  },
  addTopicsButton: {
    backgroundColor: "#000",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 15,
  },
  addTopicsText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  tabContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    marginBottom: 16,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#000",
  },
  tabText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
  },
  activeTabText: {
    color: "#000",
    fontWeight: "bold",
  },
  topicsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 2,
  },
  topicChip: {
    backgroundColor: "#f0f0f0",
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  topicText: {
    fontSize: 14,
    color: "#333",
  },
  feedItem: {
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  feedTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 6,
    color: "#333",
  },
  feedMeta: {
    fontSize: 12,
    color: "#666",
  },
});

export default ProfileScreen;
