import React, { useState } from 'react';
import { AppLayout } from './components/layout/AppLayout';
import { HomePage } from './pages/HomePage';
import { GroupsPage } from './pages/GroupsPage';
import { GroupDetailPage } from './pages/GroupDetailPage';
import { FindGroupsPage } from './pages/FindGroupsPage';
import { CreateGroupPage } from './pages/CreateGroupPage';
import { WalletPage } from './pages/WalletPage';
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
    if (page === 'groupDetail' && params) {
      setSelectedGroupId(params);
    } else if (page === 'groups') {
      setSelectedGroupId(null);
    }
    setActivePage(page);
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
        <CreateGroupPage onBack={() => setActivePage('findGroups')} onCreate={(newGroup) => {
          console.log('New group created:', newGroup);
          setActivePage('groups');
        }} />
      )}
      {activePage === 'wallet' && (
        <WalletPage />
      )}
    </AppLayout>
  );
}

export default App;
