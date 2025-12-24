# Frontend Permission System - Quick Reference

## 📋 Files Created / Modified

### Utility Functions
- **`utils/permission.ts`** - Core permission checking functions
  - `hasPermission()` - Check single permission
  - `hasAnyPermission()` - Check if user has any of permissions
  - `hasAllPermissions()` - Check if user has all permissions
  - `getUserPermissions()` - Get all user permissions
  - `getPermissionsByModule()` - Group permissions by module
  - `hasModulePermissions()` - Check permissions of specific module

- **`utils/usePermission.ts`** - React Hooks for permissions
  - `usePermission()` - Hook to check permission in components
  - `useUserPermissions()` - Hook to get all user permissions

- **`utils/routePermission.ts`** - Route permission utilities
  - `canAccessRoute()` - Check if user can access route
  - `filterAccessibleRoutes()` - Filter routes based on user permissions

- **`utils/mockPermissions.ts`** - Mock data for development
  - `SAMPLE_PERMISSIONS` - Sample permissions data
  - `setMockUserData()` - Set mock user in localStorage
  - `clearMockUserData()` - Clear mock user

### Components
- **`components/PermissionGuard/index.tsx`** - Wrapper component for permission checking
  - Conditionally render content based on permissions
  - Support single/multiple permissions
  - Support OR/AND logic

- **`components/ActionButton/index.tsx`** - Smart button component
  - Auto-disable if user doesn't have permission
  - Show tooltip when disabled
  - Support popconfirm before action

### Modified Files
- **`routes.ts`** - Updated to use `requiredPermissions` instead of `roles`
  - Each route now has `requiredPermissions: string[]` field
  - Support both parent and child route permissions

- **`component/Layout/index.tsx`** - Updated menu filtering
  - Use `filterAccessibleRoutes()` to filter menu items
  - Remove old `canAccessRoute()` with roles parameter

- **`pages/role/index.tsx`** - Example usage in Role management page
  - Added `PermissionGuard` to wrap create button
  - Added `PermissionGuard` to wrap edit/delete buttons

### Documentation
- **`PERMISSION_GUIDE.md`** - Complete usage guide with examples

---

## 🚀 Quick Start

### 1. Update Backend - When User Login

Make sure BE returns permissions:
```json
{
  "user": {
    "id": "123",
    "username": "admin",
    "permissions": ["user.create", "user.read", "role.delete"]
  }
}
```

### 2. Check Permission in Component

**Using Hook:**
```tsx
import { usePermission } from "utils/permission";

const MyComponent = () => {
  const canCreate = usePermission("user.create");
  return canCreate && <button>Create</button>;
};
```

**Using Guard:**
```tsx
import { PermissionGuard } from "components/PermissionGuard";

<PermissionGuard requiredPermissions="user.create">
  <button>Create</button>
</PermissionGuard>
```

**Using ActionButton:**
```tsx
import { ActionButton } from "components/ActionButton";

<ActionButton
  permission="user.delete"
  text="Delete"
  danger
  onClick={handleDelete}
/>
```

### 3. Define Route Permissions

In `routes.ts`:
```typescript
{
  path: "/user",
  label: "User Management",
  element: UserPage,
  requiredPermissions: ["user.read"],
}
```

---

## 📋 Permission Format

- **Format**: `module.action`
- **Examples**:
  - `user.create` - Create user
  - `role.delete` - Delete role
  - `subject.read` - Read subject

---

## 🧪 Testing with Mock Data

```typescript
import { setMockUserData, clearMockUserData } from "utils/mockPermissions";

// Set admin permissions
setMockUserData("admin");

// Set limited user permissions
setMockUserData("user");

// Clear mock data
clearMockUserData();
```

---

## 🔗 Usage Examples

### Example 1: Role Page with Permissions
See `pages/role/index.tsx` for complete example with:
- Create button (requires `role.create`)
- Edit button (requires `role.update`)
- Delete button (requires `role.delete`)

### Example 2: Multiple Permissions
```tsx
<PermissionGuard 
  requiredPermissions={["user.create", "user.update"]}
>
  <button>Create or Update</button>
</PermissionGuard>
```

### Example 3: All Permissions Required
```tsx
<PermissionGuard 
  requiredPermissions={["role.create", "role.delete"]}
  requireAll
>
  <button>Both Create and Delete</button>
</PermissionGuard>
```

---

## ⚠️ Important Notes

1. **Client-side only**: This is client-side permission checking only
   - Always validate permissions on BE too!
   - User can cheat by modifying localStorage

2. **Permission format**: Always use lowercase `module.action`
   - ✅ Correct: `user.create`
   - ❌ Wrong: `User.Create`, `user_create`

3. **localStorage dependency**: Permissions are read from localStorage
   - Must be set when user logs in
   - Clear when user logs out

4. **Case sensitive**: Permission codes are case-sensitive

---

## 📞 Support

For more details, see `PERMISSION_GUIDE.md`
