/*
Copyright (C) 2025 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.

For commercial licensing, please contact support@quantumnous.com
*/

import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Nav, Button } from '@douyinfe/semi-ui';
import { useTranslation } from 'react-i18next';
import {
  IconHome,
  IconApps,
  IconBox,
  IconWrench,
  IconPuzzle,
  IconSave,
  IconBookmark,
  IconGlobe,
  IconUser,
  IconTickCircle,
  IconActivity,
  IconChevronLeft,
} from '@douyinfe/semi-icons';
import { useSidebarCollapsed } from '../../hooks/common/useSidebarCollapsed';
import SkeletonWrapper from './components/SkeletonWrapper';

const HomeSidebar = ({ onNavigate = () => {} }) => {
  const { t } = useTranslation();
  const [collapsed, toggleCollapsed] = useSidebarCollapsed();
  const location = useLocation();
  const [selectedKeys, setSelectedKeys] = useState(['overview']);

  const menuGroups = [
    {
      category: null,
      items: [
        { itemKey: 'overview', text: t('概览'), icon: <IconHome />, to: '/' },
        {
          itemKey: 'app-store',
          text: t('应用广场'),
          icon: <IconApps />,
          to: '/apps',
        },
      ],
    },
    {
      category: t('基础组件'),
      items: [
        {
          itemKey: 'adk',
          text: 'Agent SDK',
          icon: <IconSave />,
          to: '/agentsdk',
        },
        {
          itemKey: 'tokenhub',
          text: 'AIhub',
          icon: <IconBox />,
          to: '/tokenhub',
        },
        {
          itemKey: 'agent-runtime',
          text: t('智能体运行时'),
          icon: <IconBox />,
          to: '/agentruntime',
        },
        { itemKey: 'tools', text: t('MCP市场'), icon: <IconWrench />, to: '/mcpmarket' },
        {
          itemKey: 'skills',
          text: t('Skills 中心'),
          icon: <IconPuzzle />,
          to: '/skillscenter',
        },
        {
          itemKey: 'memory',
          text: t('记忆库'),
          icon: <IconSave />,
          to: '/memory',
        },
        {
          itemKey: 'knowledge',
          text: t('数据要素'),
          icon: <IconBookmark />,
          to: '/knowledge',
        },
        {
          itemKey: 'gateway',
          text: t('安全网关'),
          icon: <IconGlobe />,
          to: '/gateway',
        },
        // {
        //   itemKey: 'identity',
        //   text: '身份与权限',
        //   icon: <IconUser />,
        //   to: '/identity',
        // },
      ],
    },
    {
      category: t('评估'),
      items: [
        {
          itemKey: 'evaluation',
          text: t('评测'),
          icon: <IconTickCircle />,
          to: '/evaluation',
        },
        {
          itemKey: 'observability',
          text: t('可观测'),
          icon: <IconActivity />,
          to: '/observability',
        },
      ],
    },
  ];

  const menuItems = menuGroups.flatMap((group) => group.items);

  useEffect(() => {
    const currentPath = location.pathname;
    const currentItem = menuItems.find((item) => item.to === currentPath);
    if (currentItem) {
      setSelectedKeys([currentItem.itemKey]);
    } else if (currentPath === '/') {
      setSelectedKeys(['overview']);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (collapsed) {
      document.body.classList.add('sidebar-collapsed');
    } else {
      document.body.classList.remove('sidebar-collapsed');
    }
  }, [collapsed]);

  return (
    <div
      className='sidebar-container'
      style={{
        width: 'var(--sidebar-current-width)',
        backgroundColor: '#f5f7fa',
        borderRight: '1px solid #e5e7eb',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
        {menuGroups.map((group, groupIndex) => (
          <div key={groupIndex}>
            {group.category && !collapsed && (
              <div
                className='px-4 py-2 text-xs text-gray-400 font-normal'
                style={{ color: '#6b7280' }}
              >
                {group.category}
              </div>
            )}
            <Nav
              className='sidebar-nav'
              defaultIsCollapsed={collapsed}
              isCollapsed={collapsed}
              selectedKeys={selectedKeys}
              itemStyle='sidebar-nav-item'
              hoverStyle='sidebar-nav-item:hover'
              selectedStyle='sidebar-nav-item-selected'
              renderWrapper={({ itemElement, props }) => {
                const item = menuItems.find((i) => i.itemKey === props.itemKey);
                if (!item) return itemElement;
                return (
                  <Link
                    style={{ textDecoration: 'none' }}
                    to={item.to}
                    onClick={onNavigate}
                  >
                    {itemElement}
                  </Link>
                );
              }}
            >
              {group.items.map((item) => (
                <Nav.Item
                  key={item.itemKey}
                  itemKey={item.itemKey}
                  text={
                    <span className='truncate font-medium text-sm'>
                      {item.text}
                    </span>
                  }
                  icon={
                    <div className='sidebar-icon-container flex-shrink-0'>
                      {item.icon}
                    </div>
                  }
                />
              ))}
            </Nav>
          </div>
        ))}
      </div>

      <div className='sidebar-collapse-button'>
        <Button
          theme='outline'
          type='tertiary'
          size='small'
          icon={
            <IconChevronLeft
              style={{
                transform: collapsed ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s',
              }}
            />
          }
          onClick={toggleCollapsed}
          style={
            collapsed
              ? { width: 36, height: 24, padding: 0 }
              : { padding: '4px 12px', width: '100%' }
          }
        >
          {!collapsed ? '收起侧边栏' : null}
        </Button>
      </div>
    </div>
  );
};

export default HomeSidebar;
