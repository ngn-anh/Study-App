import { Layout, Menu, Dropdown, Avatar, Breadcrumb } from "antd";
import { useNavigate, useLocation, Routes, Route, Navigate } from "react-router-dom";
import { User as UserIcon } from "phosphor-react";
import { appRoutes } from "../../routes";
import { canAccessRoute } from "../../auth";
import logo from '../../assets/auth/logo.png'
import styles from "./index.module.css";

const { Header, Sider, Content } = Layout;

export default function DashboardLayout({ onLogout }: { onLogout: () => void }) {
  const navigate = useNavigate();
  const location = useLocation();
  const userDataString = localStorage.getItem("userData");
  const userData = userDataString ? JSON.parse(userDataString) : null;

  const username = userData?.user?.full_name || userData?.user?.username || "User";
  const avatarUrl = userData?.user?.avatar;

  const userRole = "admin"; // mock — replace later

  const filteredMenu = appRoutes.filter((r: any) => canAccessRoute(r, userRole));

  const breadcrumbItem = appRoutes.find((r: any) => r.path === location.pathname);

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
          onClick={(e: any) => navigate(e.key)}
          items={filteredMenu.map((r: any) => ({
            key: r.path,
            icon: <r.icon size={20} />,
            label: r.label,
          }))}
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
            {breadcrumbItem && <Breadcrumb.Item>{breadcrumbItem.breadcrumb}</Breadcrumb.Item>}
          </Breadcrumb>

          <Routes>
            {appRoutes.map((route: any) =>
              canAccessRoute(route, userRole) ? (
                <Route key={route.path} path={route.path} element={<route.element />} />
              ) : (
                <Route key={route.path} path={route.path} element={<Navigate to="/home" replace />} />
              )
            )}
            <Route path="*" element={<Navigate to="/home" replace />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
}