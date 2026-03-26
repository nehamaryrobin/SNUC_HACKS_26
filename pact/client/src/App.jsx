import React, { useState } from 'react';
import { AppLayout } from './components/layout/AppLayout';
import { HomePage } from './pages/HomePage';
import { GroupsPage } from './pages/GroupsPage';
import { GroupDetailPage } from './pages/GroupDetailPage';
import { FindGroupsPage } from './pages/FindGroupsPage';
import { CreateGroupPage } from './pages/CreateGroupPage';
import { WalletPage } from './pages/WalletPage';
import { GlobalLeaderboardPage } from './pages/GlobalLeaderboardPage';
import './App.css';

function App() {
  // Start on 'home' dashboard
  const [activePage, setActivePage] = useState('home');
  const [selectedGroupId, setSelectedGroupId] = useState(null);

  const handleOpenGroup = (id) => {
    setSelectedGroupId(id);
    setActivePage('groupDetail');
  };

  const handleNavigate = (page, params = null) => {
    setActivePage(page);
    if (page === 'groupDetail' && params) {
      setSelectedGroupId(params);
    } else {
      setSelectedGroupId(null);
    }
  };

  return (
    <AppLayout activePage={activePage} onNavigate={handleNavigate}>
      {activePage === 'home' && (
        <HomePage onNavigate={handleNavigate} />
      )}
      {activePage === 'groups' && (
        <GroupsPage
          onOpenGroup={handleOpenGroup}
          onFindGroups={() => setActivePage('findGroups')}
        />
      )}
      {activePage === 'groupDetail' && (
        <GroupDetailPage groupId={selectedGroupId} onBack={() => handleNavigate('groups')} />
      )}
      {activePage === 'findGroups' && (
        <FindGroupsPage onBack={() => handleNavigate('groups')} onCreateNew={() => setActivePage('createGroup')} />
      )}
      {activePage === 'createGroup' && (
        <CreateGroupPage onBack={() => setActivePage('groups')} onCreate={(newGroup) => {
          setActivePage('groups');
        }} />
      )}
      {activePage === 'wallet' && (
        <WalletPage />
      )}
      {activePage === 'leaderboard' && (
        <GlobalLeaderboardPage />
      )}
    </AppLayout>
  );
}

export default App;
