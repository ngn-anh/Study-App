# Hướng dẫn sử dụng hệ thống phân quyền trên Frontend Web

## 1. Cấu trúc dữ liệu Permission

Permissions được lưu trữ với format: `module.action`
- **Module**: tên module (user, role, subject, class, etc.)
- **Action**: hành động (create, read, update, delete)

Ví dụ: `user.create`, `role.delete`, `subject.update`

Khi user đăng nhập thành công, permissions sẽ được lưu trong localStorage:
```javascript
localStorage.getItem("userData") // Chứa user.permissions: string[]
```

## 2. Sử dụng Utility Functions

### `hasPermission(permissionCode: string): boolean`
Check xem user có quyền cụ thể không

```typescript
import { hasPermission } from "../../utils/permission";

if (hasPermission("user.create")) {
  console.log("User có quyền tạo user");
}
```

### `hasAnyPermission(permissionCodes: string[]): boolean`
Check xem user có ít nhất 1 trong các quyền

```typescript
if (hasAnyPermission(["user.create", "user.update"])) {
  console.log("User có quyền tạo hoặc cập nhật user");
}
```

### `hasAllPermissions(permissionCodes: string[]): boolean`
Check xem user có tất cả các quyền

```typescript
if (hasAllPermissions(["user.create", "user.delete"])) {
  console.log("User có quyền tạo và xoá user");
}
```

### `getUserPermissions(): string[]`
Lấy danh sách tất cả permissions của user

```typescript
const permissions = getUserPermissions();
console.log(permissions); // ["user.create", "role.update", ...]
```

## 3. Sử dụng Hooks

### `usePermission(permissionCode: string | string[]): boolean`
React Hook để check permission trong component

```typescript
import { usePermission } from "../../utils/usePermission";

export const MyComponent = () => {
  const canCreate = usePermission("user.create");
  const canEdit = usePermission(["user.update", "user.create"]);

  return (
    <div>
      {canCreate && <button>Tạo người dùng</button>}
      {canEdit && <button>Chỉnh sửa</button>}
    </div>
  );
};
```

### `useUserPermissions(): string[]`
Hook để lấy tất cả permissions của user

```typescript
import { useUserPermissions } from "../../utils/usePermission";

export const MyComponent = () => {
  const permissions = useUserPermissions();

  return <div>Bạn có {permissions.length} quyền</div>;
};
```

## 4. Sử dụng PermissionGuard Component

Wrapper component để ẩn/hiện nội dung dựa trên permission

### Ví dụ 1: Single permission
```tsx
import { PermissionGuard } from "../../components/PermissionGuard";

<PermissionGuard requiredPermissions="user.create">
  <Button>Tạo người dùng</Button>
</PermissionGuard>
```

### Ví dụ 2: Multiple permissions (OR logic - ít nhất 1)
```tsx
<PermissionGuard 
  requiredPermissions={["user.create", "user.update"]}
>
  <Button>Tạo hoặc chỉnh sửa người dùng</Button>
</PermissionGuard>
```

### Ví dụ 3: Multiple permissions (AND logic - tất cả)
```tsx
<PermissionGuard 
  requiredPermissions={["user.create", "user.delete"]}
  requireAll
>
  <Button>Tạo và xoá người dùng</Button>
</PermissionGuard>
```

### Ví dụ 4: Với fallback content
```tsx
<PermissionGuard 
  requiredPermissions="user.delete"
  fallback={<span className="text-gray">Bạn không có quyền xoá</span>}
>
  <Button danger>Xoá người dùng</Button>
</PermissionGuard>
```

## 5. Sử dụng ActionButton Component

Component Button tự động check quyền và disable nếu user không có quyền

```tsx
import { ActionButton } from "../../components/ActionButton";

// Ví dụ 1: Button cơ bản
<ActionButton
  permission="user.create"
  text="Tạo người dùng"
  type="primary"
  onClick={() => handleCreate()}
/>

// Ví dụ 2: Button với confirm
<ActionButton
  permission="user.delete"
  text="Xoá"
  danger
  onClick={() => handleDelete()}
  popconfirm={{
    title: "Xác nhận xoá",
    description: "Bạn có chắc muốn xoá người dùng này?",
  }}
/>

// Ví dụ 3: Button với tooltip
<ActionButton
  permission="role.update"
  text="Chỉnh sửa"
  onClick={() => handleEdit()}
  tooltipTitle="Bạn không có quyền chỉnh sửa vai trò"
/>
```

