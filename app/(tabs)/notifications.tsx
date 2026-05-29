import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useNotifications, NotificationData } from '@/hooks/useNotifications';
import { Bell, Trash2, Clock } from 'lucide-react-native';

export default function NotificationsScreen() {
  const { notifications, clearNotifications } = useNotifications();

  function formatTime(date: Date): string {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  }

  function formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  function renderNotification({ item }: { item: NotificationData }) {
    return (
      <View style={styles.notificationCard}>
        <View style={styles.notificationHeader}>
          <Bell size={18} color="#2E7D32" />
          <Text style={styles.notificationTitle}>{item.title}</Text>
        </View>
        <Text style={styles.notificationBody}>{item.body}</Text>
        <View style={styles.notificationFooter}>
          <Clock size={14} color="#666" />
          <Text style={styles.notificationTime}>
            {formatDate(item.receivedAt)} at {formatTime(item.receivedAt)}
          </Text>
        </View>
        {item.data && Object.keys(item.data).length > 0 && (
          <View style={styles.dataContainer}>
            <Text style={styles.dataLabel}>Additional Data:</Text>
            <Text style={styles.dataText}>{JSON.stringify(item.data)}</Text>
          </View>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Notifications</Text>
        <Text style={styles.subtitle}>
          {notifications.length === 0
            ? 'No notifications yet'
            : `${notifications.length} notification${notifications.length !== 1 ? 's' : ''} received`}
        </Text>
      </View>

      {notifications.length > 0 && (
        <View style={styles.actionsBar}>
          <TouchableOpacity style={styles.clearButton} onPress={clearNotifications}>
            <Trash2 size={18} color="#D32F2F" />
            <Text style={styles.clearButtonText}>Clear All</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Bell size={64} color="#BDBDBD" />
            <Text style={styles.emptyText}>No notifications received</Text>
            <Text style={styles.emptySubtext}>
              Notifications will appear here when they arrive
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1B5E20',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  actionsBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFCDD2',
    backgroundColor: '#FFEBEE',
  },
  clearButtonText: {
    color: '#D32F2F',
    fontSize: 14,
    fontWeight: '500',
  },
  list: {
    padding: 16,
    paddingBottom: 100,
  },
  notificationCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: '#2E7D32',
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  notificationBody: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  notificationFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  notificationTime: {
    fontSize: 12,
    color: '#999',
  },
  dataContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  dataLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666',
    marginBottom: 4,
  },
  dataText: {
    fontSize: 11,
    fontFamily: 'monospace',
    color: '#333',
    backgroundColor: '#F5F5F5',
    padding: 8,
    borderRadius: 4,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
});
