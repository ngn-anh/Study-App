import { Layout, Menu, Dropdown, Avatar, Breadcrumb } from "antd";
import { useNavigate, useLocation, Routes, Route, Navigate } from "react-router-dom";
import { User as UserIcon } from "phosphor-react";
import { appRoutes } from "../../routes";
import { filterAccessibleRoutes, canAccessRoute } from "../../utils/routePermission";
import logo from '../../assets/auth/logo.png'
import styles from "./index.module.css";
import { useState } from "react";

const { Header, Sider, Content } = Layout;

export default function DashboardLayout({ onLogout }: { onLogout: () => void }) {
  const navigate = useNavigate();
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const location = useLocation();
  const userDataString = localStorage.getItem("userData");
  const userData = userDataString ? JSON.parse(userDataString) : null;

  const username = userData?.user?.full_name || userData?.user?.username || "User";
  const avatarUrl = userData?.user?.avatar;

  // Filter routes dựa trên permissions của user
  const filteredMenu = filterAccessibleRoutes(appRoutes);

  // const getBreadcrumbItems = () => {
  //   let items: any[] = [];

  //   for (const route of appRoutes) {
  //     if (route.children) {
  //       const child = route.children.find((c: any) => c.path === location.pathname);
  //       if (child) {
  //         items.push(route);
  //         items.push(child);
  //         return items;
  //       }
  //     }

  //     if (route.path === location.pathname) {
  //       items.push(route);
  //       return items;
  //     }
  //   }

  //   return items;
  // };

  const normalizePath = (path: string) => {
    // Bỏ :param trong route động
    return path.replace(/:\w+/g, "");
  };

  const getBreadcrumbItems = () => {
    const items: any[] = [];

    for (const route of appRoutes) {
      // 1️⃣ Match route cha (/exam)
      if (
        location.pathname === route.path ||
        location.pathname.startsWith(route.path + "/")
      ) {
        items.push(route);
      }

      // 2️⃣ Match route con có param (/exam/:examId/question)
      if (route.children) {
        const child = route.children.find((c: any) =>
          location.pathname.startsWith(normalizePath(c.path))
        );

        if (child) {
          // tránh push trùng cha
          if (!items.find((i) => i.path === route.path)) {
            items.push(route);
          }
          items.push(child);
          return items;
        }
      }
    }

    return items;
  };

  const breadcrumbItems = getBreadcrumbItems();

  const handleUserMenuClick = ({ key }: { key: string }) => {
    console.log(key)
    if (key === "logout") {
      // Xoá dữ liệu đăng nhập
      localStorage.removeItem("userData"); // nếu lưu info user
      onLogout();
      // Chuyển hướng về login
      navigate("/login", { replace: true });
    }
  };

  const userMenu = {
    items: [
      { key: "logout", label: "Đăng xuất" },
    ],
    onClick: handleUserMenuClick,
  };

  return (
    <Layout style={{ height: "100vh" }}>
      <Sider
        collapsible
        style={{ background: "#f6f9fcff" }}
        className={styles.customSider}
        width={260}          // width khi mở
        collapsedWidth={80}  // width khi đóng
      >
        <img src={logo} className={styles.logo} />
        <Menu
          theme="light"
          mode="inline"
          className={styles.dashboardMenu}
          style={{ background: "none" }}
          selectedKeys={[location.pathname]}
          openKeys={openKeys}
          onOpenChange={(keys) => setOpenKeys(keys)}
          onClick={(e) => navigate(e.key)}
          items={filteredMenu.map((r) => {
            if (r.children) {
              return {
                key: r.path, // key menu cha
                icon: <r.icon size={20} />,
                label: r.label,
                children: r.children.map((c: any) => ({
                  key: c.path, // key con là path con
                  label: c.label,
                })),
              };
            }

            return {
              key: r.path,
              icon: <r.icon size={20} />,
              label: r.label,
            };
          })}
        />

      </Sider>

      <Layout>
        <Header
          style={{
            background: "#fff",
            padding: "0 24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #e8e8e8",
          }}
        >
          <div style={{ fontSize: 20, fontWeight: 600 }}>LOGO</div>

          <Dropdown menu={userMenu} placement="bottomRight">
            <div style={{ display: "flex", alignItems: "center", cursor: "pointer", gap: 8 }}>
              <Avatar src={avatarUrl} icon={!avatarUrl && <UserIcon size={20} />} />
              <span style={{ fontWeight: 500 }}>{username}</span>
            </div>
          </Dropdown>
        </Header>

        <Content style={{ background: "#fff", padding: 24 }}>
          <Breadcrumb style={{ marginBottom: 16 }}>
            {breadcrumbItems.map((item, idx) => (
              <Breadcrumb.Item key={idx}>{item.breadcrumb}</Breadcrumb.Item>
            ))}
          </Breadcrumb>
          {/* <Breadcrumb style={{ marginBottom: 16 }}>
            {breadcrumbItems.map((item, idx) => {
              const isActive =
                location.pathname === item.path ||
                location.pathname.startsWith(item.path + "/");

              const showActiveStyle =
                breadcrumbItems.length > 1 && isActive;

              return (
                <Breadcrumb.Item key={idx}>
                  <span
                    className={`ant-breadcrumb-link ${showActiveStyle ? "breadcrumb-active" : ""
                      }`}
                    onClick={() => {
                      if (!isActive) navigate(item.path);
                    }}
                  >
                    {item.breadcrumb}
                  </span>
                </Breadcrumb.Item>
              );
            })}
          </Breadcrumb> */}

          <Routes>
            {appRoutes.map((route: any) => {
              // Check quyền truy cập route
              if (!canAccessRoute(route)) {
                return (
                  <Route key={route.path} path={route.path} element={<Navigate to="/home" replace />} />
                );
              }

              if (route.children) {
                return route.children.map((child: any) => {
                  // Check quyền truy cập cho child route
                  if (!canAccessRoute(child)) {
                    return (
                      <Route key={child.path} path={child.path} element={<Navigate to="/home" replace />} />
                    );
                  }
                  return (
                    <Route key={child.path} path={child.path} element={<child.element />} />
                  );
                });
              }

              return <Route key={route.path} path={route.path} element={<route.element />} />;
            })}

            <Route path="*" element={<Navigate to="/home" replace />} />
          </Routes>

        </Content>
      </Layout>
    </Layout>
  );
}