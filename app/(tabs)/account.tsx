import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, Switch } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/src/theme/colors';
import { 
  User, 
  Settings, 
  Heart, 
  Download, 
  Clock, 
  LogOut, 
  ChevronRight, 
  Shield, 
  Bell, 
  HelpCircle,
  Info,
  CreditCard,
  Music,
  Share2
} from 'lucide-react-native';

interface SettingItemProps {
  icon: any;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  showSwitch?: boolean;
  switchValue?: boolean;
  onSwitchChange?: (value: boolean) => void;
  rightElement?: React.ReactNode;
}

const SettingItem = ({ 
  icon: Icon, 
  title, 
  subtitle, 
  onPress, 
  showSwitch, 
  switchValue, 
  onSwitchChange,
  rightElement 
}: SettingItemProps) => (
  <TouchableOpacity 
    style={styles.settingItem} 
    onPress={onPress}
    disabled={showSwitch && !onPress}
  >
    <View style={styles.settingIconWrapper}>
      <Icon color={Colors.textMuted} size={22} />
    </View>
    <View style={styles.settingTextContainer}>
      <Text style={styles.settingTitle}>{title}</Text>
      {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
    </View>
    {showSwitch ? (
      <Switch 
        value={switchValue} 
        onValueChange={onSwitchChange}
        trackColor={{ false: '#333', true: Colors.primary + '80' }}
        thumbColor={switchValue ? Colors.primary : '#888'}
      />
    ) : rightElement ? (
      rightElement
    ) : (
      <ChevronRight color={Colors.textMuted} size={18} />
    )}
  </TouchableOpacity>
);

export default function AccountScreen() {
  const insets = useSafeAreaInsets();
  const [dataSaver, setDataSaver] = React.useState(false);
  const [notifications, setNotifications] = React.useState(true);

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 20 }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatarPlaceholder}>
            <User color={Colors.primary} size={40} />
          </View>
          <TouchableOpacity style={styles.editAvatarButton}>
            <Settings color="#FFF" size={14} />
          </TouchableOpacity>
        </View>
        <Text style={styles.userName}>Guest User</Text>
        <Text style={styles.userEmail}>guest@auramusic.app</Text>
        <TouchableOpacity style={styles.editProfileButton}>
          <Text style={styles.editProfileText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Stats Section */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>12</Text>
          <Text style={styles.statLabel}>Playlists</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>156</Text>
          <Text style={styles.statLabel}>Songs</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>48</Text>
          <Text style={styles.statLabel}>Artists</Text>
        </View>
      </View>

      {/* Quick Actions Grid */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Library</Text>
      </View>
      <View style={styles.gridContainer}>
        <TouchableOpacity style={styles.gridItem}>
          <View style={[styles.gridIconWrapper, { backgroundColor: '#E91E63' }]}>
            <Heart color="#FFF" size={24} fill="#FFF" />
          </View>
          <Text style={styles.gridLabel}>Liked</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.gridItem}>
          <View style={[styles.gridIconWrapper, { backgroundColor: '#2196F3' }]}>
            <Download color="#FFF" size={24} />
          </View>
          <Text style={styles.gridLabel}>Downloads</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.gridItem}>
          <View style={[styles.gridIconWrapper, { backgroundColor: '#4CAF50' }]}>
            <Clock color="#FFF" size={24} />
          </View>
          <Text style={styles.gridLabel}>History</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.gridItem}>
          <View style={[styles.gridIconWrapper, { backgroundColor: '#FF9800' }]}>
            <Music color="#FFF" size={24} />
          </View>
          <Text style={styles.gridLabel}>Local</Text>
        </TouchableOpacity>
      </View>

      {/* Settings Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Preferences</Text>
      </View>
      <View style={styles.settingsGroup}>
        <SettingItem 
          icon={Bell} 
          title="Notifications" 
          showSwitch={true}
          switchValue={notifications}
          onSwitchChange={setNotifications}
        />
        <SettingItem 
          icon={Shield} 
          title="Data Saver" 
          subtitle="Lower audio quality to save data"
          showSwitch={true}
          switchValue={dataSaver}
          onSwitchChange={setDataSaver}
        />
        <SettingItem 
          icon={CreditCard} 
          title="Subscription" 
          subtitle="Manage your plan"
          rightElement={<Text style={styles.premiumText}>FREE</Text>}
        />
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Support & About</Text>
      </View>
      <View style={styles.settingsGroup}>
        <SettingItem icon={HelpCircle} title="Help Center" />
        <SettingItem icon={Share2} title="Share App" />
        <SettingItem icon={Info} title="About Aura Music" subtitle="Version 1.0.0" />
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton}>
        <LogOut color={Colors.error} size={20} />
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>

      <Text style={styles.footerText}>Made with ❤️ for Music Lovers</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.primary + '40',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: Colors.primary,
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: Colors.background,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
  },
  userEmail: {
    fontSize: 14,
    color: Colors.textMuted,
    marginTop: 4,
  },
  editProfileButton: {
    marginTop: 15,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  editProfileText: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    marginHorizontal: 20,
    borderRadius: 16,
    paddingVertical: 15,
    marginTop: 10,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: '60%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignSelf: 'center',
  },
  sectionHeader: {
    paddingHorizontal: 20,
    marginTop: 30,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 15,
  },
  gridItem: {
    width: '25%',
    alignItems: 'center',
    marginBottom: 10,
  },
  gridIconWrapper: {
    width: 50,
    height: 50,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  gridLabel: {
    fontSize: 12,
    color: Colors.textMuted,
    fontWeight: '500',
  },
  settingsGroup: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    marginHorizontal: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  settingIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: '500',
  },
  settingSubtitle: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  premiumText: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    marginHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 82, 82, 0.1)',
  },
  logoutText: {
    color: Colors.error,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  footerText: {
    textAlign: 'center',
    color: Colors.textMuted,
    fontSize: 12,
    marginTop: 30,
    marginBottom: 20,
  }
});
