import React, { useState, useEffect, Fragment } from 'react';
import "./index.css"

const DrawerMenu = ({ isMain = false}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [apps, setApps] = useState([
    { _id: 'home', title: '主页', path: '/', icon: '🏠' },
  ])
  // 1. 手势处理逻辑
  useEffect(() => {
    const handleTouchStart = (e) => {
      if (e.touches[0].clientX < 15) { // 从左侧边缘 40px 内滑动
        setTouchStart(e.touches[0].clientX);
      }
    };

    const handleTouchEnd = (e) => {
      if (touchStart !== null) {
        const touchEnd = e.changedTouches[0].clientX;
        if (touchEnd - touchStart > 50) setIsOpen(true);
        setTouchStart(null);
      }
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [touchStart]);

  // 2. 样式定义
  const styles = {
    menuButton: {
      position: 'fixed',
      top: '15px',
      left: '15px',
      zIndex: 100,
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      backgroundColor: '#fff',
      border: 'none',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      fontSize: '20px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0,0,0,0.5)',
      opacity: isOpen ? 1 : 0,
      visibility: isOpen ? 'visible' : 'hidden',
      transition: 'all 0.3s ease',
      zIndex: 998
    },
    sidebar: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '280px',
      height: '100vh',
      backgroundColor: '#fff',
      boxShadow: '2px 0 10px rgba(0,0,0,0.1)',
      transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
      transition: 'transform 0.3s ease-in-out',
      zIndex: 999,
      paddingTop: '60px'
    },
    navItem: (isActive) => ({
      padding: '16px 24px',
      display: 'flex',
      alignItems: 'center',
      cursor: 'pointer',
      backgroundColor: isActive ? '#f0f7ff' : 'transparent',
      color: isActive ? '#007aff' : '#333',
      borderRight: isActive ? '4px solid #007aff' : 'none',
      transition: 'background 0.2s'
    }),
    icon: { marginRight: '15px', fontSize: '20px' }
  };

  useEffect(() => {
    const txt = localStorage.getItem('apps');
    if (txt) {
      try {
        setApps(JSON.parse(txt))
      } catch (err) {

      }
    }
    fetch('https://jiayou.work/gw/api/v1/public/remote/apps/')
      .then(async (response) => {
        const body = await response.json()
        if (body.code === 0) {
          setApps(body.data.items)
        } else {
          console.log(body.message, '请求失败')
        }
      })
      .catch(err => {
        console.log(err, '请求报错')
      })
      .finally(() => {
        localStorage.setItem('apps', JSON.stringify(apps))
      });

  }, [])

  return (
    <Fragment>
      {/* 触发按钮 */}
      {isMain && <button style={styles.menuButton} onClick={() => setIsOpen(true)}>
        ☰
      </button>}

      {/* 遮罩 */}
      <div style={styles.overlay} onClick={() => setIsOpen(false)} onTouchEnd={() => setIsOpen(false)} />

      {/* 侧边栏 */}
      <aside style={styles.sidebar}>
        <div style={{ padding: '0 24px 20px', borderBottom: '1px solid #eee' }}>
          <h2 style={{ margin: 0, fontSize: '1.2rem' }}>应用列表</h2>
        </div>

        <nav style={{ marginTop: '10px' }}>
          {apps.map((app) => {
            const isActive = window.location.pathname.startsWith(app.path);
            return (
              <div
                key={app._id}
                style={styles.navItem(isActive)}
                onClick={() => {
                  setIsOpen(false)
                  window.location.replace(window.location.origin + app.path)
                }}
              >
                <span style={styles.icon}>{app.icon}</span>
                <span style={{ fontWeight: isActive ? '600' : '400' }}>{app.title}</span>
              </div>
            );
          })}
        </nav>
      </aside>
    </Fragment>
  );
};

export default DrawerMenu;