## 6. Định nghĩa Routes với Permission

Update `routes.ts` để thêm `requiredPermissions` cho mỗi route:

```typescript
export const appRoutes = [
  {
    path: "/user",
    label: "Quản lý người dùng",
    icon: User,
    element: UserPage,
    breadcrumb: "Quản lý người dùng",
    requiredPermissions: ["user.read"],
    children: [
      {
        path: "/user/create",
        label: "Tạo người dùng",
        element: CreateUserPage,
        requiredPermissions: ["user.create"],
      },
    ]
  },
];
```

## 7. Filter Routes dựa trên Permission

Layout tự động filter menu items dựa trên permissions:

```typescript
import { filterAccessibleRoutes } from "../../utils/routePermission";

// Trong component Layout
const filteredMenu = filterAccessibleRoutes(appRoutes);
```

## 8. Lưu ý quan trọng

### 8.1 Cách lưu permissions khi user đăng nhập

Khi login thành công, BE phải trả về permissions của user:

```typescript
// BE Response
{
  user: {
    id: "123",
    username: "admin",
    role: "admin",
    permissions: ["user.create", "user.read", "user.update", "role.delete", ...]
  }
}
```

FE lưu vào localStorage:
```typescript
localStorage.setItem("userData", JSON.stringify(response.data));
```

### 8.2 Cập nhật permissions mà không cần reload

Nếu user thay đổi quyền của user khác, cần cập nhật lại permissions:

```typescript
// Sau khi update permissions thành công
const updatedUserData = { ...userData, permissions: newPermissions };
localStorage.setItem("userData", JSON.stringify(updatedUserData));
```

### 8.3 Permission format

Đảm bảo BE trả về permissions đúng format: `module.action`
- ✅ Đúng: `["user.create", "role.delete"]`
- ❌ Sai: `["create_user", "delete_role"]`
- ❌ Sai: `["user", "role"]`

### 8.4 Case sensitive

Permission code là case-sensitive:
- `"user.create"` ✅
- `"User.Create"` ❌

## 9. Ví dụ hoàn chỉnh - Quản lý vai trò

```tsx
import { Button } from "antd";
import { PermissionGuard } from "../../components/PermissionGuard";
import { ActionButton } from "../../components/ActionButton";
import { usePermission } from "../../utils/usePermission";

export const RoleManagement = () => {
  const canCreate = usePermission("role.create");
  const canDelete = usePermission("role.delete");

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <PermissionGuard requiredPermissions="role.create">
          <Button type="primary">+ Tạo vai trò mới</Button>
        </PermissionGuard>
      </div>

      {/* Table Actions */}
      <div>
        <ActionButton
          permission="role.read"
          text="Xem chi tiết"
          onClick={() => handleView()}
        />

        <ActionButton
          permission="role.update"
          text="Chỉnh sửa"
          onClick={() => handleEdit()}
          tooltipTitle="Bạn không có quyền chỉnh sửa"
        />

        <ActionButton
          permission="role.delete"
          text="Xoá"
          danger
          onClick={() => handleDelete()}
          popconfirm={{
            title: "Xác nhận xoá vai trò?",
          }}
          tooltipTitle="Bạn không có quyền xoá"
        />
      </div>
    </div>
  );
};
```

## 10. Checklist khi implement

- [ ] BE trả về `permissions` array khi user login
- [ ] Format permissions: `module.action`
- [ ] FE lưu permissions vào localStorage
- [ ] Update `routes.ts` với `requiredPermissions`
- [ ] Sử dụng `PermissionGuard` hoặc `usePermission` hook
- [ ] Sử dụng `ActionButton` cho các button có quyền hạn
- [ ] Test các scenario: có quyền, không có quyền
